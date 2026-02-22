import json
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Imports products from products_data.json'

    def handle(self, *args, **kwargs):
        try:
            with open('products_data.json', 'r') as file:
                items = json.load(file)
                for item in items:
                    Product.objects.update_or_create(
                        id=item['pk'],
                        defaults=item['fields']
                    )
            self.stdout.write(self.style.SUCCESS('Successfully synced products!'))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('Data file not found.'))