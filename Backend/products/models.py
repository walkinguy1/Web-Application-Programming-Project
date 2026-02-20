from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Jewelry', 'Jewelry'),
        ("Men's Clothing", "Men's Clothing"),
        ("Women's Clothing", "Women's Clothing"),
        ('Liquor', 'Liquor'),
        ('Sale', 'Sale'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        default='Electronics'
    )

    # Now stores a URL string instead of an uploaded file
    image = models.URLField(max_length=2048, blank=True, default='')
    rating_rate = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)

    def __str__(self):
        return self.title


class ProductImage(models.Model):
    """Additional gallery images for a product — also stored as URLs."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.URLField(max_length=2048)

    def __str__(self):
        return f"Image for {self.product.title}"