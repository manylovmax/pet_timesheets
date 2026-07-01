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
COPY auth_service /app/auth_service

WORKDIR /app/auth_service

RUN alembic upgrade head
# Run the application
WORKDIR /app
CMD ["uvicorn",  "auth_service.main:app", "--host", "0.0.0.0",  "--port", "80"]