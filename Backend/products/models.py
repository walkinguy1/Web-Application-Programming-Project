from django.db import models

class Product(models.Model):
    # Define the choices to match your React Navbar exactly
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
    
    # Changed from CharField to CharField with choices
    category = models.CharField(
        max_length=100, 
        choices=CATEGORY_CHOICES,
        default='Electronics'
    )
    
    # This remains the 'thumbnail' or main image
    image = models.ImageField(upload_to='product_images/') 
    rating_rate = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)

    def __str__(self):
        return self.title

# NEW MODEL for multiple images
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/gallery/')

    def __str__(self):
        return f"Image for {self.product.title}"