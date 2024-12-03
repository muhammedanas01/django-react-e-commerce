from django.shortcuts import render

from store.models import Product, Category
from store.serializer import ProductSerializers, CategorySerializers

from rest_framework import generics 
from rest_framework.permissions import AllowAny, IsAuthenticated

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
