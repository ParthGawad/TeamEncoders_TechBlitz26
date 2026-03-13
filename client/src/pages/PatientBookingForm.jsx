import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PatientBookingForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const problemTypes = [
    'General Consultation',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Ophthalmology',
    'Pediatrics',
    'Dermatology',
    'ENT (Ear, Nose, Throat)',
    'Dental',
    'Other',
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/booking-requests`, data);
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 leading-none">SUNRISE</h1>
                <span className="text-[10px] font-bold text-sky-600 tracking-[0.2em] uppercase">Medical Center</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900">Booking Request Sent!</h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              Your appointment request has been submitted successfully. Our receptionist will review and confirm your booking shortly.
            </p>
            <p className="text-sm text-slate-400 mt-2">You will be contacted via phone or email with your confirmed time slot.</p>
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={() => setSuccess(false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all hover:-translate-y-0.5"
              >
                Book Another Appointment
              </button>
              <Link
                to="/"
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-center"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">SUNRISE</h1>
              <span className="text-[10px] font-bold text-sky-600 tracking-[0.2em] uppercase">Medical Center</span>
            </div>
          </Link>
          <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-sky-100 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Online Booking
            </div>
            <h2 className="text-3xl font-black text-slate-900">Book Your Appointment</h2>
            <p className="text-slate-500 mt-2">Fill in your details and we'll get back to you with a confirmed time slot.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            {serverError && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name & Phone (row) */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    {...register('patientName', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                    className={`w-full p-3.5 bg-slate-50 border ${errors.patientName ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium`}
                    placeholder="John Doe"
                  />
                  {errors.patientName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.patientName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                  <input
                    {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9+\-\s()]+$/, message: 'Invalid phone format' } })}
                    className={`w-full p-3.5 bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                  className={`w-full p-3.5 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>

              {/* Problem Type & Date (row) */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type of Problem / Disease *</label>
                  <select
                    {...register('problemType', { required: 'Please select a problem type' })}
                    className={`w-full p-3.5 bg-slate-50 border ${errors.problemType ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium appearance-none`}
                  >
                    <option value="">Select type...</option>
                    {problemTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.problemType && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.problemType.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Date *</label>
                  <input
                    type="date"
                    min={today}
                    {...register('preferredDate', { required: 'Date is required' })}
                    className={`w-full p-3.5 bg-slate-50 border ${errors.preferredDate ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium`}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.preferredDate.message}</p>}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Comments <span className="text-slate-400 font-normal">(allergies, medications, etc.)</span></label>
                <textarea
                  {...register('comments')}
                  rows={4}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-medium resize-none"
                  placeholder="Any allergies, current medications, or other information the doctor should know..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all hover:-translate-y-0.5 text-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Booking Request
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center mt-2">
                By submitting, you agree to be contacted regarding your appointment. Your time slot will be confirmed by our receptionist.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientBookingForm;
