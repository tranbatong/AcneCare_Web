/**
 * Base URL cho Spring Boot API (context-path /api/v1).
 * Dev: mặc định dùng đường dẫn tương đối để đi qua proxy Vite (cùng origin, cookie ổn định).
 * @see acnecare_app_api application.yml server.servlet.context-path
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:9090/api/v1')
