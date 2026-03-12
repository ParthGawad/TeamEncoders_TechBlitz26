import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const BookingForm = ({ onSuccess, onCancel, selectedDate, editingAppointment }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      patientName: editingAppointment?.patientName || '',
      contact: editingAppointment?.contact || '',
      date: editingAppointment?.date || selectedDate || '',
      timeSlot: editingAppointment?.timeSlot || '',
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 17; i++) {
      slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      slots.push(`${i < 10 ? '0' : ''}${i}:30`);
    }
    return slots;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      if (editingAppointment) {
        await axios.put(`${import.meta.env.VITE_API_URL}/appointments/${editingAppointment._id}`, data, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, data, config);
      }
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        {editingAppointment ? 'Reschedule Appointment' : 'Book Appointment'}
      </h3>
      
      {serverError && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Name</label>
          <input
            {...register('patientName', { required: 'Patient Name is required', minLength: { value: 2, message: 'Name too short' } })}
            className={`w-full p-3 bg-slate-50 border ${errors.patientName ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500`}
            placeholder="John Doe"
          />
          {errors.patientName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.patientName.message}</p>}
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
           <input
            {...register('contact', { required: 'Contact is required', pattern: { value: /^[0-9+\-\s()]+$/, message: 'Invalid phone format' } })}
            className={`w-full p-3 bg-slate-50 border ${errors.contact ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500`}
            placeholder="+1234567890"
          />
          {errors.contact && <p className="text-red-500 text-xs mt-1 font-medium">{errors.contact.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className={`w-full p-3 bg-slate-50 border ${errors.date ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date.message}</p>}
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Time Slot</label>
             <select
              {...register('timeSlot', { required: 'Time slot is required' })}
              className={`w-full p-3 bg-slate-50 border ${errors.timeSlot ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none`}
             >
               <option value="">Select Time</option>
               {generateTimeSlots().map(slot => (
                 <option key={slot} value={slot}>{slot}</option>
               ))}
             </select>
             {errors.timeSlot && <p className="text-red-500 text-xs mt-1 font-medium">{errors.timeSlot.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex justify-center items-center"
          >
            {loading ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
