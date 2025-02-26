from django.forms import ValidationError
from django.http import Http404
from django.shortcuts import render
from django.shortcuts import render, redirect
from django.conf import settings
import requests
from userauths.models import User
from store.models import Product, Category
from vendor.models import Vendor
from django.db import models, transaction
from django.db.models import Sum, F, ExpressionWrapper, DecimalField
from django.db.models.functions import ExtractMonth


from rest_framework.decorators import api_view

from store.serializer import ProductSerializers, CategorySerializers, CartSerializers, CartOrderItemSerializers, CartOrderSerializers, CouponSerializers, ReviewSerializers, WishlistSerializers, NotificationSerializers, SummarySerializer, EarningSerializer, CouponSummarySerializer, NotificationSummarySerializer, VendorSerializers, SpecificationSerializers, ColorSerializers, GallerySerializers, SizeSerializers
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
from userauths.models import Profile
from customer.serializer import ProfileSerializer

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

from datetime import datetime, timedelta

# Create your views here.

class DashboardStatsApiView(generics.ListAPIView):
    serializer_class = SummarySerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        #calculate the summary values
        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = CartOrder.objects.filter(vendor=vendor, payment_status="paid").count()
        revenue = CartOrderItem.objects.filter(
            vendor=vendor, order__payment_status="paid"
        ).aggregate(
            total_revenue=Sum(
                ExpressionWrapper(F('sub_total') + F('shipping_amount'), output_field=DecimalField(max_digits=10, decimal_places=2))
            )
        )['total_revenue'] or 0
        return [
            {
                'products':product_count,
                'orders': order_count,
                'revenue': revenue  
            }
        ]
    
    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def MonthlyOrderChartApiView(request, vendor_id):
      vendor = Vendor.objects.get(id=vendor_id)
      orders = CartOrder.objects.filter(vendor=vendor, payment_status="paid")
      order_by_month = orders.annotate(month=ExtractMonth("date")).values("month").annotate(orders=models.Count("id")).order_by("month")
      return Response(order_by_month)
    
@api_view(['GET'])
def MonthlyProductChartApiView(request, vendor_id):
      vendor = Vendor.objects.get(id=vendor_id)
      products = Product.objects.filter(vendor=vendor)
      product_by_month = products.annotate(month=ExtractMonth("date")).values("month").annotate(orders=models.Count("id")).order_by("month")
      return Response(product_by_month)

class VendorProductApiView(generics.ListAPIView):
    serializer_class = ProductSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        return Product.objects.filter(vendor=vendor).order_by('-id')
    
class OrderApiView(generics.ListAPIView):
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        return CartOrder.objects.filter(vendor=vendor, payment_status = "paid").order_by('-id')

from django.shortcuts import get_object_or_404 
class OrderDetailApiView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny]
    lookup_field = "order_id"  # Set lookup field to match the URL

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = get_object_or_404(Vendor, id=vendor_id)

        return CartOrder.objects.get(vendor=vendor)  # Must return a queryset

    def get_object(self):
        """Retrieve a single order based on vendor and order_id"""
        vendor_id = self.kwargs['vendor_id']
        order_id = self.kwargs['order_id']
        
        vendor = get_object_or_404(Vendor, id=vendor_id)
        return get_object_or_404(CartOrder, vendor=vendor, order_id=order_id)
    

class RevenueApiView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny]
    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        return CartOrderItem.objects.filter(vendor_id=vendor_id, order__payment_status="paid")

    def retrieve(self, request, *args, **kwargs):
        vendor_id = self.kwargs['vendor_id']

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            return Response({"error": "Vendor not found"}, status=404)

        revenue = CartOrderItem.objects.filter(
            vendor=vendor, order__payment_status="paid"
        ).aggregate(
            total_revenue=Sum(
                ExpressionWrapper(F('sub_total') + F('shipping_amount'), output_field=DecimalField())
            )
        )['total_revenue'] or Decimal(0)  # Default to 0 if no revenue

        return Response({"total_revenue": float(revenue)})  # Wrap in a dictionary

 ##      
class FilterProductApiView(generics.ListAPIView):
    serializer_class = ProductSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        filter = self.request.GET.get('filter')

        if filter == "published":
            products = Product.objects.filter(vendor=vendor, status="published")
        elif filter == "in_review":
            products = Product.objects.filter(vendor=vendor, status="in_review")
        elif filter == "draft":
            products = Product.objects.filter(vendor=vendor, status="draft")
        elif filter == "disabled":
            products = Product.objects.filter(vendor=vendor, status="disabled")
        else:
            products = Product.objects.filter(vendor=vendor)

        return products
    
