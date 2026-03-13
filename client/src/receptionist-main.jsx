import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Login from './pages/Login'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import { useContext } from 'react'

function ReceptionistApp() {
  const { user, logout } = useContext(AuthContext)

  if (!user) return <Login />
  if (user.role !== 'receptionist') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-4">This portal is for receptionists only. You are logged in as <strong>{user.role}</strong>.</p>
          <button onClick={logout} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">Log Out & Switch Account</button>
        </div>
      </div>
    )
  }
  return <ReceptionistDashboard />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ReceptionistApp />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
