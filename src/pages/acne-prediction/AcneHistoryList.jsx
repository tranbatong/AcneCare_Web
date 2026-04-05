import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import './AcneHistoryList.css'
import { API_BASE_URL } from '../../config/api'

const severityColor = {
  'Da khỏe':   { bg: '#dcfce7', color: '#15803d' },
  Nhẹ:         { bg: '#fef9c3', color: '#854d0e' },
  'Trung bình':{ bg: '#fed7aa', color: '#9a3412' },
  Nặng:        { bg: '#fecaca', color: '#b91c1c' },
}

const PAGE_SIZE = 10

export default function AcneHistoryList() {
  const [allRows, setAllRows]       = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState(null)
  const [page, setPage]             = useState(0)       // 0-based
  const [totalPages, setTotalPages] = useState(1)

  const fetchHistory = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // 1. Lấy ID từ localStorage (đã lưu ở bước Đăng nhập)
      const patientId = localStorage.getItem('userId')
      
      if (!patientId) {
        throw new Error('Không tìm thấy thông tin đăng nhập. Vui lòng đăng xuất và đăng nhập lại.')
      }

      // 2. Gọi API lịch sử
      const historyRes = await fetch(
        `${API_BASE_URL}/acne-predictions/history/${patientId}`,
        { credentials: 'include' } // Đính kèm HttpOnly Cookie để Backend xác thực
      )
      
      if (!historyRes.ok) throw new Error(`Lỗi tải dữ liệu: HTTP ${historyRes.status}`)
      
      const historyData = await historyRes.json()
      const payload = historyData?.result ?? historyData
      const content = Array.isArray(payload) ? payload : []
      
      setAllRows(content)
      setTotalPages(Math.ceil(content.length / PAGE_SIZE) || 1)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Không thể tải lịch sử. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  // Cắt mảng để phân trang ở Client
  const currentRows = allRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} - ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }

  return (
    <MainLayout>
      <main style={{ padding: '0 clamp(1rem,4vw,5rem) clamp(2rem,5vw,4rem)', maxWidth: '120rem', margin: '0 auto' }}>
        <h1 className="acne-main__heading" style={{ paddingTop: '2rem' }}>Lịch sử phân tích</h1>

        <div className="history-card">
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
              Đang tải dữ liệu…
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#dc2626', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="history-table-scroll">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Ngày quét</th>
                      <th scope="col">Đánh giá</th>
                      <th scope="col">Phát hiện</th>
                      <th scope="col">Ghi chú</th>
                      <th scope="col">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                          Chưa có lịch sử phân tích nào.
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((row, idx) => {
                        const badge = severityColor[row.severityLevel] ?? { bg: '#f3f4f6', color: '#374151' }
                        return (
                          <tr key={row.id ?? idx}>
                            <td data-label="#">{page * PAGE_SIZE + idx + 1}</td>
                            <td data-label="Ngày quét">{formatDate(row.createdAt ?? row.scannedAt)}</td>
                            <td data-label="Đánh giá">
                              <span style={{
                                display: 'inline-block',
                                background: badge.bg, color: badge.color,
                                padding: '2px 10px', borderRadius: 20,
                                fontWeight: 700, fontSize: 13,
                              }}>
                                {row.severityLevel ?? '—'}
                              </span>
                            </td>
                            <td data-label="Phát hiện">
                              <span className="history-findings">
                                {Array.isArray(row.details) && row.details.length > 0
                                  ? row.details.map((d, j) => (
                                    <span key={j} className="history-findings__item" style={{ marginRight: '8px' }}>
                                      {d.className}: {d.count}
                                    </span>
                                  ))
                                  : <span style={{ color: '#aaa' }}>—</span>
                                }
                              </span>
                            </td>
                            <td data-label="Ghi chú" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {row.note || '—'}
                            </td>
                            <td className="history-table__actions" data-label="Hành động">
                              <div className="history-actions">
                                <Link
                                  to={`/lich-su/${row.id}`}
                                  className="history-action-btn history-action-btn--link"
                                >
                                  Chi tiết
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="history-pagination" aria-label="Phân trang">
                  <button
                    type="button"
                    className="history-pagination__arrow"
                    aria-label="Trang trước"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`history-pagination__page${i === page ? ' is-active' : ''}`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="history-pagination__arrow"
                    aria-label="Trang sau"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
    </MainLayout>
  )
}