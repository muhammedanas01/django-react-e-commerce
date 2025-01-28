from django.shortcuts import render, redirect
from django.conf import settings
import requests
from userauths.models import User
from store.models import Product, Category
from store.serializer import ProductSerializers, CategorySerializers, CartSerializers, CartOrderItemSerializers, CartOrderSerializers, CouponSerializers, ReviewSerializers
from store.models import (
    Gallery,
    Specification,
    Size,
    Color,
    Cart,
    CartOrder,
    CartOrderItem,
    Wishlist,
    ProductFaq,
    Review,
    Notification,
    Coupon,
    Tax,
)

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal

import stripe

from django.core.mail import send_mail
import threading

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags


stripe.api_key = settings.STRIPE_PRIVATE_KEY

def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user = user,
        vendor = vendor,
        order = order,
        order_item = order_item
    )
# ListAPIView to handle HTTP GET requests
class CategoryListApiView(generics.ListAPIView):
    """
    this view shows all the categories
    """

    # The ListAPIView method calls get_queryset() to fetch the queryset. By default, it uses the queryset attribute and passes to serializer.
    queryset = Category.objects.all()
    # specify serializer this view must interact with to transform the queryset objects into Json
    serializer_class = CategorySerializers
    permission_classes = [
        AllowAny,
    ]  # without autheraisation user can acces this view


class ProductListApiView(generics.ListAPIView):
    """
    this view is to list all products
    """

    # The ListAPIView method calls get_queryset() to fetch the queryset. By default, it uses the queryset attribute and passes to serializer.
    queryset = Product.objects.all()
    # specify serializer this view must interact with to transform the queryset objects into Json
    serializer_class = ProductSerializers
    permission_classes = [
        AllowAny,
    ]  # without autheraisation user can access this view


class ProductDetailApiView(generics.RetrieveAPIView):
    """
    this view is works when user clicked on a product for detailed view
    """

    serializer_class = ProductSerializers
    permission_classes = [AllowAny]

    # This method overrides the default method to fetch a specific object based on the slug parameter from the URL.
    def get_object(self):
        slug = self.kwargs["slug"]  # slug from url
        return Product.objects.get(slug=slug)


class CartApiView(generics.ListCreateAPIView):
    """this view is to add product to cart according to user chosen size,color and qty"""

    queryset = Cart.objects.all()
    serializer_class = CartSerializers
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data.copy()  # payload is data sent from frontend

        product_id = payload["product_id"]
        user_id = payload["user_id"]
        item_quantity = payload.get("item_quantity")
        price = payload.get("price")
        shipping_amount = payload.get("shipping_amount")
        country = payload.get("country")
        size = payload.get("size")
        color = payload.get("color")
        cart_id = payload.get("cart_id")

        product = Product.objects.get(id=product_id)
        # if user is guest user
        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        tax = Tax.objects.filter(country=country).first()  # When you expect or need only a single object from the queryset use first.
        if tax:
            tax_rate = tax.rate / 100
        else:
            tax_rate = 0
        """
        checks if there is a cart with same cart_id in Cart model,
        and also same product if it exist it updates 
        """
        cart = Cart.objects.filter(cart_id=cart_id, product=product).first()

        if cart:
            cart.product = product
            cart.user = user
            cart.item_quantity = item_quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(item_quantity)
            cart.shipping_amount = Decimal(shipping_amount) * int(item_quantity)
            cart.tax = Decimal(cart.sub_total) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 2 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax
            cart.save()

            return Response({"message": "cart updated Successfully."}, status=status.HTTP_200_OK)

        else:
            """
            if cart doest'nt exist creates new cart
            """
            cart = Cart()  # creates a new cart
            cart.product = product
            cart.user = user
            cart.item_quantity = item_quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(item_quantity)
            cart.shipping_amount = Decimal(shipping_amount) * int(item_quantity)
            cart.tax = Decimal(cart.sub_total) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 2 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax
            cart.save()

            return Response({"message": "cart added Successfully."}, status=status.HTTP_201_CREATED)


class CartListView(generics.ListAPIView):
    """this view is to list all products in cart"""

    serializer_class = CartSerializers
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]  # key is must
        user_id = self.kwargs.get("user_id")  # if no user user_id key it wont raise error if user it takes value

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset


