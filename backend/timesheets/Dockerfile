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
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]