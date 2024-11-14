from django.urls import path
from userauths import views as userauths_view 

from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'api'

urlpatterns = [
     path('user/token',userauths_view.MyTokenObtainPairView.as_view(), name='login'),
     path('user/register', userauths_view.RegisterView.as_view(), name='signup'),
     #for token refreshing
     path('user/token/refresh/',TokenRefreshView.as_view(), name='login'),

]


