const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Storing as YYYY-MM-DD
    required: true,
  },
  timeSlot: {
    type: String, // e.g., '09:00', '09:30'
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  inQueue: {
    type: Boolean,
    default: false,
  },
  prescription: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// Ensures that no two scheduled appointments share the same date and time slot
AppointmentSchema.index({ date: 1, timeSlot: 1, status: 1 }, { 
  unique: true, 
  partialFilterExpression: { status: 'scheduled' } 
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
