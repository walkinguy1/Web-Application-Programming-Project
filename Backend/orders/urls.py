from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_order_history, name='order_history'),
    path('create/', views.create_order, name='create_order'),
    path('all/', views.get_all_orders, name='all_orders'),   # admin only
]