class CartDetailView(generics.RetrieveAPIView):
    """
    this view is for cart summary, this doesn't need any user interaction
    it works in useEffect when page is mounting.
    """

    serializer_class = CartSerializers
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    # function to get queryset
    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    # qty * shipping amount
    def calculate_shipping(self, cart_item):
        return cart_item.shipping_amount

    # q
    def calculate_tax(self, cart_item):
        return cart_item.tax

    # service_fee_percentage * subtotal
    def calculate_service_fee(self, cart_item):
        return cart_item.service_fee

    # qty * price
    def calculate_sub_total(self, cart_item):
        return cart_item.sub_total

    # total =  cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax
    def calculate_grand_total(self, cart_item):
        return cart_item.total

    # overiding default method
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        grand_total = 0.0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            grand_total += float(self.calculate_grand_total(cart_item))
        data = {
            "shipping": total_shipping,
            "tax": total_tax,
            "service_fee": total_service_fee,
            "sub_total": total_sub_total,
            "total": grand_total,
        }
        return Response(data)


class CartItemDeleteApiView(generics.DestroyAPIView):
    """
    this view is called when user clicked on remove button on cart item
    """

    serializer_class = CartSerializers
    lookup_field = "cart_id"

    def get_object(self):
        # keyword arguments in the URL
        cart_id = self.kwargs["cart_id"]
        item_id = self.kwargs["item_id"]
        user_id = self.kwargs.get("user_id")

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, cart_id=cart_id, user=user)
        else:
            cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart


class CreateOrderApiView(generics.CreateAPIView):
    """
    This view is called when the user clicks on the 'Proceed to Checkout' button on the cart page.
    It creates a CartOrder for the items in the cart and then navigates to the
    CheckOutApiView endpoint in the frontend
    """

    serializer_class = CartOrderSerializers
    queryset = CartOrder.objects.all()
    permission_classes = [AllowAny]

    def create(self, request):
        payload = request.data
        cart_id = payload["cart_id"]
        user_id = payload["user_id"]
        full_name = payload["full_name"]
        email = payload["email"]
        mobile = payload["mobile"]
        address = payload["address"]
        city = payload["city"]
        landmark = payload["landmark"]
        state = payload["state"]
        postal_code = payload["postalcode"]
        country = payload["country"]

        if user_id == "0":
            user = None
        else:
            user = User.objects.get(id=user_id)

        total_shipping = Decimal(0.00)
        total_tax = Decimal(0.0)
        total_service_fee = Decimal(0.0)
        total_sub_total = Decimal(0.0)
        total_initial_total = Decimal(0.0)
        grand_total = Decimal(0.0)

        """
        CartOrder Represents an order made by a user, 
        which can contain multiple items.

        """
        order = CartOrder.objects.create(
            buyer=user,
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            landmark=landmark,
            city=city,
            postal_code=postal_code,
            state=state,
            country=country,
        )
        """
        here for all item in cart_items it creates a new CartOrderItem.
        CartOrderItem represents each indivijual item in a cart
        """
        cart_items = Cart.objects.filter(cart_id=cart_id)  # cart_id is from payload

        for c in cart_items:
            CartOrderItem.objects.create(
                order=order,  # This represents the order in which this item is present.
                product=c.product,
                vendor=c.product.vendor,
                item_quantity=c.item_quantity,
                price=c.price,
                size=c.size,
                country=c.country,
                color=c.color,
                sub_total=c.sub_total,
                shipping_amount=c.shipping_amount,
                service_fee=c.service_fee,
                tax=c.tax,
                total=c.total,
                initial_total=c.total,  # this is to know what was the original total before applying coupen
            )
            """
            Accumulates the value of each product's price, tax, service fee, etc.
            during each loop iteration to easily calculate the grand total.
            Only the grand total is stored in the CartOrder.

            """

            total_shipping += Decimal(c.shipping_amount)
            total_tax += Decimal(c.tax)
            total_service_fee += Decimal(c.service_fee)
            total_sub_total += Decimal(c.sub_total)
            total_initial_total += Decimal(c.total)
            grand_total += Decimal(c.total)

            order.vendor.add(c.product.vendor)
        """
            after loop breaks, each acumilated value of item is assinged to CartOrder,
            order ==== CartOrder
        """
        order.sub_total = total_sub_total
        order.shipping_amount = total_shipping
        order.service_fee = total_service_fee
        order.tax = total_tax
        order.initial_total = total_initial_total
        order.total = grand_total

        order.save()
        print("CartOrder instance is created order id ====== ",order.order_id)
        return Response({"message": "order created successfully", "order_id": order.order_id}, status=status.HTTP_201_CREATED)


class CheckOutView(generics.RetrieveAPIView):
    """
    When the CartOrderApiView is called upon the user clicking the 'Proceed to Checkout' button,
    we will navigate to this view's endpoint within that function.

    here we show shipping address(we got it from cart page without shipping address user cant click
    on 'Proceed To Checkout' button)and order summary
    """

    serializer_class = CartOrderSerializers
    lookup_field = "order_id"

    def get_object(self):
        order_id = self.kwargs["order_id"]
        order = CartOrder.objects.get(order_id=order_id)
        if order is not None:
            return order


