import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing'
import LoginPage from './pages/login/LoginPage'
import RegisterStep1 from './pages/register/RegisterStep1'
import RegisterStep2 from './pages/register/RegisterStep2'
import ProfilePage from './pages/profile/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterStep1 />} />
      <Route path="/register/profile" element={<RegisterStep2 />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