class EarningApiView(generics.ListAPIView):
    serializer_class = EarningSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        one_month_ago = datetime.today() - timedelta(days=28)

        monthly_revenue = CartOrderItem.objects.filter(
            vendor=vendor, order__payment_status="paid", date__gte=one_month_ago
        ).aggregate(
            total_revenue=Sum(
                ExpressionWrapper(F('sub_total') + F('shipping_amount'), output_field=DecimalField())
            )
        )['total_revenue'] or Decimal(0)  # Default to 0 if no revenue

        total_revenue = CartOrderItem.objects.filter(
            vendor=vendor, order__payment_status="paid",
        ).aggregate(
            total_revenue=Sum(
                ExpressionWrapper(F('sub_total') + F('shipping_amount'), output_field=DecimalField())
            )
        )['total_revenue'] or Decimal(0)  # Default to 0 if no revenue

        return {
            "total_revenue": float(total_revenue),
            "monthly_revenue": float(monthly_revenue)
        }
    
    def list(self, *args, **kwargs):
        data = self.get_queryset()
        return Response(data)

@api_view(['GET'])
def MonthlyEarningTracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        CartOrderItem.objects
        .filter(vendor=vendor, order__payment_status="paid")
        .annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(
            sales_account = models.Sum("item_quantity"),
            total_earning = models.Sum(
                models.F('sub_total') + models.F('shipping_amount')
            )
        ).order_by('-month')
    )

    return Response(monthly_earning_tracker)

class ReviewListApiView(generics.ListAPIView):
    serializer_class = ReviewSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Review.objects.filter(product__vendor=vendor)
     
class ReviewDetailApiView(generics.RetrieveUpdateAPIView):
    #not working 
    serializer_class = ReviewSerializers
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        review_id = self.kwargs['review_id']

        vendor = Vendor.objects.get(id=vendor_id)
        review = Review.objects.get(id=review_id, product__vendor=vendor)

        return review
    
class CouponListApiView(generics.ListCreateAPIView):
    serializer_class = CouponSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        return Coupon.objects.filter(vendor=vendor)
    #create not seen in api
    def create(self, request, *args, **kwargs):
        payload = request.data

        vendor_id = payload['vendor_id']
        code = payload['code']
        discount = payload['discount']
        active = payload['active']

        vendor = Vendor.objects.get(id=vendor_id)
        Coupon.objects.create(vendor=vendor, code=code, discount=discount, 
                              seen=(active.lower()=="true")
                              )
        
        return Response({"message":"coupon created successfully"}, status=status.HTTP_201_CREATED)

from rest_framework.exceptions import NotFound
class CouponDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CouponSerializers
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        coupon_id = self.kwargs['coupon_id']
        
        # Debugging logs
        print(f"Fetching coupon for vendor ID {vendor_id} and coupon ID {coupon_id}")

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            raise NotFound("Vendor not found")

        try:
            coupon = Coupon.objects.get(vendor=vendor, id=coupon_id)
        except Coupon.DoesNotExist:
            raise NotFound("Coupon not found for this vendor")
        print(f"Coupon data: {coupon}")
        return coupon

class CouponStatsApiView(generics.ListAPIView):
    serializer_class = CouponSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        total_coupons = Coupon.objects.filter(vendor=vendor).count()
        active_coupons = Coupon.objects.filter(vendor=vendor).count()

        return [{
            "total_coupons":total_coupons,
            "active_coupons": active_coupons
        }]
    
    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class NotificationApiView(generics.ListAPIView):
    serializer_class = NotificationSerializers##
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Notification.objects.filter(vendor=vendor, seen=False).order_by('-id')

class NotificationSeenApiView(generics.ListAPIView):
    serializer_class = NotificationSerializers##
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)
        return Notification.objects.filter(vendor=vendor, seen=True).order_by('-id')

