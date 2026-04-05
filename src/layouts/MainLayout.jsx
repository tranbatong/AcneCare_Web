import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import '../components/common/Layout.css'

/**
 * MainLayout — wraps every acne-module page with the shared Header + Footer.
 * Usage:
 *   <MainLayout>
 *     <main>…page content…</main>
 *   </MainLayout>
 */
export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout__content">
        {children}
      </div>
      <Footer />
    </div>
  )
}
