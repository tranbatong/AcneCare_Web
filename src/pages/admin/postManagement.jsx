import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import './postManagement.css'

export default function PostManagement() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllPosts()
      // Filter for PENDING posts as requested
      const pendingPosts = data.filter(p => p.status === 'PENDING')
      setPosts(pendingPosts)
      setError(null)
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleApprove = async (postId) => {
    try {
      setActionLoading(true)
      // Assuming updatePost with status 'APPROVED' handles approval
      await adminService.updatePost(postId, { status: 'APPROVED' })
      await fetchPosts()
      alert('Đã duyệt bài viết thành công')
    } catch (err) {
      alert(err.message || 'Duyệt bài viết thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối và xóa bài viết này?')) return

    try {
      setActionLoading(true)
      await adminService.deletePost(postId)
      await fetchPosts()
      alert('Đã xóa bài viết thành công')
    } catch (err) {
      alert(err.message || 'Xóa bài viết thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading && posts.length === 0) return <div className="admin-loading">Đang tải dữ liệu...</div>

  return (
    <>
      <h1 className="admin-page-title">Quản lý Bài đăng (Chờ duyệt)</h1>
      
      {error && <div className="admin-error-msg">{error}</div>}
      
      {!loading && posts.length === 0 && (
        <div className="admin-empty-msg">Hiện không có bài viết nào chờ duyệt.</div>
      )}

      <div className="pm-list">
        {posts.map((post) => (
          <article key={post.id} className="pm-card">
            <header className="pm-card__head">
              <div className="pm-card__author">
                <span className="pm-card__avatar" aria-hidden="true">
                  {post.authorId?.substring(0, 1).toUpperCase()}
                </span>
                <div>
                  <div className="pm-card__name">ID Tác giả: {post.authorId?.substring(0, 8)}...</div>
                  <div className="pm-card__time">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="pm-card__status-tag">
                {post.status}
              </div>
            </header>
            <h2 className="pm-card__title">{post.postTitle}</h2>
            <p className="pm-card__body">{post.postContent}</p>
            <div className="pm-card__footer">
              <div className="pm-card__id">ID: {post.id}</div>
              <div className="pm-card__actions">
                <button 
                  type="button" 
                  className="pm-btn pm-btn--approve"
                  onClick={() => handleApprove(post.id)}
                  disabled={actionLoading}
                >
                  Duyệt
                </button>
                <button 
                  type="button" 
                  className="pm-btn pm-btn--delete"
                  onClick={() => handleDelete(post.id)}
                  disabled={actionLoading}
                >
                  Từ chối/Xóa
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
