from django.shortcuts import render

from userauths.models import User, Profile

from userauths.serializer import MyTokenObtainPairSerializer, RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

# TokenObtainPairView has post method this method handles http request and extract email and password and it passes to serialser class for validation. 
# then serializer_class validates the user's POST request for login by checking the provided credentials.
# If the credentials are valid and the user is authenticated, it generates a token for the user.
# N0TE: By default, TokenObtainPairView uses the TokenObtainPairSerializer to validate credentials and generate tokens but..
# When you set serializer_class = MyTokenObtainPairSerializer, you tell TokenObtainPairView to use your custom serializer instead of the default one

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# CreateAPIView is used for creating new instances of a model
# handles HTTP post request
# queryset usecase eg: Checking for Existing Instances
# AllowAny This means any user (authenticated or not) can access this endpoint, which is typical for signup or registration endpoint.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer


