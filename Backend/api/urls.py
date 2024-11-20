from django.urls import path
from userauths import views as userauths_view 

from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'api'

urlpatterns = [
    #for login
     path('user/token',userauths_view.MyTokenObtainPairView.as_view(), name='login'),
     #for signup or register
     path('user/register', userauths_view.RegisterView.as_view(), name='register'),
     #for token refreshing
     path('user/token/refresh/',TokenRefreshView.as_view(), name='refresh_token'),
     #for password reset request
     path('user/password-reset/<email>/', userauths_view.PasswordResetEmailVerify.as_view(), name="password-reset"),
     #
     path('user/password-change/', userauths_view.PasswordChangeView.as_view(), name="password-change-view"),   



]


