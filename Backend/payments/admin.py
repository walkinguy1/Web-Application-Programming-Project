from django.contrib import admin
from .models import Payment, PaymentItem


class PaymentItemInline(admin.TabularInline):
    model = PaymentItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'product_price', 'quantity')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'transaction_id', 'total_amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('transaction_id', 'user__username')
    list_editable = ('status',)   # lets you verify/reject payments directly from the list view
    inlines = [PaymentItemInline]