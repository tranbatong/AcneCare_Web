import AuthSiteHeader from '../components/layout/AuthSiteHeader'
import SiteFooter from '../components/layout/SiteFooter'
import './authLayout.css'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <AuthSiteHeader />
      <main className="auth-layout__main">{children}</main>
      <SiteFooter />
    </div>
  )
}
