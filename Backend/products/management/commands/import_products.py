import json
import os
from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = 'Imports products from products_data.json'

    def handle(self, *args, **kwargs):
        # Skip if products already exist
        if Product.objects.count() > 0:
            self.stdout.write(f'Products already exist ({Product.objects.count()} found), skipping import.')
            return

        # Look for the file relative to manage.py location
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        filepath = os.path.join(base_dir, 'products_data.json')

        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                items = json.load(file)
                count = 0
                for item in items:
                    Product.objects.update_or_create(
                        id=item['pk'],
                        defaults=item['fields']
                    )
                    count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {count} products!'))
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Data file not found at: {filepath}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing products: {e}'))