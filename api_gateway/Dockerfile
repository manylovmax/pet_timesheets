# Use a lightweight, official Nginx base image
FROM nginx:alpine

# Copy custom configuration file into the container
# (Optional: Only use if you need a custom nginx.conf or default.conf)
COPY default.conf /etc/nginx/conf.d/default.conf


# Expose port 80 to allow traffic
EXPOSE 80

# Start Nginx in the foreground so the container stays running
CMD ["nginx", "-g", "daemon off;"]