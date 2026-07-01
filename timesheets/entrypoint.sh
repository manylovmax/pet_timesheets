#!/bin/sh
set -e
echo "Running database migrations..."
cd /app/timesheets_service
alembic upgrade head
# Run the application
cd /app
echo "Starting application..."
exec uvicorn timesheets_service.main:app --host 0.0.0.0 --port 80