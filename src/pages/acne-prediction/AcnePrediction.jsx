import { useState, useRef, useEffect, useCallback } from 'react'
import MainLayout from '../../layouts/MainLayout'
import './AcnePrediction.css'
import { API_BASE_URL } from '../../config/api'

/* ── Roboflow config ──────────────────────────────────────────────── */
const WORKSPACE_ID = 'nhom14acne'
const WORKFLOW_ID  = 'custom-workflow-2'
const API_KEY      = 'huTWEYCuEdWYPAizTiJR'

/* ── Translation helpers ──────────────────────────────────────────── */
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

/* ── Utils ────────────────────────────────────────────────────────── */
const getBase64 = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload  = () => res(reader.result)
    reader.onerror = (e) => rej(e)
  })

const stripPrefix = (b64) => {
  const idx = b64.indexOf(',')
  return idx !== -1 ? b64.slice(idx + 1) : b64
}

const generateAnnotatedImage = (originalB64, predictions, imgMeta) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const MAX = 1200
      let w = img.width
      let h = img.height
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round((h * MAX) / w); w = MAX }
        else        { w = Math.round((w * MAX) / h); h = MAX }
      }

      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)

      const sx = w / imgMeta.width
      const sy = h / imgMeta.height
      const lw = Math.max(2, w / 400)
      const fs = Math.max(12, w / 60)

      predictions.forEach((pred) => {
        const x  = (pred.x - pred.width  / 2) * sx
        const y  = (pred.y - pred.height / 2) * sy
        const pw = pred.width  * sx
        const ph = pred.height * sy
        const color = getBoxColor(pred.class)
        const label = `${pred.class.toLowerCase()} ${Math.round(pred.confidence * 100)}%`

        ctx.strokeStyle = color; ctx.lineWidth = lw
        ctx.strokeRect(x, y, pw, ph)

        ctx.font = `bold ${fs}px Arial`
        const tw = ctx.measureText(label).width
        ctx.fillStyle = color
        ctx.fillRect(x - lw / 2, y - fs - 8, tw + 16, fs + 8)
        ctx.fillStyle = '#fff'
        ctx.fillText(label, x + 8 - lw / 2, y - 6)
      })

      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = originalB64
  })

