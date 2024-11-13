from django.urls import path
from userauths import views as userauths_view 

app_name = 'api'

urlpatterns = [
     path('user/token',userauths_view.MyTokenObtainPairView.as_view(), name='login'),
     path('user/register', userauths_view.RegisterView.as_view(), name='signup')
]


