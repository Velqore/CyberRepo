# ==============================================================================
# Multi-Stage Production Dockerfile for CyberRepos Hub
# Stage 1: Build & Optimization (Node.js LTS Alpine)
# Stage 2: Hardened, High-Performance Production Web Server (Nginx Alpine)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy dependency manifests first for layer caching
COPY package.json package-lock.json ./

# Install dependencies strictly from lockfile
RUN npm ci

# Accept build-time arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Copy full application source
COPY . .

# Run production build
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Nginx Runtime Stage
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine-slim AS runner

LABEL maintainer="Velqore <https://github.com/Velqore>"
LABEL description="CyberRepos Hub - Curated Cyber & Tech Repository Discovery Engine"

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/cyberrepos.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create healthcheck file
RUN echo "healthy" > /usr/share/nginx/html/healthz.html

# Set correct non-root permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to unprivileged user for security compliance
USER nginx

# Expose HTTP port
EXPOSE 8080

# Configure container healthcheck
HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
