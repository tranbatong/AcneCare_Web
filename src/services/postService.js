import { API_BASE_URL } from '../config/api'

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

function mapNetworkError() {
  return new Error(
    'Không kết nối được máy chủ. Hãy chạy API (cổng 9090), kiểm tra proxy Vite hoặc VITE_API_BASE_URL.',
  )
}

function throwApiError(res, data) {
  const message =
    typeof data.message === 'string' ? data.message : 'Yêu cầu thất bại'
  const err = new Error(message)
  err.code = data.code
  err.status = res.status
  throw err
}

/**
 * @template T
 * @param {unknown} data
 * @returns {T|undefined}
 */
function unwrapResult(data) {
  if (data && typeof data === 'object' && 'result' in data) {
    return /** @type {{ result: T }} */ (data).result
  }
  return undefined
}

/**
 * Danh sách tất cả bài viết.
 * @see PostsController#getAllPosts
 */
export async function getAllPosts() {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/posts`, {
      credentials: 'include',
    })
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data) ?? []
}

/**
 * Bài viết theo id.
 * @see PostsController#getPostById
 */
export async function getPostById(postId) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(postId)}`, {
      credentials: 'include',
    })
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data)
}

/**
 * Bài viết của một user.
 * @see PostsController#getPostsByUserId
 */
export async function getPostsByUserId(userId) {
  let res
  try {
    res = await fetch(
      `${API_BASE_URL}/posts/users/${encodeURIComponent(userId)}`,
      { credentials: 'include' },
    )
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data) ?? []
}

/**
 * Tạo bài — `userId` là path param theo backend.
 * Body: {@link PostsRequest} — postTitle, postContent, status (ACTIVE|BLOCK).
 * @see PostsController#createPost
 */
export async function createPost(userId, payload) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}/posts/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data)
}

/**
 * Cập nhật bài.
 * @see PostsController#updatePost
 */
export async function updatePost(userId, postId, payload) {
  let res
  try {
    res = await fetch(
      `${API_BASE_URL}/posts/update/${encodeURIComponent(userId)}/${encodeURIComponent(postId)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      },
    )
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data)
}

/**
 * Xóa bài.
 * @see PostsController#deletePost
 */
export async function deletePost(userId, postId) {
  let res
  try {
    res = await fetch(
      `${API_BASE_URL}/posts/delete/${encodeURIComponent(userId)}/${encodeURIComponent(postId)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )
  } catch {
    throw mapNetworkError()
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) throwApiError(res, data)
  return unwrapResult(data)
}
