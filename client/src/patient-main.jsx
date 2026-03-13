import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import PatientWebsite from './pages/PatientWebsite'
import PatientBookingForm from './pages/PatientBookingForm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientWebsite />} />
        <Route path="/book" element={<PatientBookingForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
