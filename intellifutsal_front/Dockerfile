# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# build-time args
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
# ensure the build uses the VITE_API_URL
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
# Remove default site
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config (we'll mount a conf file from compose)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]