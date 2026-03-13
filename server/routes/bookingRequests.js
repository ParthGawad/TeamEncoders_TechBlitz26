const express = require('express');
const router = express.Router();
const BookingRequest = require('../models/BookingRequest');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// PUBLIC — Patient submits a booking request (no auth)
router.post('/', [
  body('patientName').notEmpty().withMessage('Name is required').trim().escape(),
  body('phone').notEmpty().withMessage('Phone is required').trim().escape(),
  body('email').isEmail().withMessage('Valid email is required').trim().normalizeEmail(),
  body('problemType').notEmpty().withMessage('Problem type is required').trim().escape(),
  body('preferredDate').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('comments').optional().trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { patientName, phone, email, problemType, preferredDate, comments } = req.body;

    const bookingRequest = new BookingRequest({
      patientName, phone, email, problemType, preferredDate, comments
    });
    await bookingRequest.save();

    // Emit real-time event to receptionist
    const io = req.app.get('io');
    io.emit('booking:new', bookingRequest);

    res.status(201).json({ message: 'Booking request submitted successfully!', bookingRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET pending booking requests (auth required — receptionist)
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await BookingRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Helper: calculate next available time slot for a given date
async function getNextTimeSlot(date) {
  const appointments = await Appointment.find({ date, status: 'scheduled' })
    .sort({ timeSlot: 1 });

  if (appointments.length === 0) {
    return '09:00'; // Clinic opens at 9 AM
  }

  // Get the last appointment's time slot and add 30 minutes
  const lastSlot = appointments[appointments.length - 1].timeSlot;
  const [hours, minutes] = lastSlot.split(':').map(Number);

  let newMinutes = minutes + 30;
  let newHours = hours;

  if (newMinutes >= 60) {
    newMinutes -= 60;
    newHours += 1;
  }

  // Clinic closes at 17:30 (last slot is 17:00)
  if (newHours > 17 || (newHours === 17 && newMinutes > 0)) {
    return null; // No slots available
  }

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// APPROVE a booking request (auth required)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findById(req.params.id);
    if (!bookingRequest) return res.status(404).json({ message: 'Booking request not found' });
    if (bookingRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Booking request is already processed' });
    }

    // Auto-allocate time slot
    const timeSlot = await getNextTimeSlot(bookingRequest.preferredDate);
    if (!timeSlot) {
      return res.status(409).json({ message: 'No available time slots for this date. All slots are full.' });
    }

    // Create the actual appointment
    const appointment = new Appointment({
      patientName: bookingRequest.patientName,
      contact: bookingRequest.phone,
      date: bookingRequest.preferredDate,
      timeSlot,
    });
    await appointment.save();

    // Update booking request status
    bookingRequest.status = 'approved';
    await bookingRequest.save();

    // Emit real-time events
    const io = req.app.get('io');
    io.emit('booking:approved', { bookingRequest, appointment });
    io.emit('appointment:created', appointment);

    res.json({ message: 'Booking approved', appointment, bookingRequest });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Time slot conflict. Please try again.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DENY a booking request (auth required)
router.put('/:id/deny', auth, async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'denied' },
      { new: true }
    );
    if (!bookingRequest) return res.status(404).json({ message: 'Booking request not found' });

    const io = req.app.get('io');
    io.emit('booking:denied', bookingRequest);

    res.json({ message: 'Booking denied', bookingRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET next available time slot for a date (auth required — for preview)
router.get('/next-slot/:date', auth, async (req, res) => {
  try {
    const slot = await getNextTimeSlot(req.params.date);
    if (!slot) {
      return res.status(409).json({ message: 'No slots available for this date' });
    }
    res.json({ timeSlot: slot, date: req.params.date });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