class CouponApiView(generics.CreateAPIView):
    """
    how coupon is applied?
    step 1: get order_id and coupen_code from payload
    step 2: get the order from CartOrder(model) using order_id
    step 3: get coupon from Coupon(model).

    N0TE: every CartOrderItem has a order field which allows us to know in which CartOrder this item is at
    N0TE: every Coupon has a vendor, we need to filter items from CartOrderItem using order field and vendor.
    N0TE: we will know who is the vendor when geting coupon from Coupon(model)

    step 4: filter order items with coupon using order and vendor
    step 5: calculates the discount using coupon code and item total
    step 6: reduce discount from item total(subtotal+shipping+tax) and item subtotal(price*qty(item))
    step 7: add coupon and saved to CartOrderItem fields

    step 8: reduce CartOrder total(grand total) and subtotal from discount
    step 9: assing discount to saved filed in CartOrder
    """

    serializer_class = CouponSerializers
    queryset = Coupon.objects.all()
    permission_classes = [
        AllowAny,
    ]

    def create(self, request):
        payload = request.data

        order_id = payload["order_id"]
        coupon_code = payload["coupon_code"]

        order = CartOrder.objects.get(order_id=order_id)
        
        #first checks for if a coupen exist, if exist filter and get item by order and vendor
        coupon = Coupon.objects.filter(code=coupon_code).first()
        if not coupon:
            return Response({"message": "Coupon does not exist", "icon": "error"}, status=status.HTTP_404_NOT_FOUND)

        # filtering items from a order where vendor has given coupon
        order_items_with_coupon = CartOrderItem.objects.filter(order=order, vendor=coupon.vendor)
        for item in order_items_with_coupon:
            print("========",item.product.title)

        if not order_items_with_coupon.exists():
            return Response({"message": "This coupon cannot be applied to any of your cart items", "icon": "error"}, status=status.HTTP_400_BAD_REQUEST)

        coupon_applied = False
            
        for item in order_items_with_coupon:
            if coupon not in item.coupon.all():  # Apply coupon only if not already applied
                discount = item.total * coupon.discount / 100
                item.total -= discount
                item.sub_total -= discount
                item.coupon.add(coupon)
                item.saved += discount

                order.total -= discount
                # order.sub_total -= discount
                order.saved += discount

                item.save()
                order.save()
                coupon_applied = True
            
        if coupon_applied:
            order.save()
            return Response({"message": "Coupon activated successfully", "icon": "success"}, status=status.HTTP_202_ACCEPTED)

                    

