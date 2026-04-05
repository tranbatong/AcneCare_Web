# Bước 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Tối ưu hóa lệnh install để tránh lỗi sập bộ nhớ (OOM - Out of Memory)
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

# Chạy lệnh build của Vite
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