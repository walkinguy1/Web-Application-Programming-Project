from django.urls import path
from .profile_views import get_profile, update_profile

urlpatterns = [
    path('', get_profile, name='get_profile'),
    path('update/', update_profile, name='update_profile'),
]