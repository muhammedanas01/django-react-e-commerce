from django.urls import path
from userauths import views as userauths_views 
from store import views as store_views

from rest_framework_simplejwt.views import TokenRefreshView


app_name = 'api'

urlpatterns = [
    #userauth endpoints
    #for login
     path('user/token',userauths_views.MyTokenObtainPairView.as_view(), name='login'),
     #for signup or register
     path('user/register', userauths_views.RegisterView.as_view(), name='register'),
     #for token refreshing
     path('user/token/refresh/',TokenRefreshView.as_view(), name='refresh_token'),
     #for password reset request
     path('user/password-reset/<email>/', userauths_views.PasswordResetEmailVerify.as_view(), name="password-reset"),
     #change user password and save
     path('user/password-change/', userauths_views.PasswordChangeView.as_view(), name="password-change-view"),   

    #store endpoints
    #for category list
    path('category/', store_views.CategoryListApiView.as_view(), name='category'),
    #for product list
    path('products/', store_views.ProductListApiView.as_view(), name='product'),
    #for product details
    path('product-detail/<slug>/', store_views.ProductDetailApiView.as_view(), name='product-detail'),
    # for cart 
    path('cart-view/', store_views.CartApiView.as_view(), name='cart-view'),

]


