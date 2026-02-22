#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Install dependencies
pip install -r requirements.txt

# 2. Run Migrations
python manage.py migrate

# 3. Collect Static Files
python manage.py collectstatic --no-input

# 4. Create Superuser (skipped if already exists)
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'yourpassword')
    print('Superuser created.')
else:
    print('Superuser already exists, skipping.')
"

# 5. Load products only if table is empty (safe to run on every redeploy)
python manage.py shell -c "
from products.models import Product
if Product.objects.count() == 0:
    import subprocess
    result = subprocess.run(['python', 'manage.py', 'loaddata', 'products_data_clean.json'], capture_output=True, text=True)
    print(result.stdout or 'Loaded.')
    if result.stderr:
        print('STDERR:', result.stderr)
else:
    count = Product.objects.count()
    print(f'{count} products already in DB, skipping loaddata.')
"