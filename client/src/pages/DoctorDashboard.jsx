import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const selectedDateRef = useRef(selectedDate);
  const [activePatient, setActivePatient] = useState(null); // appointment in consultation
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

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
      // If there was an active patient, update its data
      if (activePatient) {
        const updated = res.data.find(a => a._id === activePatient._id);
        if (updated && updated.inQueue) setActivePatient(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  // Socket.IO
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

    return () => socket.disconnect();
  }, []);

  const startConsultation = async (apt) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/appointments/${apt._id}/start-consultation`, {}, {
        headers: { 'x-auth-token': token }
      });
      setActivePatient(res.data);
      setPrescriptionItems([]);
      setNewItem('');
      fetchAppointments();
    } catch (err) {
      alert('Failed to start consultation');
    } finally {
      setLoading(false);
    }
  };

  const addPrescriptionItem = () => {
    if (newItem.trim()) {
      setPrescriptionItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removePrescriptionItem = (index) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const endConsultation = async () => {
    if (!activePatient) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/appointments/${activePatient._id}/end-consultation`, {
        prescription: prescriptionItems
      }, {
        headers: { 'x-auth-token': token }
      });
      setActivePatient(null);
      setPrescriptionItems([]);
      setNewItem('');
      fetchAppointments();
    } catch (err) {
      alert('Failed to end consultation');
    } finally {
      setLoading(false);
    }
  };

  const queuedPatient = appointments.find(a => a.inQueue);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 shadow-xl sticky top-0 z-10 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Dr. {user?.username}</h1>
              <span className="text-sm font-medium text-teal-400">Clinical Schedule View</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {queuedPatient && (
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-xl">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-emerald-300">In Session: {queuedPatient.patientName}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Active Consultation Panel */}
        {activePatient && (
          <div className="mb-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-200 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Consultation — {activePatient.patientName}</h3>
                  <p className="text-emerald-100 text-sm">{activePatient.timeSlot} · {activePatient.contact}</p>
                </div>
              </div>
              <button
                onClick={endConsultation}
                disabled={loading}
                className="px-6 py-2.5 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : '✓ End Consultation'}
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Prescription Notes</h4>
              
              {/* Prescription items list */}
              {prescriptionItems.length > 0 && (
                <div className="space-y-2 mb-4">
                  {prescriptionItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 group">
                      <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</span>
                      <span className="flex-1 font-medium text-slate-800">{item}</span>
                      <button
                        onClick={() => removePrescriptionItem(i)}
                        className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new item */}
              <div className="flex gap-3">
                <input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPrescriptionItem()}
                  placeholder="e.g. Tab. Paracetamol 500mg — 1 tablet after meals, 3 times daily"
                  className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium text-slate-700 placeholder:text-slate-400"
                />
                <button
                  onClick={addPrescriptionItem}
                  disabled={!newItem.trim()}
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add
                </button>
              </div>

              {prescriptionItems.length === 0 && (
                <p className="text-sm text-slate-400 mt-3 text-center">No prescription items added yet. Type above to add medications or instructions.</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Patient Appointments</h2>
            <p className="text-slate-500 font-medium">Select a patient to start consultation.</p>
          </div>
          <div className="w-full sm:w-auto">
             <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 font-bold text-slate-700 cursor-pointer shadow-inner"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-8">
           {appointments.length === 0 ? (
            <div className="py-24 text-center">
              <h3 className="text-xl font-bold text-slate-400">No patients scheduled yet.</h3>
              <p className="text-slate-400 mt-2">Enjoy your free time!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {appointments.filter(a => a.status !== 'cancelled').map((apt) => (
                <div key={apt._id} className={`p-6 rounded-2xl border relative overflow-hidden group transition-all ${
                  apt.inQueue 
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-md' 
                    : apt.status === 'completed'
                      ? 'bg-slate-50/50 border-slate-100'
                      : 'bg-gradient-to-br from-slate-50 to-white border-slate-100 hover:shadow-md'
                }`}>
                  <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${
                    apt.inQueue ? 'bg-emerald-500' : apt.status === 'completed' ? 'bg-slate-300' : 'bg-teal-400'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-teal-50 text-teal-700 font-black text-lg rounded-lg">
                      {apt.timeSlot}
                    </span>
                    {apt.inQueue ? (
                      <span className="px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        With Doctor
                      </span>
                    ) : apt.status === 'completed' ? (
                      <span className="px-3 py-1 bg-slate-200 text-slate-600 font-bold text-xs rounded-full uppercase tracking-widest">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 font-bold text-xs rounded-full uppercase tracking-widest">
                        Waiting
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-slate-900 mb-1">{apt.patientName}</h4>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                       <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {apt.contact}
                    </p>
                  </div>

                  {/* Action buttons */}
                  {apt.status === 'scheduled' && !apt.inQueue && !queuedPatient && (
                    <button
                      onClick={() => startConsultation(apt)}
                      disabled={loading}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                      Start Consultation
                    </button>
                  )}

                  {apt.status === 'scheduled' && !apt.inQueue && queuedPatient && (
                    <div className="w-full py-2.5 bg-amber-50 border border-amber-200 text-amber-700 font-semibold rounded-xl text-sm text-center">
                      ⏳ In Queue — Waiting
                    </div>
                  )}

                  {apt.status === 'completed' && apt.prescription && apt.prescription.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400 font-semibold">
                      📋 {apt.prescription.length} prescription item(s) recorded
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
