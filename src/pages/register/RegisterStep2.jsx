import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { createUser } from '../../services/userService'
import {
  clearRegisterCredentials,
  loadRegisterCredentials,
} from './registerSession'
import '../login/loginPage.css'
import './registerExtras.css'

function mapRegisterError(message) {
  if (message === 'Email already exists') return 'Email đã được sử dụng.'
  return message
}

/** API: gender true = Nam, false = Nữ (boolean Java). *///
export default function RegisterStep2() {
  const navigate = useNavigate()
  const location = useLocation()
  const navState = location.state

  const creds = useMemo(() => {
    if (navState?.email && navState?.password) return navState
    return loadRegisterCredentials()
  }, [navState])

  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!creds?.email || !creds?.password) {
      navigate('/register', { replace: true })
    }
  }, [creds?.email, creds?.password, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const h = parseFloat(String(height).replace(',', '.'))
    const w = parseFloat(String(weight).replace(',', '.'))
    if (Number.isNaN(h) || h <= 0) {
      setError('Vui lòng nhập chiều cao hợp lệ (cm).')
      setLoading(false)
      return
    }
    if (Number.isNaN(w) || w <= 0) {
      setError('Vui lòng nhập cân nặng hợp lệ (kg).')
      setLoading(false)
      return
    }
    try {
      await createUser({
        email: creds.email,
        password: creds.password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        height: h,
        weight: w,
        gender,
      })
      clearRegisterCredentials()
      navigate('/login', {
        replace: true,
        state: { registered: true },
      })
    } catch (err) {
      setError(mapRegisterError(err.message || 'Đăng ký thất bại'))
    } finally {
      setLoading(false)
    }
  }

  if (!creds?.email || !creds?.password) {
    return null
  }

  return (
    <AuthLayout>
      <div
        className="login-page login-page--register-step2"
        data-name="Register - step 2"
        data-node-id="41:183"
      >
        <h1 className="register-step2__title">
          Hoàn thiện thông tin người dùng
        </h1>
        <div className="login-page__card login-page__card--tall">
          <form className="register-step2__form" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="register-step2__field">
              <label className="register-step2__label" htmlFor="reg-lastname">
                Họ Lót
              </label>
              <input
                id="reg-lastname"
                className="register-step2__input register-step2__input--muted-bg"
                value={lastName}
                onChange={(ev) => setLastName(ev.target.value)}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="register-step2__field">
              <label className="register-step2__label" htmlFor="reg-firstname">
                Tên
              </label>
              <input
                id="reg-firstname"
                className="register-step2__input"
                value={firstName}
                onChange={(ev) => setFirstName(ev.target.value)}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="register-step2__row-dual">
              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="reg-height">
                  Chiều cao
                </label>
                <div className="register-step2__measure">
                  <input
                    id="reg-height"
                    className="register-step2__input"
                    inputMode="decimal"
                    value={height}
                    onChange={(ev) => setHeight(ev.target.value)}
                    required
                  />
                  <span className="register-step2__suffix">cm</span>
                </div>
              </div>
              <div className="register-step2__field">
                <label className="register-step2__label" htmlFor="reg-weight">
                  Cân nặng
                </label>
                <div className="register-step2__measure">
                  <input
                    id="reg-weight"
                    className="register-step2__input"
                    inputMode="decimal"
                    value={weight}
                    onChange={(ev) => setWeight(ev.target.value)}
                    required
                  />
                  <span className="register-step2__suffix">kg</span>
                </div>
              </div>
            </div>

            <div className="register-step2__field">
              <span className="register-step2__label" id="reg-gender-label">
                Giới tính
              </span>
              <div
                className="register-step2__gender"
                role="group"
                aria-labelledby="reg-gender-label"
              >
                <button
                  type="button"
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
              <label className="register-step2__label" htmlFor="reg-phone">
                Số điện thoại
              </label>
              <input
                id="reg-phone"
                className="register-step2__input"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                required
              />
            </div>

            <div className="register-step2__field">
              <label className="register-step2__label" htmlFor="reg-address">
                Địa chỉ
              </label>
              <input
                id="reg-address"
                className="register-step2__input"
                autoComplete="street-address"
                value={address}
                onChange={(ev) => setAddress(ev.target.value)}
                required
              />
            </div>

            <button
              className="register-step2__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý…' : 'Đăng ký'}
            </button>

            <Link className="register-step2__back-link" to="/register">
              ← Quay lại bước trước
            </Link>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}
