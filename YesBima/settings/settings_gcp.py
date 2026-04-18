"""
These settings will be override if the env is prod
"""

from pathlib import Path
import os
from .settings_base import *


ALLOWED_HOSTS = ["*"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yesbima-dev-db',
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': '35.244.35.36', #'/cloudsql/project-4f9b9827-0749-46e9-8b6:asia-south1:yesbima-dev',
        'PORT': '5432',
    }
}