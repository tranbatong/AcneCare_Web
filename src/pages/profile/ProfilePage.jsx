import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { getProfileMe, updateProfile } from '../../services/userService'
import '../login/loginPage.css'
import '../register/registerExtras.css'

function mapErr(message) {
  if (message === 'Unauthenticated') return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
  if (message === 'User profile not found') return 'Chưa có hồ sơ người dùng.'
  return message
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [profileId, setProfileId] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [editMode, setEditMode] = useState(false)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const p = await getProfileMe()
      setProfileId(p.id || '')
      setFirstName(p.firstName ?? '')
      setLastName(p.lastName ?? '')
      setPhone(p.phone ?? '')
      setAddress(p.address ?? '')
      setHeight(p.height != null ? String(p.height) : '')
      setWeight(p.weight != null ? String(p.weight) : '')
      setGender(Boolean(p.gender))
    } catch (err) {
      if (err.status === 401 || err.code === 1014) {
        navigate('/login', { replace: true, state: { from: '/profile' } })
        return
      }
      setError(mapErr(err.message || 'Không tải được hồ sơ'))
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    load()
  }, [load])

  async function handleSave(e) {
    e.preventDefault()
    if (!editMode) return
    if (!profileId) return
    setError('')
    const h = parseFloat(String(height).replace(',', '.'))
    const w = parseFloat(String(weight).replace(',', '.'))
    if (Number.isNaN(h) || h <= 0) {
      setError('Chiều cao không hợp lệ.')
      return
    }
    if (Number.isNaN(w) || w <= 0) {
      setError('Cân nặng không hợp lệ.')
      return
    }
    setSaving(true)
    try {
      await updateProfile(profileId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        height: h,
        weight: w,
        gender,
      })
      setEditMode(false)
      await load()
    } catch (err) {
      if (err.status === 401 || err.code === 1014) {
        navigate('/login', { replace: true, state: { from: '/profile' } })
        return
      }
      setError(mapErr(err.message || 'Lưu thất bại'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page login-page--register-step2">
        <h1 className="register-step2__title">Thông tin người dùng</h1>
        <div className="login-page__card login-page__card--tall">
          {loading ? (
            <p style={{ textAlign: 'center', padding: 24 }}>Đang tải…</p>
          ) : (
            <form className="register-step2__form" onSubmit={handleSave} noValidate>
              {error ? (
                <p className="login-page__error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="profile-page__toolbar">
                {!editMode ? (
                  <button
                    type="button"
                    className="profile-page__btn-secondary"
                    onClick={() => setEditMode(true)}
                  >
                    Chỉnh sửa
                  </button>
                ) : null}
              </div>

              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="pf-lastname">
                  Họ Lót
                </label>
                <input
                  id="pf-lastname"
                  className="register-step2__input register-step2__input--muted-bg"
                  value={lastName}
                  onChange={(ev) => setLastName(ev.target.value)}
                  readOnly={!editMode}
                  required
                />
              </div>

              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="pf-firstname">
                  Tên
                </label>
                <input
                  id="pf-firstname"
                  className="register-step2__input"
                  value={firstName}
                  onChange={(ev) => setFirstName(ev.target.value)}
                  readOnly={!editMode}
                  required
                />
              </div>

              <div className="register-step2__row-dual">
                <div className="register-step2__field">
                  <label className="register-step2__label" htmlFor="pf-height">
                    Chiều cao
                  </label>
                  <div className="register-step2__measure">
                    <input
                      id="pf-height"
                      className="register-step2__input"
                      inputMode="decimal"
                      value={height}
                      onChange={(ev) => setHeight(ev.target.value)}
                      readOnly={!editMode}
                      required
                    />
                    <span className="register-step2__suffix">cm</span>
                  </div>
                </div>
                <div className="register-step2__field">
                  <label className="register-step2__label" htmlFor="pf-weight">
                    Cân nặng
                  </label>
                  <div className="register-step2__measure">
                    <input
                      id="pf-weight"
                      className="register-step2__input"
                      inputMode="decimal"
                      value={weight}
                      onChange={(ev) => setWeight(ev.target.value)}
                      readOnly={!editMode}
                      required
                    />
                    <span className="register-step2__suffix">kg</span>
                  </div>
                </div>
              </div>

              <div className="register-step2__field">
                <span className="register-step2__label" id="pf-gender-label">
                  Giới tính
                </span>
                <div
                  className="register-step2__gender"
                  role="group"
                  aria-labelledby="pf-gender-label"
                >
                  <button
                    type="button"
                    disabled={!editMode}
                    className={
                      'register-step2__gender-btn' +
                      (!gender ? ' register-step2__gender-btn--active' : '')
                    }
                    onClick={() => setGender(false)}
                  >
                    Nữ
                  </button>
                  <button
                    type="button"
                    disabled={!editMode}
                    className={
                      'register-step2__gender-btn' +
                      (gender ? ' register-step2__gender-btn--active' : '')
                    }
                    onClick={() => setGender(true)}
                  >
                    Nam
                  </button>
                </div>
              </div>

              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="pf-phone">
                  Số điện thoại
                </label>
                <input
                  id="pf-phone"
                  className="register-step2__input"
                  type="tel"
                  value={phone}
                  onChange={(ev) => setPhone(ev.target.value)}
                  readOnly={!editMode}
                  required
                />
              </div>

              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="pf-address">
                  Địa chỉ
                </label>
                <input
                  id="pf-address"
                  className="register-step2__input"
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  readOnly={!editMode}
                  required
                />
              </div>

              {editMode ? (
                <div className="profile-page__actions">
                  <button
                    type="button"
                    className="profile-page__btn-secondary"
                    onClick={() => {
                      setEditMode(false)
                      load()
                    }}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="register-step2__submit"
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
                  </button>
                </div>
              ) : null}

              <Link className="profile-page__footer-link" to="/">
                Về trang chủ
              </Link>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}