/* ═══════════════════════════════════════════════════════════════════ */
export default function AcnePrediction() {
  const [base64Image, setBase64Image]     = useState(null)
  const [apiResult,   setApiResult]       = useState(null)
  const [isLoading,   setIsLoading]       = useState(false)
  const [threshold,   setThreshold]       = useState(10)

  const [isModalOpen, setIsModalOpen]     = useState(false)
  const [isSaving,    setIsSaving]        = useState(false)
  const [severity,    setSeverity]        = useState('Da khỏe')
  const [note,        setNote]            = useState('')

  // Actual render size of the result <img>
  const [renderedSize, setRenderedSize]   = useState(null)
  const resultImgRef = useRef(null)
  const fileInputRef = useRef(null)

  /* ── Capture image rendered size (also on resize) ── */
  const captureSize = useCallback(() => {
    if (!resultImgRef.current) return
    const { offsetWidth, offsetHeight } = resultImgRef.current
    setRenderedSize({ w: offsetWidth, h: offsetHeight })
  }, [])

  useEffect(() => {
    if (!resultImgRef.current) return
    const ro = new ResizeObserver(captureSize)
    ro.observe(resultImgRef.current)
    return () => ro.disconnect()
  }, [captureSize, base64Image]) // re-observe when image changes

  /* ── File handling ─────────────────────────────── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      alert('Chỉ hỗ trợ JPG/PNG.')
      return
    }
    try {
      const b64 = await getBase64(file)
      setBase64Image(b64)
      setApiResult(null)
      setRenderedSize(null)
    } catch { alert('Không thể xử lý ảnh.') }
  }

  /* ── Call Roboflow ─────────────────────────────── */
  const handleAnalyze = async () => {
    if (!base64Image) return alert('Vui lòng tải ảnh lên trước.')
    setIsLoading(true)
    setApiResult(null)

    const url = `https://serverless.roboflow.com/${WORKSPACE_ID}/workflows/${WORKFLOW_ID}`
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          api_key: API_KEY,
          inputs:  { image: { type: 'base64', value: stripPrefix(base64Image) } },
        }),
      })
      if (!res.ok) throw new Error('Roboflow API failed')
      setApiResult(await res.json())
    } catch (err) {
      console.error(err)
      alert('Lỗi gọi API AI.')
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Save to backend ───────────────────────────── */
  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const basePreds = rawPredictions.filter(
        (p) => Math.round(p.confidence * 100) >= 10
      )
      const annotated = await generateAnnotatedImage(base64Image, basePreds, imgMeta)
      const details = Object.entries(
        basePreds.reduce((acc, p) => { acc[p.class] = (acc[p.class] || 0) + 1; return acc }, {})
      ).map(([className, count]) => ({ className, count }))

      const res = await fetch(`${API_BASE_URL}/acne-predictions`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ severityLevel: severity, note, imageBase64: annotated, details }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.message || `HTTP ${res.status}`)
      }
      alert('Lưu kết quả phân tích thành công!')
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Lỗi server!')
    } finally {
      setIsSaving(false)
    }
  }

  /* ── Parse API result ──────────────────────────── */
  let rawPredictions = []
  let imgMeta = { width: 1, height: 1 }

  if (apiResult?.outputs?.[0]?.predictions?.predictions) {
    rawPredictions = apiResult.outputs[0].predictions.predictions
    imgMeta        = apiResult.outputs[0].predictions.image
  } else if (Array.isArray(apiResult?.predictions)) {
    rawPredictions = apiResult.predictions
    imgMeta        = apiResult.image || { width: 100, height: 100 }
  }

  const filtered = rawPredictions.filter(
    (p) => Math.round(p.confidence * 100) >= threshold
  )

  const summary = filtered.reduce((acc, p) => {
    acc[p.class] = (acc[p.class] || 0) + 1; return acc
  }, {})

  const sorted = [...filtered].sort((a, b) => b.confidence - a.confidence)

  /* ── BBox overlay ──────────────────────────────── */
  const renderBBoxes = () => {
    if (!apiResult || !renderedSize || filtered.length === 0) return null

    const { w: rW, h: rH } = renderedSize
    const ratio = imgMeta.width / imgMeta.height
    const containerRatio = rW / rH

    // Compute displayed image rect (object-fit: contain → letterboxing)
    let dW, dH, offX, offY
    if (ratio > containerRatio) {
      dW = rW; dH = rW / ratio
      offX = 0; offY = (rH - dH) / 2
    } else {
      dH = rH; dW = rH * ratio
      offX = (rW - dW) / 2; offY = 0
    }

    const sx = dW / imgMeta.width
    const sy = dH / imgMeta.height

    return filtered.map((pred, i) => {
      const left   = offX + (pred.x - pred.width  / 2) * sx
      const top    = offY + (pred.y - pred.height / 2) * sy
      const width  = pred.width  * sx
      const height = pred.height * sy
      const color  = getBoxColor(pred.class)
      const pct    = Math.round(pred.confidence * 100)

      return (
        <div
          key={i}
          style={{
            position: 'absolute', left, top, width, height,
            border: `2px solid ${color}`,
            backgroundColor: 'rgba(255,255,255,0.03)',
            pointerEvents: 'none',
            zIndex: 10,
            boxSizing: 'border-box',
          }}
        >
          <span style={{
            position: 'absolute', top: '-20px', left: '-2px',
            fontSize: '10px', color: '#fff', fontWeight: 700,
            padding: '1px 5px', whiteSpace: 'nowrap',
            background: color,
            borderTopLeftRadius: 3, borderTopRightRadius: 3,
            lineHeight: '18px',
          }}>
            {pred.class.toLowerCase()} {pct}%
          </span>
        </div>
      )
    })
  }

  /* ── Render ────────────────────────────────────── */
  return (
    <MainLayout>
      <div style={{ padding: '0 clamp(1rem,4vw,5rem) clamp(2rem,5vw,4rem)', maxWidth: '120rem', margin: '0 auto' }}>
        <h1 className="acne-main__heading" style={{ paddingTop: '2rem' }}>Phân tích da</h1>

        <div className="acne-columns">
          {/* ── Left panel ── */}
          <section className="acne-card acne-card--config" aria-labelledby="cfg-title">
            <h2 id="cfg-title" className="acne-card__step-title">
              <span className="acne-card__step-num">1.</span> Cấu hình và tải ảnh
            </h2>
            <div className="acne-rule" />

            {/* Slider */}
            <div className="acne-sensitivity">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="acne-sensitivity__label" style={{ margin: 0 }}>Độ nhạy hiển thị</p>
                <p style={{ margin: 0, fontWeight: 800, color: '#8c52ff' }}>{threshold}%</p>
              </div>
              <input
                type="range" min="10" max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.65rem', accentColor: '#8c52ff', cursor: 'pointer' }}
              />
            </div>

            {/* Upload */}
            <p className="acne-upload__caption">Chọn hình ảnh</p>
            <div
              className="acne-upload"
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer', overflow: 'hidden' }}
            >
              <input
                type="file" accept="image/png,image/jpeg"
                ref={fileInputRef} onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {base64Image
                ? <img src={base64Image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <p className="acne-upload__hint">Click tải ảnh</p>
              }
            </div>

            <button
              type="button"
              className="acne-btn acne-btn--primary acne-btn--block"
              onClick={handleAnalyze}
              disabled={!base64Image || isLoading}
              style={{ cursor: !base64Image || isLoading ? 'not-allowed' : 'pointer', opacity: !base64Image || isLoading ? 0.65 : 1 }}
            >
              {isLoading ? 'Đang phân tích…' : 'Bắt đầu phân tích'}
            </button>
          </section>

          {/* ── Right panel ── */}
          <section className="acne-card acne-card--results" aria-labelledby="result-title">
            <h2 id="result-title" className="acne-card__step-title">
              <span className="acne-card__step-num">2.</span> Kết quả
            </h2>

            {/* Image + BBox overlay */}
            <div className="acne-result-visual" style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                ref={resultImgRef}
                src={base64Image || '/face-placeholder.png'}
                alt="Kết quả phân tích"
                className="acne-result-visual__img"
                onLoad={captureSize}
                style={{ display: 'block', width: '100%', objectFit: 'contain', opacity: isLoading ? 0.4 : 1 }}
              />
              {renderBBoxes()}
              {isLoading && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.6)',
                }}>
                  <span style={{ fontSize: '1rem', color: '#555' }}>Đang xử lý…</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="acne-overview">
              <p className="acne-overview__title">
                Tổng quan ({filtered.length} tổn thương)
              </p>
              <ul className="acne-overview__stats">
                {Object.keys(summary).length === 0
                  ? <li>Chưa có dữ liệu</li>
                  : Object.entries(summary).map(([cls, cnt]) => (
                    <li key={cls} style={{
                      background: '#dbeafe', color: '#1d4ed8',
                      padding: '2px 10px', borderRadius: 4,
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {toVN(cls)}: {cnt}
                    </li>
                  ))
                }
              </ul>
            </div>

            {/* Detail list */}
            <ul className="acne-detail-list">
              {sorted.length === 0
                ? <li style={{ fontSize: 14, color: '#888', padding: '8px 0' }}>Chưa có chi tiết</li>
                : sorted.slice(0, 5).map((item, i) => {
                  const pct   = Math.round(item.confidence * 100)
                  const color = pct > 80 ? '#16a34a' : pct > 50 ? '#d97706' : '#dc2626'
                  return (
                    <li key={i} className="acne-detail">
                      <div className="acne-detail__row">
                        <span className="acne-detail__label">{i + 1}. {toVN(item.class)}</span>
                        <span className="acne-detail__accuracy">Chính xác {pct}%</span>
                      </div>
                      <div className="acne-progress">
                        <div className="acne-progress__fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </li>
                  )
                })
              }
            </ul>

            <button
              type="button"
              className="acne-btn acne-btn--primary acne-btn--block acne-btn--save"
              onClick={() => { if (apiResult) { setSeverity('Da khỏe'); setNote(''); setIsModalOpen(true) } else alert('Vui lòng phân tích ảnh trước.') }}
              disabled={!apiResult || isLoading}
              style={{ cursor: !apiResult || isLoading ? 'not-allowed' : 'pointer', opacity: !apiResult || isLoading ? 0.6 : 1 }}
            >
              Lưu kết quả phân tích
            </button>
          </section>
        </div>
      </div>

      {/* ── Save Modal ── */}
      {isModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div style={{
            background: '#fff', padding: 28, borderRadius: 14,
            width: 440, maxWidth: '92%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800 }}>Lưu Hồ Sơ Phân Tích</h2>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: 14 }}>
                  Đánh giá mức độ *
                </label>
                <select
                  required value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '1px solid #ccc', fontSize: 14 }}
                >
                  <option>Da khỏe</option>
                  <option>Nhẹ</option>
                  <option>Trung bình</option>
                  <option>Nặng</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: 14 }}>Ghi chú</label>
                <textarea
                  rows={4} value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: '1px solid #ccc', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ padding: '10px 14px', background: '#eff6ff', color: '#1e40af', borderRadius: 7, fontSize: 13, marginBottom: 20, border: '1px solid #bfdbfe' }}>
                * Hệ thống luôn lưu <b>toàn bộ dữ liệu từ 10% trở lên</b> dù bạn kéo thanh trượt ở mức nào.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ padding: '9px 20px', border: '1px solid #d1d5db', background: '#fff', borderRadius: 7, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSaving}
                  style={{ padding: '9px 20px', border: 'none', background: '#8c52ff', color: '#fff', fontWeight: 700, borderRadius: 7, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1, fontSize: 14 }}>
                  {isSaving ? 'Đang lưu…' : 'Xác Nhận Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
