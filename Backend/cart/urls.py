from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_to_cart, name='add_to_cart'),
    path('view/', views.get_cart, name='get_cart'),
    path('clear/', views.clear_cart, name='clear_cart'),
    path('item/<int:item_id>/delete/', views.remove_cart_item, name='remove_cart_item'),
]