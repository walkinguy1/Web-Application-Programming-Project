from django.urls import path
from .views import product_list, get_products
from . import views

urlpatterns = [
    path('', product_list, name='product-list'),
    path('all/', get_products, name='get_products'),
    path('<int:pk>/', views.get_product_detail, name='product-detail'),
]