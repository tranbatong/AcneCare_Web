import {
  Routes,
  Route,
  Navigate,
  Outlet,
  NavLink,
  Link,
} from 'react-router-dom'
import './admin.css'
import UserManagement from './userManagement'
import PostManagement from './postManagement'

const NAV = [
  { to: '/admin', end: true, label: 'Trang chủ' },
  { to: '/admin/users', label: 'Quản lý user' },
  { to: '/admin/posts', label: 'Quản lý bài đăng' },
]

function AdminHeader() {
  return (
    <header className="admin-header">
      <Link className="admin-header__brand" to="/admin">
        <span className="admin-logo" aria-hidden="true">
          A
        </span>
        <span>acneCare</span>
      </Link>
      <nav className="admin-header__nav" aria-label="Admin">
        {NAV.map(({ to, end, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-header__user">
        <span
          className="admin-header__avatar"
          role="img"
          aria-label="Ảnh đại diện quản trị"
        />
        <span className="admin-header__badge">Admin</span>
      </div>
    </header>
  )
}

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <div className="admin-footer__grid">
        <div className="admin-footer__brand">
          <span className="admin-logo" aria-hidden="true">
            A
          </span>
          <span className="admin-footer__brand-name">acneCare</span>
          <p>
            Nền tảng đồng hành cùng bạn trong hành trình chăm sóc da mụn — thông
            tin đáng tin cậy, cộng đồng hỗ trợ và công cụ theo dõi hiệu quả.
          </p>
        </div>
        <div className="admin-footer__col">
          <h3>Về acneCare</h3>
          <ul>
            <li>
              <a href="#help">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="#terms">Điều khoản sử dụng</a>
            </li>
            <li>
              <a href="#privacy">Chính sách bảo mật</a>
            </li>
          </ul>
        </div>
        <div className="admin-footer__col">
          <h3>Kết nối với chúng tôi</h3>
          <ul>
            <li>
              <a href="#fb">Facebook</a>
            </li>
            <li>
              <a href="#ig">Instagram</a>
            </li>
            <li>
              <a href="mailto:support@acnecare.example">Email hỗ trợ</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-footer__subscribe">
        <p>
          Đăng ký nhận bản tin của chúng tôi để cập nhật những thông tin mới
          nhất
        </p>
        <form
          className="admin-footer__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Nhập email của bạn"
            aria-label="Email"
          />
          <button type="submit">Đăng ký</button>
        </form>
      </div>
      <p className="admin-footer__copy">Bản quyền © acneCare</p>
    </footer>
  )
}

function AdminHome() {
  return (
    <>
      <h1 className="admin-page-title">Trang chủ</h1>
      <div className="admin-placeholder-area">
        Khu vực nội dung tổng quan (dashboard)
      </div>
    </>
  )
}

function AdminLayout() {
  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-main">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  )
}

export default function Admin() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
