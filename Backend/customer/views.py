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
