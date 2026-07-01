#!/bin/sh
set -e
echo "Running database migrations..."
cd /app/auth_service
alembic upgrade head
# Run the application
cd /app
echo "Starting application..."
exec uvicorn auth_service.main:app --host 0.0.0.0 --port 80