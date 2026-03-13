import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Login from './pages/Login'
import DoctorDashboard from './pages/DoctorDashboard'
import { useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'

function DoctorApp() {
  const { user, logout } = useContext(AuthContext)

  if (!user) return <Login />
  if (user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">This portal is for doctors only. You are logged in as <strong>{user.role}</strong>.</p>
          <button onClick={logout} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Log Out & Switch Account</button>
        </div>
      </div>
    )
  }
  return <DoctorDashboard />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <DoctorApp />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
