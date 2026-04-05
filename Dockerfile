# Bước 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Ép cài đặt toàn bộ, kể cả devDependencies (nơi chứa Vite)
RUN npm install --include=dev --no-audit --no-fund --legacy-peer-deps

COPY . .

# Chạy lệnh build của Vite
RUN npm run build

# Bước 2: Phục vụ ứng dụng bằng Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]