from django.shortcuts import render
import shortuuid

from userauths.models import User, Profile

from userauths.serializer import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

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

#
def generate_otp():
        uuid_key = shortuuid.uuid()
        unique_key = uuid_key[:6]
        return unique_key

#email verify for reseting password 
# RetrieveAPIView is used to fetch data(get method)
class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class =  UserSerializer

    #when a user enters email in the frontend and click on passwrodresetemail we will send email from front to back and check if the email already exist
    def get_object(self):
        email = self.kwargs['email'] #email from url eg: path('user/password-reset/<email>/'
        user = User.objects.get(email=email) # email in db if there is no user with given email axios will response as error.
        print("ZZZZZZZZZZZZZZZZZZZZZZZZZAAAAAAAAAA",user)
        if user:
           user.otp = generate_otp()
           user.save()  

           uidb64 = user.pk
           otp = user.otp

           #this is the link we sent to users email adress. 
           link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"
           print("LINKKKKKKKKKKKKK", link)  
        return user

class PasswordChangeView(generics.CreateAPIView):
     permission_classes = [AllowAny, ]
     serializer_class = UserSerializer
    # over ride default create method
    #destructerd all data front-end sent's to server
     def create(self, request, *args, **kwargs):
          payload = request.data
          
          otp = payload['otp']#user enterd otp 
          uidb64 = payload['uidb64'] #id
          password = payload['password']

          user = User.objects.get(id=uidb64, otp=otp)#it only returns when matching both criteria
          if user:
               user.set_password(password)
               user.otp = ""
               user.reset_token = ""
               user.save()

               return Response({"message":"password changed successfully"}, status=status.HTTP_201_CREATED)
          else:
                 return Response({"message":"user does not exist"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
               


