import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { login as loginRequest } from '../../services/authService'
import './loginPage.css'

function mapErrorMessage(message) {
  if (message === 'Invalid credentials') {
    return 'Email hoặc mật khẩu không đúng.'
  }
  if (message === 'User is blocked') {
    return 'Tài khoản đã bị khóa.'
  }
  return message
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location.state?.registered) {
      setInfo('Đăng ký thành công. Vui lòng đăng nhập.')
    }
  }, [location.state])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await loginRequest({ email: email.trim(), password })
      const to = location.state?.from || '/'
      navigate(to, { replace: true })
    } catch (err) {
      setError(mapErrorMessage(err.message || 'Đăng nhập thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page" data-name="Login" data-node-id="22:38">
        <h1 className="login-page__title">Đăng nhập</h1>
        <div className="login-page__card">
          <form className="login-page__form" onSubmit={handleSubmit} noValidate>
            {info ? (
              <p className="login-page__info" role="status">
                {info}
              </p>
            ) : null}
            {error ? (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="login-page__field login-page__field--email">
              <label className="login-page__label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="login-page__input"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-page__field login-page__field--password">
              <label className="login-page__label" htmlFor="login-password">
                Mật khẩu
              </label>
              <input
                id="login-password"
                className="login-page__input"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="login-page__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý…' : 'Đăng nhập'}
            </button>
            <div className="login-page__links">
              <a href="#">Quên mật khẩu</a>
              <Link className="login-page__links-note" to="/register">
                Chưa có tài khoản?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}
