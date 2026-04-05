import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../../assets/figma/logo.png'

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <header className="layout-header">
      <Link to="/" className="layout-header__brand">
        <img
          src={logoImg}
          alt=""
          className="layout-header__logo"
          width={48}
          height={48}
        />
        <span className="layout-header__title">acneCare</span>
      </Link>

      {/* Hamburger button – mobile only */}
      <button
        className="layout-header__hamburger"
        aria-label="Mở menu"
        aria-expanded={navOpen}
        onClick={() => setNavOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        className={`layout-header__nav${navOpen ? ' layout-header__nav--open' : ''}`}
        aria-label="Chính"
      >
        <Link
          className={`layout-header__link${isActive('/') ? ' layout-header__link--active' : ''}`}
          to="/"
          onClick={() => setNavOpen(false)}
        >
          Trang chủ
        </Link>
        <Link
          className={`layout-header__link${isActive('/phan-tich') ? ' layout-header__link--active' : ''}`}
          to="/phan-tich"
          onClick={() => setNavOpen(false)}
        >
          Phân tích da
        </Link>
        <Link
          className={`layout-header__link${isActive('/lich-su') ? ' layout-header__link--active' : ''}`}
          to="/lich-su"
          onClick={() => setNavOpen(false)}
        >
          Lịch sử
        </Link>
        <Link
          className="layout-header__link"
          to="/login"
          onClick={() => setNavOpen(false)}
        >
          Đăng nhập
        </Link>
        <Link
          className="layout-header__cta"
          to="/register"
          onClick={() => setNavOpen(false)}
        >
          Đăng ký
        </Link>
      </nav>
    </header>
  )
}
