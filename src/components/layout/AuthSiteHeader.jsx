import { Link } from 'react-router-dom'
import './authSiteHeader.css'

const LOGO = '/landing/logo.png'

export default function AuthSiteHeader() {
  return (
    <header className="auth-site-header">
      <div className="auth-site-header__inner">
        <Link className="auth-site-header__brand" to="/">
          <img
            className="auth-site-header__logo"
            src={LOGO}
            alt=""
            width={54}
            height={54}
          />
          <p className="auth-site-header__wordmark">acneCare</p>
        </Link>
        <nav className="auth-site-header__nav" aria-label="Chính">
          <Link className="auth-site-header__link" to="/">
            Trang chủ
          </Link>
          <Link className="auth-site-header__link" to="/login">
            Đăng nhập
          </Link>
          <Link className="auth-site-header__cta" to="/register">
            Đăng ký
          </Link>
        </nav>
      </div>
    </header>
  )
}
