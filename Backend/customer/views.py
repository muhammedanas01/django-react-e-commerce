from django.shortcuts import render, redirect
from django.conf import settings
import requests
from userauths.models import User
from store.models import Product, Category
from store.serializer import ProductSerializers, CategorySerializers, CartSerializers, CartOrderItemSerializers, CartOrderSerializers, CouponSerializers, ReviewSerializers, WishlistSerializers, NotificationSerializers
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


# Create your views here.

class OrdersApiView(generics.ListAPIView):
    """
    gives all orders of a user
    """
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        orders = CartOrder.objects.filter(buyer=user, payment_status="paid")
        return orders
#3ju1n55d44

class OrderDetailApiView(generics.RetrieveAPIView):
    """
    from orders this shows all details of specific order
    """
    serializer_class = CartOrderSerializers
    permission_classes = [AllowAny,]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        order_id = self.kwargs['order_id']

        orders = CartOrder.objects.get(buyer=user, order_id=order_id,  payment_status="paid")
        return orders

class ProfileApiView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny,]

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        return profile

class WishListApiView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializers
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        Wishlists = Wishlist.objects.filter(user=user)
        return Wishlists
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        
        product_id = payload['product_id']
        user_id = payload['user_id']

        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlist = Wishlist.objects.filter(product=product, user=user)
        # at first click on wishlist button i frontend it adds to wishlist but..
        # ..if user clicks that button again it means to remove item from wishlist
        # so here the logic is if user clicked on button means delete it
        if wishlist:
            wishlist.delete()
            return Response({"message":"wishlist removed successfully"}, status=status.HTTP_200_OK)
        else:
            Wishlist.objects.create(product=product, user=user)
            return Response({"message":"added to wishlist"}, status=status.HTTP_201_CREATED)

class Customer_Notification(generics.ListAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [AllowAny,]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        return Notification.objects.filter(user=user, seen=False)

class Mark_Notification_As_Seen(generics.ListAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [AllowAny,]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        notification_id = self.kwargs['notification_id']

        user = User.objects.get(id=user_id)
        notification = Notification.objects.get(id=notification_id, user=user)

        if notification.seen != True:
            notification.seen = True
            notification.save()

        return [notification]  # Wrap the notification in a list






