from rest_framework import serializers
from .models import Wishlist
from products.serializers import ProductSerializer


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        queryset=Wishlist.objects.none(),
        many=True,
        write_only=True,
        source='products'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'product_ids', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from products.models import Product
        self.fields['product_ids'].queryset = Product.objects.all()
