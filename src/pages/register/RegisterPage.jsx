import { Link } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import './registerPage.css'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="register-page">
        <h1 className="register-page__title">Đăng ký</h1>
        <p className="register-page__lede">
          Giao diện đăng ký sẽ được bổ sung theo Figma.{' '}
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
