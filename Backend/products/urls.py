from django.urls import path
from .views import product_list
from . import views

urlpatterns = [
    path('', views.product_list),
    path('<int:pk>/', views.get_product_detail),
    path('create/', views.create_product),
    path('update/<int:pk>/', views.update_product),
    path('delete/<int:pk>/', views.delete_product),
]