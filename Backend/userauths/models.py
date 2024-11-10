from django.db import models
from django.contrib.auth.models import AbstractUser
from shortuuid.django_fields import ShortUUIDField
# Create your models here.

class User(AbstractUser): #AbstractUser is a base class for creating custom user models
    username = models.CharField(max_length=100, unique=True) #user name when creating acnt.
    email = models.EmailField(max_length=254, unique=True) # user email when creating acnt.
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=100, null=True, blank=True)

    USERNAME_FIELD = 'email' #  email is used for authentication
    REQUIRED_FIELDS = ['username']  # it ensures Username is  also required when creating a user

    def __str__(self):
        return self.email

    #Custom behavior before saving 
    def save(self, *args, **kwargs):
        email_username , mobile = self.email.split("@")
        if self.full_name == "" or self.full_name == None:
            self.full_name = email_username
        if self.username == "" or self.username == None:
            self.username = email_username
         #The parent class of Profile is models.Model. By using super(Profile, self).save(*args, **kwargs), you're calling the save method of models.Model
        super(User, self).save(*args, **kwargs)

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # each Profile is associated with exactly one User but a User can have mutltiple profile instance.
    image = models.FileField(upload_to="image", default="default/default-user.jpg", null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(max_length=200, null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True) 
    country = models.CharField(max_length=100, null=True, blank=True) 
    state = models.CharField(max_length=100, null=True, blank=True) 
    city= models.CharField(max_length=100, null=True, blank=True) 
    address = models.CharField(max_length=100, null=True, blank=True) 
    date = models.DateTimeField(auto_now_add=True)
    profile_id = ShortUUIDField(unique=True,length=10,max_length=20,alphabet="abcdefghijklmnopqrstuvwuxyz")

    def __str__(self):
        if self.full_name:
            return str(self.full_name)
        else:
            return str(self.user.full_name)

    #Custom behavior before saving 
    def save(self, *args, **kwargs):
        if self.full_name == "" or self.full_name == None:
            self.full_name = self.user.full_name
        #The parent class of Profile is models.Model. By using super(Profile, self).save(*args, **kwargs), you're calling the save method of models.Model
        super(Profile, self).save(*args, **kwargs)

    

        


