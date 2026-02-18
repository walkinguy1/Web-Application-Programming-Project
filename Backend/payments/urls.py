from django.urls import path
from . import views

urlpatterns = [
    # POST /api/payments/submit/  — called from Checkout page
    path('submit/', views.submit_payment, name='submit_payment'),

    # GET /api/payments/history/  — called from Profile page
    path('history/', views.get_payment_history, name='payment_history'),

    path('all/', views.get_all_payments, name='all_payments'),   # admin only
]