from django.db import migrations, models


class Migration(migrations.Migration):

    # This depends on the latest existing migration in products
    dependencies = [
        ('products', '0003_alter_product_category'),
    ]

    operations = [
        # Change Product.image from ImageField to URLField
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.URLField(blank=True, default='', max_length=2048),
        ),
        # Change ProductImage.image from ImageField to URLField
        migrations.AlterField(
            model_name='productimage',
            name='image',
            field=models.URLField(max_length=2048),
        ),
    ]