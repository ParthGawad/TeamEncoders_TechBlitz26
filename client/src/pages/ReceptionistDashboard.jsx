import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';

const ReceptionistDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [nextSlot, setNextSlot] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/appointments?date=${selectedDate}`, {
        headers: { 'x-auth-token': token }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/booking-requests?status=pending`, {
        headers: { 'x-auth-token': token }
      });
      setPendingRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Socket.IO: real-time updates
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    const socket = io(serverUrl);

    const handleRefresh = () => {
      const token = localStorage.getItem('token');
      axios.get(`${import.meta.env.VITE_API_URL}/appointments?date=${selectedDateRef.current}`, {
        headers: { 'x-auth-token': token }
      }).then(res => setAppointments(res.data)).catch(console.error);
    };

    socket.on('appointment:created', handleRefresh);
    socket.on('appointment:updated', handleRefresh);
    socket.on('appointment:cancelled', handleRefresh);
    socket.on('queue:updated', handleRefresh);

    socket.on('booking:new', (bookingRequest) => {
      setPendingRequests(prev => [bookingRequest, ...prev]);
    });
    socket.on('booking:approved', ({ bookingRequest }) => {
      setPendingRequests(prev => prev.filter(r => r._id !== bookingRequest._id));
    });
    socket.on('booking:denied', (bookingRequest) => {
      setPendingRequests(prev => prev.filter(r => r._id !== bookingRequest._id));
    });

    return () => socket.disconnect();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/appointments/${id}`, {
          headers: { 'x-auth-token': token }
        });
        fetchAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  const openRequestReview = async (request) => {
    setActiveRequest(request);
    setNextSlot(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/booking-requests/next-slot/${request.preferredDate}`, {
        headers: { 'x-auth-token': token }
      });
      setNextSlot(res.data.timeSlot);
    } catch (err) {
      setNextSlot('FULL');
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/booking-requests/${id}/approve`, {}, {
        headers: { 'x-auth-token': token }
      });
      setActiveRequest(null);
      fetchPendingRequests();
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async (id) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/booking-requests/${id}/deny`, {}, {
        headers: { 'x-auth-token': token }
      });
      setActiveRequest(null);
      fetchPendingRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deny booking');
    } finally {
      setActionLoading(false);
    }
  };

  const downloadPrescription = (apt) => {
    const prescriptionHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription — ${apt.patientName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
          .hospital-name { font-size: 28px; font-weight: 900; color: #0ea5e9; letter-spacing: -0.5px; }
          .hospital-sub { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
          .rx { font-size: 36px; font-weight: 900; color: #0ea5e9; margin: 20px 0 10px; }
          .patient-info { background: #f8fafc; padding: 16px 20px; border-radius: 10px; margin-bottom: 24px; }
          .patient-info p { margin: 4px 0; font-size: 14px; }
          .patient-info strong { color: #334155; }
          .prescription-list { list-style: none; padding: 0; }
          .prescription-list li { padding: 14px 18px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 8px; font-size: 15px; display: flex; align-items: center; gap: 12px; }
          .prescription-list li span.num { background: #0ea5e9; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
          .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
          .signature-area { margin-top: 50px; text-align: right; }
          .signature-line { width: 200px; border-top: 1px solid #94a3b8; margin-left: auto; padding-top: 8px; font-size: 13px; color: #64748b; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">SUNRISE MEDICAL CENTER</div>
          <div class="hospital-sub">123 Health Avenue, Medical District · +91 98765 43210</div>
        </div>
        
        <div class="patient-info">
          <p><strong>Patient Name:</strong> ${apt.patientName}</p>
          <p><strong>Contact:</strong> ${apt.contact}</p>
          <p><strong>Date:</strong> ${apt.date}</p>
          <p><strong>Time Slot:</strong> ${apt.timeSlot}</p>
        </div>

        <div class="rx">℞</div>
        
        <ul class="prescription-list">
          ${apt.prescription.map((item, i) => `<li><span class="num">${i + 1}</span> ${item}</li>`).join('')}
        </ul>

        <div class="signature-area">
          <div class="signature-line">Doctor's Signature</div>
        </div>

        <div class="footer">
          <p>This prescription was generated by Sunrise Medical Center's Clinic OS.</p>
          <p>For queries, contact: info@sunrisemedical.com</p>
        </div>

        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(prescriptionHtml);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Clinic OS</h1>
              <span className="text-xs font-medium text-slate-500">Receptionist Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {pendingRequests.length > 0 && (
              <button
                onClick={() => openRequestReview(pendingRequests[0])}
                className="relative px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl border border-amber-200 transition-colors flex items-center gap-2 animate-pulse"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {pendingRequests.length} Pending
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}
            <span className="text-sm font-medium text-slate-600 bg-slate-100 py-1.5 px-3 rounded-full">👋 Hello, {user?.username}</span>
            <button
              onClick={logout}
              className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-amber-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Pending Patient Requests ({pendingRequests.length})
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map((req) => (
                <div key={req._id} onClick={() => openRequestReview(req)} className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl cursor-pointer transition-all hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{req.patientName}</h4>
                      <p className="text-sm text-slate-500 mt-0.5">{req.problemType}</p>
                      <p className="text-xs text-amber-600 font-semibold mt-1">📅 {req.preferredDate}</p>
                    </div>
                    <span className="text-xs font-bold text-white bg-amber-500 px-2 py-1 rounded-lg">Review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Today's Schedule</h2>
            <p className="text-slate-500 mt-1">Manage walk-ins, calls, and daily flow effortlessly.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-0 font-medium text-slate-700 cursor-pointer"
            />
            <button
              onClick={() => { setEditingAppointment(null); setIsModalOpen(true); }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Booking
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700">No appointments for this date</h3>
              <p className="text-slate-500 mt-1 max-w-sm">The schedule is clear.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <div key={apt._id} className={`p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group ${
                  apt.inQueue ? 'bg-emerald-50/50' : 'hover:bg-slate-50/80'
                }`}>
                  <div className="flex items-center gap-6">
                    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border ${
                      apt.inQueue 
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                        : apt.status === 'completed'
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-gradient-to-br from-blue-50 to-teal-50 border-blue-100'
                    }`}>
                      <span className={`text-2xl font-black ${apt.inQueue ? 'text-emerald-700' : apt.status === 'completed' ? 'text-slate-400' : 'text-blue-700'}`}>{apt.timeSlot.split(':')[0]}</span>
                      <span className={`text-sm font-bold ${apt.inQueue ? 'text-teal-600' : apt.status === 'completed' ? 'text-slate-400' : 'text-teal-600'}`}>{apt.timeSlot.split(':')[1]}</span>
                    </div>
                    <div>
                      <h4 className={`text-xl font-bold ${apt.status === 'cancelled' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {apt.patientName}
                      </h4>
                      <p className="text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {apt.contact}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Status badges */}
                    {apt.inQueue && (
                      <span className="px-3 py-1.5 bg-emerald-500 text-white border border-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        With Doctor
                      </span>
                    )}
                    {apt.status === 'scheduled' && !apt.inQueue && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider hidden md:block">
                        Scheduled
                      </span>
                    )}
                    {apt.status === 'completed' && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                    {apt.status === 'cancelled' && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
                        Cancelled
                      </span>
                    )}

                    {/* Download prescription button */}
                    {apt.status === 'completed' && apt.prescription && apt.prescription.length > 0 && (
                      <button
                        onClick={() => downloadPrescription(apt)}
                        className="p-2.5 text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200 flex items-center gap-1.5"
                        title="Download Prescription"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span className="text-xs font-bold hidden sm:inline">Prescription</span>
                      </button>
                    )}
                    
                    {/* Reschedule & Cancel buttons */}
                    {apt.status === 'scheduled' && !apt.inQueue && (
                      <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingAppointment(apt); setIsModalOpen(true); }}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Reschedule"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <BookingForm 
            selectedDate={selectedDate}
            editingAppointment={editingAppointment}
            onCancel={() => { setIsModalOpen(false); setEditingAppointment(null); }}
            onSuccess={() => { setIsModalOpen(false); setEditingAppointment(null); fetchAppointments(); }}
          />
        </div>
      )}

      {/* Booking Request Approval Modal */}
      {activeRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">New Booking Request</h3>
                    <p className="text-white/80 text-sm">Patient submitted online</p>
                  </div>
                </div>
                <button onClick={() => setActiveRequest(null)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Name</p>
                  <p className="text-lg font-bold text-slate-900">{activeRequest.patientName}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-lg font-bold text-slate-900">{activeRequest.phone}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-semibold text-slate-700">{activeRequest.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Problem / Disease</p>
                  <p className="font-semibold text-slate-700">{activeRequest.problemType}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Date</p>
                  <p className="font-semibold text-slate-700">{activeRequest.preferredDate}</p>
                </div>
              </div>
              {activeRequest.comments && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Additional Comments</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{activeRequest.comments}</p>
                </div>
              )}
              <div className={`rounded-xl p-4 border-2 ${nextSlot === 'FULL' ? 'bg-red-50 border-red-200' : 'bg-teal-50 border-teal-200'}`}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Auto-Assigned Time Slot</p>
                {nextSlot === null ? (
                  <p className="font-semibold text-slate-500">Calculating...</p>
                ) : nextSlot === 'FULL' ? (
                  <p className="font-bold text-red-600">❌ No slots available for this date</p>
                ) : (
                  <p className="text-2xl font-black text-teal-700">{nextSlot}</p>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => handleDeny(activeRequest._id)} disabled={actionLoading} className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 hover:border-red-200">
                ✕ Deny
              </button>
              <button onClick={() => handleApprove(activeRequest._id)} disabled={actionLoading || nextSlot === 'FULL' || nextSlot === null} className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {actionLoading ? 'Processing...' : '✓ Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
