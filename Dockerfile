# Bước 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# Chạy lệnh build của Vite (sẽ tạo ra thư mục /app/dist)
RUN npm run build

# Bước 2: Phục vụ ứng dụng bằng Nginx
FROM nginx:alpine

# Xóa trang default của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy các file tĩnh đã build từ bước 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Ghi đè file cấu hình Nginx (Đổi từ template sang conf.d/default.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]