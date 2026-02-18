from django.urls import path
from .views import RegisterView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    # Register: /api/auth/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Login: /api/auth/login/ (Returns the JWT tokens)
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    
    # Refresh: /api/auth/token/refresh/
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]