from django.contrib import admin
from django.utils.html import format_html
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 2
    fields = ('image', 'preview')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:contain;" />',
                obj.image
            )
        return '—'
    preview.short_description = 'Preview'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'rating_rate', 'image_preview')
    list_filter = ('category',)
    search_fields = ('title', 'description')
    inlines = [ProductImageInline]

    # Group fields logically in the detail form
    fieldsets = (
        ('Product Info', {
            'fields': ('title', 'description', 'category', 'price')
        }),
        ('Main Image (paste a URL)', {
            'fields': ('image', 'image_preview'),
            'description': 'Paste any public image URL, e.g. https://example.com/image.jpg'
        }),
        ('Rating', {
            'fields': ('rating_rate',),
        }),
    )
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:120px; border-radius:8px; object-fit:contain;" />',
                obj.image
            )
        return 'No image set'
    image_preview.short_description = 'Preview'