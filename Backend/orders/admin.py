from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'product_price', 'quantity')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'transaction_id', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'transaction_id')
    list_editable = ('status',)
    inlines = [OrderItemInline]
