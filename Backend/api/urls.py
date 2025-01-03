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
    # for add to cart 
    path('cart-view/', store_views.CartApiView.as_view(), name='cart-view'),
    # for cart list with user_id 
    path('cart-list/<str:cart_id>/<int:user_id>/', store_views.CartListView.as_view(), name='cart-list'),
    # for cart list without user_id
    path('cart-list/<str:cart_id>/', store_views.CartListView.as_view(), name='cart-list-2'),
    # cart summary
    path('cart-detail/<str:cart_id>/<int:user_id>/', store_views.CartDetailView.as_view(), name='cart-Detail'),
    # cart summary without user_id
    path('cart-detail/<str:cart_id>/', store_views.CartDetailView.as_view(), name='cart-Detail-2'),
    # for deleting item in cart
    path('cart-item-delete/<str:cart_id>/<str:item_id>/<str:user_id>/', store_views.CartItemDeleteApiView.as_view(),),
    # for deleting item in cart without user_id
    path('cart-item-delete/<str:cart_id>/<str:item_id>/', store_views.CartItemDeleteApiView.as_view(),),
    # for create order
    path('create-order/', store_views.CreateOrderApiView.as_view(),name="create-order"),
    #
    path('checkout/<str:order_id>/', store_views.CheckOutView.as_view(),name="checkout"),
    #
    path('coupon/', store_views.CouponApiView.as_view(),name="coupon"),
    #stripe
    path('stripe-checkout/<order_id>/',store_views.StripeCheckoutView.as_view(), name="stripe"),
    # payment
    path('payment-success/<order_id>/',store_views.PaymentSuccessView.as_view(), name="payment-success")


    







]