class StripeCheckoutView(generics.CreateAPIView):
    """
    this view is called when clicks on "pay with stripe button" in CheckOutView
    when buton clicked the the order_id will be passed to url eg:path('stripe-checkout/<order_id>/
    using that order_id info we will setUp stripe payment.
    """
    serializer_class = CartOrderSerializers
    permission_classes = [
        AllowAny,
    ]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        order_id = self.kwargs["order_id"]
        order = CartOrder.objects.get(order_id=order_id)

        if not order:
            return Response({"message": "order does not exist"}, status=status.HTTP_404_NOT_FOUND)

        try:    
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "AED",
                            "product_data": {
                                "name": order.full_name,
                            },
                            "unit_amount": int(order.total * 100),
                        },
                        'quantity': 1,
                    }
                ],
                mode='payment', 
            #here when payment is success we are telling stripe to redirect to this given url with order_id and session_id
            #vise versa for cancel also
                success_url= "http://localhost:5173/payment-success/" + order.order_id + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url = "http://localhost:5173/payment-failed/?session_id={CHECKOUT_SESSION_ID}"
            )
            #updating session_id in order
            order.stripe_session_id = checkout_session.id
            order.save()

            return redirect(checkout_session.url)
        except stripe.error.StripeError as e:
            return Response({"message":f"something went wrong in checkout session:{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

def get_access_token(client_id, secret_id):
    token_url = 'https://api.sandbox.paypal.com/v1/oauth/token/'
    data = {'grand_type':'client_credentials'}
    auth = {client_id, secret_id}

    response = requests.post(token_url, data=data, auth=auth)
    if response.status_code == 200:
        print("Access Token:", response.json()['access_token'])
    else:
        raise Exception(f"failed to get access code{response.status_code}")
class PaymentSuccessView(generics.CreateAPIView):
    """
    this view works after the payment is  successfull.
    after successfull payment it redirect's to payment-success component in frontend,
    from there when component is mounting using useEffect and param we get order_id and session_id,
    from url and call api instance to this view. 
    """
    
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny,]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        payload = request.data
        order_id = payload['order_id']
        session_id = payload['session_id']
       
        order = CartOrder.objects.get(order_id=order_id)
        order_items = CartOrderItem.objects.filter(order=order)

        #get_access_token(12, 12)
       
        if session_id != "null":
            session =  stripe.checkout.Session.retrieve(session_id)

            if session.payment_status == "paid":
                if order.payment_status == "pending":
                    order.payment_status = 'paid'
                print(f"Current order status+++++++++%%%%%%: {order.order_status}")
                if order.order_status == "pending":    
                    order.order_status = "order confirmed"

                    order.save()
                    print(f"after order status+++++++++%%%%%%: {order.order_status}")

                    
                    response = Response({"message": "Payment Successful"})
                    threading.Thread(target=self.send_notifications_and_email, args=(order, order_items)).start()
                    return response
                            
                else:
                    return Response({"message":"Payment Already Received"})              
            elif session.payment_status == "unpaid":
                    return Response({"message":"Unpaid"})
            else:
                return Response({"message":"An Error Occured, Try Again"})
        else:
            session = None

    def send_notifications_and_email(self, order, order_items):
        self.notify_customer(order)  
          
        for item in order_items:
            self._notify_vendor(order, item)
    
    def notify_customer(self, order):
        if order.buyer:
            send_notification(user=order.buyer, order=order) 
            try:
                html_content = render_to_string('email_templates/order_confirmation.html', {'order': order})
                send_mail(
                    "Order Confirmed",
                    strip_tags(html_content),
                    "mohdanas658@gmail.com",
                    [order.buyer.email],
                    html_message=html_content,
                )
            except Exception as e:
                print(f"Failed to send email to customer: {e}")

    def _notify_vendor(self, order, item):
        send_notification(order=order, vendor=item.vendor, order_item=item)
        try:
            html_content = render_to_string('email_templates/vendor_notification.html', {'order': order, 'item': item})
            send_mail(
                f"Your product {item.product.title} has been purchased",
                strip_tags(html_content),
                "mohdanas658@gmail.com",
                [item.vendor.user.email],
                html_message=html_content,
            )
        except Exception as e:
            print(f"Failed to send email to vendor {item.vendor.user.email}: {e}")

    
    # def send_notifications_and_email(self, order, order_items):
    #         """
    #         This method handles sending notifications and emails asynchronously after the response.
    #         """
    #         # Send notification to the customer
    #         if order.buyer is not None:
    #             send_notification(user=order.buyer, order=order)
    #             try:
    #                 send_mail(
    #                     "Order Confirmed",
    #                     "Your order has been confirmed.",
    #                     "mohdanas658@gmail.com",
    #                     [order.buyer.email],
    #                 )
    #                 print("Customer email sent successfully")
    #             except Exception as e:
    #                 print(f"Failed to send email to customer: {e}")

    #         # Send notifications to vendors
    #         for item in order_items:
    #             send_notification(order=order, vendor=item.vendor, order_item=item)
    #             try:
    #                 send_mail(
    #                     f"your producr {item.product.title} has been purchased",
    #                     "Your order has been confirmed.",
    #                     "mohdanas658@gmail.com",
    #                     [item.vendor.user.email]
    #                 )
    #                 print("Customer email sent successfully")
    #             except Exception as e:
    #                 print(f"Failed to send email to vendor{item.vendor.user.email}: {e}")

class ReviewListApiView(generics.ListCreateAPIView):
    """
    this view get the products which has review
    """
    serializer_class = ReviewSerializers
    permission_classes = [AllowAny,]

    def get_queryset(self):
        product_id = self.kwargs['product_id']

        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        return reviews
    
    def create(self, request, *args, **kwargs):
        payload = request.data

        user_id = payload['user_id']
        product_id = payload['product_id']
        rating  = payload['rating']
        review  = payload['review']

        user = User.objects.get(id=user_id) 
        product = Product.objects.get(id=product_id)

        Review.objects.create(
            user=user,
            product=product,
            rating=rating,
            review=review
        )

        return Response({"message":"review created successfully"}, status=status.HTTP_200_OK)
    
class SearchProductApiView(generics.ListCreateAPIView):
    serializer_class = ProductSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
       query = self.request.GET.get("query")
       print("Query45454545455735453dghth3465654656------------:", query)
       products = Product.objects.filter(status="published", title__icontains=query)#title__icontains is a field lookup used to perform a case-insensitive search 
       return products