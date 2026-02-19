from django.urls import path
from . import views

urlpatterns = [
    path('<int:product_id>/', views.get_product_ratings, name='product_ratings'),
    path('<int:product_id>/mine/', views.get_my_rating, name='my_rating'),
    path('<int:product_id>/submit/', views.submit_rating, name='submit_rating'),
    path('<int:product_id>/delete/', views.delete_rating, name='delete_rating'),
]