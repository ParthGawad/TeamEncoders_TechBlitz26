const mongoose = require('mongoose');

const BookingRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  problemType: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  comments: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('BookingRequest', BookingRequestSchema);
