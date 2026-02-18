from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'quantity')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'item_count', 'created_at')
    list_filter = ('user',)
    inlines = [CartItemInline]

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Items'