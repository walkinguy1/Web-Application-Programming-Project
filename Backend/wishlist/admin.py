from django.contrib import admin
from .models import Wishlist


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_count', 'created_at', 'updated_at')
    search_fields = ('user__username',)
    filter_list = ('created_at',)
    
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Number of Products'
