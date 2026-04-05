import { API_BASE_URL } from '../config/api'

async function parseJsonSafe(res) {
  try {
    const text = await res.text()
    return text ? JSON.parse(text) : {}
  } catch {
    return {}
  }
}

async function fetchAdmin(url, options = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  })

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const message = data.message || 'Thao tác thất bại'
    const err = new Error(message)
    err.code = data.code
    err.status = res.status
    throw err
  }

  return data
}

/** Quản lý người dùng */
export const getAllUsers = () => fetchAdmin('/admin/users')
export const getUserById = (id) => fetchAdmin(`/admin/users/${id}`)
export const updateUserStatus = (id, status) =>
  fetchAdmin(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })

/** Quản lý bài viết */
export const getAllPosts = () => fetchAdmin('/admin/posts')
export const getPostById = (id) => fetchAdmin(`/admin/posts/${id}`)
export const updatePost = (id, payload) =>
  fetchAdmin(`/admin/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
export const deletePost = (id) =>
  fetchAdmin(`/admin/posts/${id}`, {
    method: 'DELETE',
  })
