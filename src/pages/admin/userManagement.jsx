import { useState, useEffect } from 'react'
import * as adminService from '../../services/adminService'
import './userManagement.css'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    const confirmMsg = user.status === 'LOCKED' 
      ? `Bạn có chắc chắn muốn mở khóa người dùng ${user.email}?` 
      : `Bạn có chắc chắn muốn khóa người dùng ${user.email}?`
    
    if (!window.confirm(confirmMsg)) return

    try {
      setActionLoading(true)
      await adminService.updateUserStatus(user.id, newStatus)
      await fetchUsers() // Refresh list
      if (selectedUser && selectedUser.id === user.id) {
        const updatedUser = await adminService.getUserById(user.id)
        setSelectedUser(updatedUser)
      }
      alert('Cập nhật trạng thái thành công')
    } catch (err) {
      alert(err.message || 'Cập nhật trạng thái thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  const handleViewDetail = async (userId) => {
    try {
      setActionLoading(true)
      const user = await adminService.getUserById(userId)
      setSelectedUser(user)
    } catch (err) {
      alert(err.message || 'Không thể tải thông tin chi tiết')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading && users.length === 0) return <div className="admin-loading">Đang tải dữ liệu...</div>

  return (
    <>
      <h1 className="admin-page-title">Quản lý người dùng</h1>
      
      {error && <div className="admin-error-msg">{error}</div>}

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th className="um-col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="um-id-cell">{u.id.substring(0, 8)}...</td>
                <td>{u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : 'Chưa cập nhật'}</td>
                <td>
                  <a className="um-email" href={`mailto:${u.email}`}>
                    {u.email}
                  </a>
                </td>
                <td>
                  <span className={`um-status um-status--${u.status.toLowerCase()}`}>
                    {u.status}
                  </span>
                </td>
                <td className="um-col-actions">
                  <div className="um-actions">
                    <button 
                      type="button" 
                      className="um-view" 
                      onClick={() => handleViewDetail(u.id)}
                      disabled={actionLoading}
                    >
                      Xem
                    </button>
                    <button 
                      type="button" 
                      className={`um-lock ${u.status === 'LOCKED' ? 'um-unlock' : ''}`}
                      onClick={() => handleToggleStatus(u)}
                      disabled={actionLoading}
                    >
                      {u.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="um-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <div className="um-modal-header">
              <h2>Chi tiết người dùng</h2>
              <button className="um-modal-close" onClick={() => setSelectedUser(null)}>&times;</button>
            </div>
            <div className="um-modal-body">
              <div className="um-detail-row">
                <strong>ID:</strong> <span>{selectedUser.id}</span>
              </div>
              <div className="um-detail-row">
                <strong>Họ tên:</strong> <span>{selectedUser.firstName} {selectedUser.lastName}</span>
              </div>
              <div className="um-detail-row">
                <strong>Email:</strong> <span>{selectedUser.email}</span>
              </div>
              <div className="um-detail-row">
                <strong>Số điện thoại:</strong> <span>{selectedUser.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="um-detail-row">
                <strong>Ngày tạo:</strong> <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
              </div>
              <div className="um-detail-row">
                <strong>Trạng thái:</strong> 
                <span className={`um-status um-status--${selectedUser.status.toLowerCase()}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="um-detail-row">
                <strong>Vai trò:</strong> <span>{selectedUser.roles?.join(', ')}</span>
              </div>
            </div>
            <div className="um-modal-footer">
              <button 
                className={`pm-btn ${selectedUser.status === 'LOCKED' ? 'pm-btn--approve' : 'pm-btn--delete'}`}
                onClick={() => handleToggleStatus(selectedUser)}
                disabled={actionLoading}
              >
                {selectedUser.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
              </button>
              <button className="pm-btn" onClick={() => setSelectedUser(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
