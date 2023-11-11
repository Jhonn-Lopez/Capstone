# userAPI/urls.py

from django.urls import path
from .views import CreateUserView, LoginView, get_user_info

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', get_user_info, name='get_user_info'),
]
