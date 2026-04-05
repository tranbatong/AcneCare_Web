import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout as logoutRequest } from '../../services/authService'
import { getStoredUserId } from '../../store/slice/postUtils'
import SiteFooter from '../../components/layout/SiteFooter'
import './LandingPage.css'

const ASSETS = {
  hero: '/landing/hero-skin-care.png',
  logo: '/landing/logo.png',
  feature: '/landing/feature-wash.png',
  bullet: '/landing/bullet.png',
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getStoredUserId()))

  useEffect(() => {
    function syncAuth() {
      setLoggedIn(Boolean(getStoredUserId()))
    }
    window.addEventListener('storage', syncAuth)
    window.addEventListener('focus', syncAuth)
    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('focus', syncAuth)
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutRequest()
    } catch {
      /* vẫn xóa phiên cục bộ */
    }
    try {
      localStorage.removeItem('userId')
    } catch {
      /* ignore */
    }
    setLoggedIn(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="landing" data-name="LandingPage" data-node-id="22:10">
      <div className="landing__hero-wrap">
        <div className="landing__container">
          <header className="landing__header">
            <div className="landing__brand">
              <img
                className="landing__logo"
                src={ASSETS.logo}
                alt=""
                width={54}
                height={54}
              />
              <p className="landing__wordmark">acneCare</p>
            </div>
            <nav className="landing__nav" aria-label="Chính">
              <Link className="landing__nav-link" to="/">
                Trang chủ
              </Link>
              <Link className="landing__nav-link" to="/posts">
                Bài viết
              </Link>
              <Link className="landing__nav-link" to="/phan-tich">
                Phân tích
              </Link>
              {loggedIn ? (
                <button
                  type="button"
                  className="landing__nav-link landing__nav-logout"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link className="landing__nav-link" to="/login">
                    Đăng nhập
                  </Link>
                  <Link className="landing__nav-cta" to="/register">
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </header>

          <div className="landing__hero-grid">
            <div className="landing__hero-copy">
              <h1 className="landing__hero-title">
                <span className="landing__hero-title-line">Hành trình</span>
                <span className="landing__hero-title-line">cho làn da</span>
                <span className="landing__hero-title-line">khỏe mạnh.</span>
              </h1>
              <div className="landing__hero-lede">
                <p>Chúng tôi lắng nghe và thấu hiểu làn da của bạn.</p>
                <p>AI thông minh giúp nhận diện mụn và kết nối bạn</p>
                <p>với bác sĩ da liễu phù hợp nhất.</p>
              </div>
              <div className="landing__hero-actions">
                <a className="landing__btn-primary" href="#">
                  Bắt đầu ngay
                </a>
                <a className="landing__hero-secondary" href="#">
                  hoặc Tìm hiểu về chúng tôi
                </a>
              </div>
            </div>
            <div className="landing__hero-art" data-name="skinCare 1">
              <div className="landing__hero-art-inner">
                <img
                  className="landing__hero-art-img"
                  src={ASSETS.hero}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="landing__features" aria-labelledby="landing-features-heading">
        <div className="landing__container">
          <h2 id="landing-features-heading" className="landing__features-title">
            acneCare
          </h2>
          <p className="landing__features-sub">
            đồng hành cùng bạn, giúp bạn...
          </p>

          <div className="landing__features-grid">
            <div className="landing__features-photo" data-name="image 24">
              <div className="landing__features-photo-inner">
                <img
                  className="landing__features-photo-img"
                  src={ASSETS.feature}
                  alt=""
                />
              </div>
            </div>

            <div>
              <ul className="landing__features-list">
                <li className="landing__feature">
                  <img
                    className="landing__feature-icon"
                    src={ASSETS.bullet}
                    alt=""
                    width={105}
                    height={105}
                  />
                  <div className="landing__feature-body">
                    <h3>Phân tích tình trạng mụn</h3>
                    <p>
                      AI nhận diện chính xác loại mụn và mức độ tổn thương da
                      của bạn.
                    </p>
                  </div>
                </li>
                <li className="landing__feature">
                  <img
                    className="landing__feature-icon"
                    src={ASSETS.bullet}
                    alt=""
                    width={105}
                    height={105}
                  />
                  <div className="landing__feature-body">
                    <h3>Gợi ý sản phẩm chăm sóc da</h3>
                    <p>
                      Đề xuất sản phẩm và routine phù hợp với tình trạng da
                      hiện tại.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="landing__features-cta-wrap">
                <a className="landing__features-cta" href="#">
                  Và còn rất nhiều điều thú vị
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
