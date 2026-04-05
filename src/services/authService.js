import { API_BASE_URL } from '../config/api'

/**
 * Đăng nhập — backend gắn access_token / refresh_token qua HttpOnly cookie.
 * @see AuthenticationController#login
 */
export async function login({ email, password }) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new Error(
      'Không kết nối được máy chủ. Hãy chạy API (cổng 9090), kiểm tra proxy Vite hoặc biến VITE_API_BASE_URL.',
    )
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Đăng nhập thất bại'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

/**
 * Đăng xuất — xóa cookie JWT phía server.
 * @see AuthenticationController#logout
 */
export async function logout() {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    throw new Error(
      'Không kết nối được máy chủ. Hãy chạy API (cổng 9090) hoặc kiểm tra proxy Vite.',
    )
  }

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Đăng xuất thất bại'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}
