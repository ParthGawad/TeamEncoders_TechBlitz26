import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 shadow-xl sticky top-0 z-10 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
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
          <button
            onClick={logout}
            className="text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Patient Appointments</h2>
            <p className="text-slate-500 font-medium">View your daily lineup cleanly.</p>
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
                <div key={apt._id} className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-400 rounded-l-2xl"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-teal-50 text-teal-700 font-black text-lg rounded-lg">
                      {apt.timeSlot}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 font-bold text-xs rounded-full uppercase tracking-widest">
                      Confirmed
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-1">{apt.patientName}</h4>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                       <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {apt.contact}
                    </p>
                  </div>
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
