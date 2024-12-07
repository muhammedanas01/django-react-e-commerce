from django.shortcuts import render

from userauths.models import User
from store.models import Product, Category
from store.serializer import ProductSerializers, CategorySerializers, CartSerializers, CartOrderItemSerializers, CartOrderSerializers
from store.models import Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Wishlist, ProductFaq, Review, Notification, Coupon, Tax

from rest_framework import generics, status 
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal

#ListAPIView to handle HTTP GET requests

class CategoryListApiView(generics.ListAPIView):
    #The ListAPIView method calls get_queryset() to fetch the queryset. By default, it uses the queryset attribute and passes to serializer.
    queryset = Category.objects.all()
    #specify serializer this view must interact with to transform the queryset objects into Json
    serializer_class = CategorySerializers
    permission_classes = [AllowAny, ] #without autheraisation user can acces this view

class ProductListApiView(generics.ListAPIView):
    #The ListAPIView method calls get_queryset() to fetch the queryset. By default, it uses the queryset attribute and passes to serializer.
    queryset = Product.objects.all()
    #specify serializer this view must interact with to transform the queryset objects into Json
    serializer_class = ProductSerializers
    permission_classes = [AllowAny, ] #without autheraisation user can access this view

class ProductDetailApiView(generics.RetrieveAPIView):
   serializer_class = ProductSerializers
   permission_classes = [AllowAny]
   #This method overrides the default method to fetch a specific object based on the slug parameter from the URL.
   def get_object(self):
       slug = self.kwargs['slug'] # slug from url
       return Product.objects.get(slug = slug)

""" this view is for to handle the cart """  
class CartApiView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializers
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data.copy() # payload is data sent from frontend 
        print(payload)

        product_id = payload['product_id']
        user_id = payload['user_id']
        item_quantity = payload.get('item_quantity')
        price = payload.get('price')
        shipping_amount = payload.get('shipping_amount')
        country = payload.get('country')
        size = payload.get('size')
        color = payload.get('color')
        cart_id = payload.get('cart_id')
       
        product = Product.objects.get(id=product_id)
        #if user is guest user
        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None


        tax = Tax.objects.filter(country = country).first() # When you expect or need only a single object from the queryset use first.
        if tax:
            tax_rate = tax.rate / 100
        else :
            tax_rate = 0

        # checks if there is a cart with same id in Cart model coming from payload and also same product
        cart = Cart.objects.filter(cart_id=cart_id, product = product).first()

        if cart:
            cart.product = product
            cart.user = user
            cart.item_quantity =  item_quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(item_quantity)
            cart.shipping_amount = Decimal(shipping_amount) * int(item_quantity)
            cart.tax = int(item_quantity) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10 / 100
            cart.service_fee = service_fee_percentage * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax
            cart.save()

            return Response({'message': "cart updated Successfully."}, status=status.HTTP_200_OK)

        else:
            #if cart dosen't exist
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.item_quantity =  item_quantity
            cart.price = price
            cart.sub_total = Decimal(price) * int(item_quantity)
            cart.shipping_amount = Decimal(shipping_amount) * int(item_quantity)
            cart.tax = int(item_quantity) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 10 / 100
            cart.service_fee = service_fee_percentage * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax
            cart.save()

            return Response({'message': "cart added Successfully."}, status=status.HTTP_201_CREATED)


