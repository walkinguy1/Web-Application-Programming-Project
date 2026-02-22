#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Install dependencies (This is the missing piece!)
pip install -r requirements.txt

# 2. Run Migrations
python manage.py migrate

# 3. Collect Static Files (Important for WhiteNoise)
python manage.py collectstatic --no-input

# 4. Create Superuser (Your existing logic)
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'yourpassword')
"
python manage.py import_products