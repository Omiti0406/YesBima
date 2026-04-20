# Use lightweight Python image
FROM python:3.12-slim

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
#ENV DJANGO_SETTINGS_MODULE=YesBima.settings.settings_gcp

# Set work directory
WORKDIR /app

RUN ["rm", "-rf", "/app/*"]

# Install system dependencies (needed for psycopg2 etc.)
RUN apt-get update && apt-get install -y gcc libpq-dev

# Copy project files to the container
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files
RUN ["python", "manage.py", "collectstatic", "--noinput" ]

# # Apply database migrations
# RUN ["python", "manage.py", "migrate", "--noinput" ]

# Expose port (Cloud Run uses $PORT)
CMD ["sh", "-c", "python manage.py migrate --noinput || true && exec gunicorn YesBima.wsgi:application \
    --bind 0.0.0.0:${PORT:-8080} \
    --workers 3 \
    --threads 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -"]