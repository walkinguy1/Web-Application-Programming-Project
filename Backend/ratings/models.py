from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg


class ProductRating(models.Model):
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    score = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.user.username} rated {self.product.title} — {self.score}/5"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        avg = ProductRating.objects.filter(product=self.product).aggregate(
            avg=Avg('score')
        )['avg']
        self.product.rating_rate = round(avg, 1) if avg else 0.0
        self.product.save(update_fields=['rating_rate'])

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        avg = ProductRating.objects.filter(product=product).aggregate(
            avg=Avg('score')
        )['avg']
        product.rating_rate = round(avg, 1) if avg else 0.0
        product.save(update_fields=['rating_rate'])