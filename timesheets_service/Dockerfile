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
COPY . .

# Run the application
RUN ["alembic", "upgrade",  "head"]
CMD ["python", "uvicorn",  "main:app", "--host 0.0.0.0",  "--port 8081"]