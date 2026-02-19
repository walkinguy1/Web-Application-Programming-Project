from django.contrib import admin
from .models import ProductRating


@admin.register(ProductRating)
class ProductRatingAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'score', 'short_review', 'created_at')
    list_filter = ('score',)
    search_fields = ('product__title', 'user__username', 'review')
    readonly_fields = ('created_at', 'updated_at')

    def short_review(self, obj):
        return obj.review[:60] + '...' if len(obj.review) > 60 else obj.review or '—'
    short_review.short_description = 'Review'