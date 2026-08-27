FROM python:3.12-alpine
# Set working directory
WORKDIR /app
# Copy crontab file into the container
COPY cron/crontab.cron /etc/crontab
COPY cron /app/cron
RUN chmod +x /app/cron/delete_old_tokens.sh

# Install dependencies (curl for downloading Supercronic)
RUN apk add --no-cache curl
# Latest releases available at https://github.com/aptible/supercronic/releases
ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.2.49/supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=e63c11a9726b775a6a11801e81af4f3fb926aa68 \
    SUPERCRONIC=supercronic-linux-amd64

RUN curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic
# Install pipenv
RUN pip install pipenv
# Copy Pipfile and Pipfile.lock
COPY Pipfile Pipfile.lock ./
# Install dependencies
RUN pipenv install --system --deploy
# Copy application code
COPY auth_service /app/auth_service
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]