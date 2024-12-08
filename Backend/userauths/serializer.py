from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from userauths.models import Profile, User

#N0TE: MyTokenObtainPairSerializer is specifically for validating login credentials and generating JWT tokens.
#N0TE: password validation or authentication is handled by TokenObtainPairSerializer, it is a part of its default behavior when using rest_framework_simplejwt
# then why customizing default get_token method? to access important user details from the token without needing extra API requests
class   MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user): #cls refers to the class that is calling the method.in our case TokenObtainPairSerializer. and for user it is  generating token the token so pass it as a parameter.
        token = super().get_token(user)# get token is method calling from parent class for generating token for user.  
        #token is generated...
        token['full_name'] = user.full_name #This adds a new key 'full_name' to the token dictionary generated and value will be user.username
        token['email'] = user.email
        token['username'] = user.username
        try:
            token['vendor_id'] =  user.vendor.id #ventor in not available now but in future.
        except:
            token['vendor_id'] = 0

        return token
    

#By inheriting serializers.ModelSerializer, you leverage DRF’s built-in automatic validation mechanisms.
# to start validation we need trigger the serializers.ModelSerializer  by using is_valid() eg: serializer = RegisterSerializer(data=data) and then serializer.is_valid()
#N0TE: RegisterSerializer validates the input data for new user registration, ensuring data integrity and correct formatting.
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    #To utilize these mechanisms, we need to specify the associated model and the fields to be included in the Meta class.
    #validation will be only done for specified fields.
    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone_number', 'password', 'password2']
    # After this validation, DRF collects the validated data into a dictionary called attrs.
    # this attrs can be used if need in further methods. it exist only  during the execution of the validate method or any further method.

    #custome validation
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password":"password does not match"})
        return attrs
    
    #after both built'in validation and custom validation, validated_data is a dictionary that contains the final validated data for all the fields in the serializer.
    #we can use anywhere for updating or creating or whatever.
    def create(self, validated_data):
        user = User.objects.create(
            full_name = validated_data['full_name'],
            email = validated_data['email'],
            phone_number = validated_data['phone_number'],
        )

        email_username, mobile = user.email.split("@")# name getting after spliting
        user.username = email_username
        user.set_password(validated_data['password'])
        user.save()
        return user

#This serializer is specifically designed to convert User model instances into their JSON representation.
#using Django REST framework’s ModelSerializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    #user = UserSerializer()
    class Meta:
        model = Profile
        fields = "__all__"

    def to_representation(self, instance): # instance = Profile 
        response = super().to_representation(instance) # Here, 'response' is a dictionary representation of the Profile instance. super().to_representation(instance) converts the instance to a dict.
        response['user'] = UserSerializer(instance.user).data # We are adding one more field 'user' to the dictionary(responce) and the 'user' data will be serialized using UserSerializer
        return response
        
        #expected output after serializer and to_represent.
        # { 
        # "id": 1, #profile response
        # "full_name": "John Doe", 
        # "user": # added field user to response
        #      { "username": "johndoe" } user data from Userserializer.
        #  }

