import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Đặt IP và port mới làm mặc định
  const backendTarget =
    process.env.VITE_BACKEND_URL ||
    env.VITE_BACKEND_URL ||
    "http://160.187.229.8:9090";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        // Ánh xạ /api -> http://160.187.229.8:9090/api/v1
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        },
      },
    },
  };
});
