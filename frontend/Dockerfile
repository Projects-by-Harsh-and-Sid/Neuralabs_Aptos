FROM node:22-alpine3.18 as build

WORKDIR /app


# Copy only necessary files for npm install
COPY package*.json ./
# COPY config-overrides.js ./



RUN npm install --force

# Copy only necessary source files
COPY public/ ./public
COPY src/ ./src
copy *.js ./

ENV GENERATE_SOURCEMAP=false

RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
# COPY nginx_config/custom-nginx.conf /etc/nginx/nginx.conf
# COPY nginx_config/real-ip.conf /etc/nginx/conf.d/real-ip.conf
# COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf
# COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/nginx.conf /etc/nginx/conf.d/default.conf




# COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
# Create directory for logs if it doesn't exist
RUN mkdir -p /var/log/nginx

# Ensure correct permissions
RUN chown -R nginx:nginx /var/log/nginx

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