class NotificationSummaryApiView(generics.ListAPIView):
    serializer_class = NotificationSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        vendor = Vendor.objects.get(id=vendor_id)

        unread_notification = Notification.objects.filter(vendor=vendor, seen=False).count()
        read_notification = Notification.objects.filter(vendor=vendor, seen=True).count()
        all_notification = Notification.objects.filter(vendor=vendor).count()

        return [{
            "unread_notification": unread_notification,
            "read_notification": read_notification,
            "all_notification": all_notification,
        }]
    
    def list(self, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MarkVendorNotificationAsSeen(generics.RetrieveAPIView):
    serializer_class =  NotificationSerializers##
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        notification_id = self.kwargs['notification_id']  

        vendor = Vendor.objects.get(id=vendor_id)
        print(vendor)
        noti = Notification.objects.get(vendor=vendor, id=notification_id)

        noti.seen = True
        noti.save()

        return noti 

class VendorProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

class ShopUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializers
    permission_classes = [AllowAny]


class ShopApiView(generics.RetrieveAPIView):
    serializer_class = VendorSerializers
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_slug = self.kwargs.get('vendor_slug')  # Use .get() to prevent KeyError
        if not vendor_slug:
            raise NotFound("Vendor slug is required")

        try:
            return Vendor.objects.get(slug=vendor_slug)
        except Vendor.DoesNotExist:
            raise NotFound("Vendor not found")
    
class ShopProductApiView(generics.ListAPIView):
    serializer_class = ProductSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_slug = self.kwargs['vendor_slug']
        vendor = Vendor.objects.get(slug=vendor_slug)

        products = Product.objects.filter(vendor=vendor)

        return products
    
class ProductCreateApiView(generics.CreateAPIView):
   serializer_class = ProductSerializers
   permission_classes = [AllowAny]
   queryset = Product.objects.all()
   @transaction.atomic
   def perform_create(self, serializer):
       serializer.is_valid(raise_exception = True)

       serializer.save()

       product_instance = serializer.instance

       Specification_data = []
       colors_data = []
       sizes_data = []
       gallery_data = []

       payload = self.request.data.items()

       for key, value in self.request.data.items():
            if key.startswith('specification') and 'title' in key:
               index = key.split('[')[1].split(']')[0]

               title = value
               content_key = f"specifications[{index}][content]"
               content = self.request.data.get(content_key)

               Specification_data.append({'title': title, 'content':content})

            elif key.startswith('colors') and 'name' in key:
               index = key.split('[')[1].split(']')[0]

               name = value
               color_code_key = f"colors[{index}][color_code]"
               color_code = self.request.data.get(color_code_key)

               colors_data.append({'name': name, 'color_code':color_code}) 
            
            elif key.startswith('sizes') and 'name' in key:
                index = key.split('[')[1].split(']')[0]  # Extract the index
                name = value  # Name of the size
                price_key = f"sizes[{index}][price]"  # ✅ Correct field name
                price = self.request.data.get(price_key, 0)  # Default to 0 if not found
                
                sizes_data.append({'name': name, 'price': price})

            
            elif key.startswith('gallery') and 'image' in key:
               index = key.split('[')[1].split(']')[0]
               image = value
               gallery_data.append({'image': image})

       print("specification Data========", Specification_data)
       print("colors Data========", colors_data)
       print("sizes Data========", sizes_data)
       print("gallery Data=========", gallery_data)

       self.save_nested_data(product_instance, SpecificationSerializers, Specification_data) 
       self.save_nested_data(product_instance, ColorSerializers, colors_data) 
       self.save_nested_data(product_instance, SizeSerializers, sizes_data) 
       self.save_nested_data(product_instance, GallerySerializers, gallery_data)

   def save_nested_data(self, product_instance, serializer_class, data):
        serializer = serializer_class(data=data, many=True, context={'product_instance':product_instance})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product_instance)

class ProductUpdateApiView(generics.RetrieveUpdateAPIView):
    serializer_class = ProductSerializers
    permission_classes = [AllowAny]
    queryset = Product.objects.all()

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_id = self.kwargs['product_id']

        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(id=product_id, vendor=vendor)

        return product

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        product = self.get_object()

        # Ensure `request.FILES` is used for images
        data = request.data.copy()
        if 'image' in request.FILES:
            data['image'] = request.FILES['image']

        serializer = self.get_serializer(product, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Delete and recreate related data
        product.specification_set.all().delete()
        product.color_set.all().delete()
        product.size_set.all().delete()
        product.gallery_set.all().delete()

        specification_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []

        for key, value in request.data.items():
            if key.startswith('specifications') and 'title' in key:
                index = key.split('[')[1].split(']')[0]
                title = value
                content = request.data.get(f"specifications[{index}][content]")
                specification_data.append({'title': title, 'content': content})

            elif key.startswith('colors') and 'name' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code = request.data.get(f"colors[{index}][color_code]")
                colors_data.append({'name': name, 'color_code': color_code})

            elif key.startswith('sizes') and 'name' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                price = request.data.get(f"sizes[{index}][price]", 0)
                sizes_data.append({'name': name, 'price': price})

            elif key.startswith('gallery') and 'image' in key:
                index = key.split('[')[1].split(']')[0]
                if f"gallery[{index}][image]" in request.FILES:
                    image = request.FILES[f"gallery[{index}][image]"]
                    gallery_data.append({'image': image})

        print("specification Data========", specification_data)
        print("colors Data========", colors_data)
        print("sizes Data========", sizes_data)
        print("gallery Data=========", gallery_data)

        self.save_nested_data(product, SpecificationSerializers, specification_data)
        self.save_nested_data(product, ColorSerializers, colors_data)
        self.save_nested_data(product, SizeSerializers, sizes_data)
        self.save_nested_data(product, GallerySerializers, gallery_data)
        return Response({"detail": "Product updated successfully."}, status=status.HTTP_200_OK) 
    def save_nested_data(self, product, serializer_class, data_list):
        for data in data_list:
            serializer = serializer_class(data=data)
            if serializer.is_valid():
                serializer.save(product=product)
            else:
                raise ValidationError(serializer.errors)
            
            
class ProductDeleteApiView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_id = self.kwargs['product_id']

        try:
            vendor = Vendor.objects.get(id=vendor_id)
        except Vendor.DoesNotExist:
            raise NotFound(detail="Vendor not found.")

        try:
            product = Product.objects.get(id=product_id, vendor=vendor)
        except Product.DoesNotExist:
            raise NotFound(detail="Product not found.")

        return product