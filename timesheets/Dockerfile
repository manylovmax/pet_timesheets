FROM python:3.12-slim

# Install pipenv
RUN pip install pipenv

# Set working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock
COPY Pipfile Pipfile.lock ./

# Install dependencies
RUN pipenv install --system --deploy

# Copy application code
COPY timesheets_service /app/timesheets_service
WORKDIR /app/timesheets_service

# Run the application
RUN alembic upgrade head
WORKDIR /app
CMD ["uvicorn",  "timesheets_service.main:app", "--host", "0.0.0.0",  "--port", "80"]