import { API_BASE_URL } from '../config/api'

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

/**
 * Đăng ký tài khoản + tạo profile (UserService.createUser).
 * @see UserController#createUser — trả về UserResponse trực tiếp, lỗi bọc ApiResponse.
 */
export async function createUser(payload) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'Không kết nối được máy chủ. Hãy chạy API (cổng 9090) hoặc kiểm tra proxy Vite.',
    )
  }

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Đăng ký thất bại'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}

/** Hồ sơ của user đang đăng nhập (cookie JWT). */
export async function getProfileMe() {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/profiles/me`, {
      credentials: 'include',
    })
  } catch {
    throw new Error('Không kết nối được máy chủ.')
  }

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Không tải được hồ sơ'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}

/**
 * Cập nhật hồ sơ — `id` là khóa profile (UserProfileResponse.id), không phải userId.
 * @see UserProfileController#updateUserProfile
 */
export async function updateProfile(profileId, payload) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/profiles/${encodeURIComponent(profileId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Không kết nối được máy chủ.')
  }

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message =
      typeof data.message === 'string' ? data.message : 'Cập nhật thất bại'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}
