import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import './AcneHistoryDetail.css'
import { API_BASE_URL } from '../../config/api'

/* ── helpers ──────────────────────────────────────────────────────── */
const classToVN = {
  'dark spot':  'Vết thâm',
  blackheads:   'Mụn đầu đen',
  whiteheads:   'Mụn đầu trắng',
  nodules:      'Mụn bọc',
  papules:      'Mụn sẩn',
  pustules:     'Mụn mủ',
}
const toVN = (cls) => classToVN[cls?.toLowerCase().trim()] || cls

const getBoxColor = (cls) => {
  const c = cls?.toLowerCase().trim()
  if (c === 'nodules' || c === 'papules' || c === 'pustules') return '#ef4444'
  if (c === 'dark spot') return '#3b82f6'
  return '#22c55e'
}

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} - ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const severityColor = {
  'Da khỏe':   { bg: '#dcfce7', color: '#15803d' },
  Nhẹ:         { bg: '#fef9c3', color: '#854d0e' },
  'Trung bình':{ bg: '#fed7aa', color: '#9a3412' },
  Nặng:        { bg: '#fecaca', color: '#b91c1c' },
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function AcneHistoryDetail() {
  const { id } = useParams()
  const [data, setData]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [rendSize, setRendSize]   = useState(null)

  const imgRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true); setError(null)
      try {
        // 1. Lấy ID từ localStorage (đã lưu ở bước Đăng nhập)
        const patientId = localStorage.getItem('userId')

        if (!patientId) {
          throw new Error('Không tìm thấy thông tin đăng nhập. Vui lòng đăng xuất và đăng nhập lại.')
        }

        // 2. Gọi API lấy danh sách lịch sử của user
        const historyRes = await fetch(
          `${API_BASE_URL}/acne-predictions/history/${patientId}`, 
          { credentials: 'include' } // Đính kèm HttpOnly Cookie
        )
        if (!historyRes.ok) throw new Error(`Lỗi tải dữ liệu: HTTP ${historyRes.status}`)
        
        const historyJson = await historyRes.json()
        const payload = historyJson?.result ?? historyJson
        const list = Array.isArray(payload) ? payload : []
        
        // 3. Tìm bản ghi cụ thể theo ID trên URL
        const targetData = list.find((item) => item.id === id)

        if (!targetData) {
            throw new Error('Không tìm thấy kết quả phân tích này.')
        }

        setData(targetData)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Không thể tải chi tiết. Vui lòng thử lại.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const captureSize = useCallback(() => {
    if (!imgRef.current) return
    setRendSize({ w: imgRef.current.offsetWidth, h: imgRef.current.offsetHeight })
  }, [])

  useEffect(() => {
    if (!imgRef.current) return
    const ro = new ResizeObserver(captureSize)
    ro.observe(imgRef.current)
    return () => ro.disconnect()
  }, [captureSize, data])

  const imageSrc = data?.imageBase64
    ? (data.imageBase64.startsWith('data:') ? data.imageBase64 : `data:image/jpeg;base64,${data.imageBase64}`)
    : null

  const details = Array.isArray(data?.details) ? data.details : []

  const badge = data?.severityLevel
    ? (severityColor[data.severityLevel] ?? { bg: '#f3f4f6', color: '#374151' })
    : { bg: '#f3f4f6', color: '#374151' }

  return (
    <MainLayout>
      <main style={{ padding: '0 clamp(1rem,4vw,5rem) clamp(2rem,5vw,4rem)', maxWidth: '120rem', margin: '0 auto' }}>
        <Link to="/lich-su" className="detail-back" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>← Quay lại lịch sử</Link>
        <h1 className="acne-main__heading" style={{ paddingTop: '1rem' }}>Chi tiết phân tích</h1>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>Đang tải…</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#dc2626', fontWeight: 600 }}>{error}</div>
        )}

        {!isLoading && !error && data && (
          <div className="detail-card">
            {/* Meta info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem', marginBottom: '1.25rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 13, color: '#888' }}>Ngày quét</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: 15 }}>
                  {formatDate(data.createdAt ?? data.scannedAt)}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 13, color: '#888' }}>Đánh giá</span>
                <p style={{ margin: '2px 0 0' }}>
                  <span style={{
                    display: 'inline-block',
                    background: badge.bg, color: badge.color,
                    padding: '2px 12px', borderRadius: 20,
                    fontWeight: 700, fontSize: 14,
                  }}>
                    {data.severityLevel ?? '—'}
                  </span>
                </p>
              </div>
              {data.note && (
                <div style={{ flex: '1 1 200px' }}>
                  <span style={{ fontSize: 13, color: '#888' }}>Ghi chú</span>
                  <p style={{ margin: '2px 0 0', fontSize: 15 }}>{data.note}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '1.5rem', alignItems: 'start' }}>
              {/* Annotated image */}
              <div>
                <div className="acne-result-visual" style={{ position: 'relative', overflow: 'hidden' }}>
                  {imageSrc
                    ? <img
                        ref={imgRef}
                        src={imageSrc}
                        alt="Kết quả phân tích"
                        className="acne-result-visual__img"
                        onLoad={captureSize}
                        style={{ display: 'block', width: '100%', objectFit: 'contain' }}
                      />
                    : <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>Không có ảnh</div>
                  }
                </div>
              </div>

              {/* Stats */}
              <div>
                {/* Overview */}
                <div className="acne-overview" style={{ marginBottom: '1rem' }}>
                  <p className="acne-overview__title">
                    Tổng quan ({details.reduce((s, d) => s + (d.count || 0), 0)} tổn thương)
                  </p>
                  <ul className="acne-overview__stats">
                    {details.length === 0
                      ? <li>Không có dữ liệu</li>
                      : details.map((d, i) => (
                        <li key={i} style={{
                          background: '#dbeafe', color: '#1d4ed8',
                          padding: '2px 10px', borderRadius: 4,
                          fontWeight: 700, fontSize: 13, listStyle: 'none',
                        }}>
                          {toVN(d.className)}: {d.count}
                        </li>
                      ))
                    }
                  </ul>
                </div>

                {/* Detail list */}
                <ul className="acne-detail-list">
                  {details.length === 0
                    ? <li style={{ fontSize: 14, color: '#888', padding: '4px 0' }}>Chưa có chi tiết</li>
                    : details.map((d, i) => {
                      const color = getBoxColor(d.className)
                      return (
                        <li key={i} className="acne-detail">
                          <div className="acne-detail__row">
                            <span className="acne-detail__label">{i + 1}. {toVN(d.className)}</span>
                            <span className="acne-detail__accuracy">{d.count} tổn thương</span>
                          </div>
                          <div className="acne-progress">
                            <div
                              className="acne-progress__fill"
                              style={{
                                width: `${Math.min(100, (d.count / Math.max(...details.map(x => x.count), 1)) * 100)}%`,
                                background: color,
                              }}
                            />
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>

            {/* Responsive: stack on mobile */}
            <style>{`
              @media (max-width: 640px) {
                .detail-card > div[style*="grid-template-columns"] {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        )}
      </main>
    </MainLayout>
  )
}