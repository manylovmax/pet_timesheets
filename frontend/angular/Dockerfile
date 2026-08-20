# Stage 1: Build the Angular application
FROM node:24-alpine AS build
# Set working directory
WORKDIR /app
# copy configuration files for install
COPY package*.json angular.json ./
# Install dependencies
RUN npm ci
# Copy application code
COPY . .
# build application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf
# Copy the built Angular files from the build stage
COPY --from=build /app/dist/angular/browser /usr/share/nginx/html
EXPOSE 80
