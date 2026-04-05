import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import { saveRegisterCredentials } from './registerSession'
import '../login/loginPage.css'
import './registerExtras.css'

export default function RegisterStep1() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleNext(e) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu nên có ít nhất 6 ký tự.')
      return
    }
    const payload = { email: email.trim(), password }
    saveRegisterCredentials(payload.email, payload.password)
    navigate('/register/profile', { state: payload })
  }

  return (
    <AuthLayout>
      <div
        className="login-page login-page--register-step1"
        data-name="Register - step 1"
        data-node-id="41:103"
      >
        <h1 className="login-page__title">Đăng ký</h1>
        <div className="login-page__card">
          <form className="login-page__form" onSubmit={handleNext} noValidate>
            {error ? (
              <p className="login-page__error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="login-page__field login-page__field--email">
              <label className="login-page__label" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                className="login-page__input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
            </div>
            <div className="login-page__field login-page__field--password">
              <label className="login-page__label" htmlFor="reg-password">
                Mật khẩu
              </label>
              <input
                id="reg-password"
                className="login-page__input"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required
              />
            </div>
            <div className="login-page__field login-page__field--password">
              <label className="login-page__label" htmlFor="reg-confirm">
                Xác nhận mật khẩu
              </label>
              <input
                id="reg-confirm"
                className="login-page__input"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                required
              />
            </div>
            <button className="login-page__submit" type="submit">
              Tiếp theo
            </button>
            <div className="login-page__links">
              <span aria-hidden="true" />
              <Link className="login-page__links-note" to="/login">
                Đã có tài khoản?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}
