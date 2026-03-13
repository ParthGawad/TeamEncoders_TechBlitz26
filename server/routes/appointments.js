const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all appointments
router.get('/', auth, async (req, res) => {
  try {
    // Optionally filter by date: ?date=YYYY-MM-DD
    const filter = {};
    if (req.query.date) filter.date = req.query.date;

    const appointments = await Appointment.find(filter).sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Book an appointment
router.post('/', auth, [
  body('patientName').notEmpty().withMessage('Patient name is required').trim().escape(),
  body('contact').notEmpty().withMessage('Contact is required').trim().escape(),
  body('date').isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('timeSlot').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time slot (HH:MM) is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { patientName, contact, date, timeSlot } = req.body;
    
    // Check for clash
    const existing = await Appointment.findOne({ date, timeSlot, status: 'scheduled' });
    if (existing) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({ patientName, contact, date, timeSlot });
    await appointment.save();

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('appointment:created', appointment);

    res.status(201).json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update/Reschedule appointment
router.put('/:id', auth, [
  body('patientName').optional().notEmpty().withMessage('Patient name cannot be empty').trim().escape(),
  body('contact').optional().notEmpty().withMessage('Contact cannot be empty').trim().escape(),
  body('date').optional().isDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('timeSlot').optional().matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time slot (HH:MM) is required'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { date, timeSlot, status } = req.body;
    
    // If rescheduling, check clash
    if (date && timeSlot && (!status || status === 'scheduled')) {
      const existing = await Appointment.findOne({ 
        date, 
        timeSlot, 
        status: 'scheduled',
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(409).json({ message: 'Time slot is already booked' });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('appointment:updated', appointment);

    res.json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Emit real-time event
    const io = req.app.get('io');
    io.emit('appointment:cancelled', appointment);

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start consultation — put patient in queue
router.put('/:id/start-consultation', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { inQueue: true },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const io = req.app.get('io');
    io.emit('queue:updated', appointment);

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// End consultation — save prescription, complete appointment
router.put('/:id/end-consultation', auth, async (req, res) => {
  try {
    const { prescription } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        inQueue: false, 
        status: 'completed', 
        prescription: prescription || [] 
      },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const io = req.app.get('io');
    io.emit('queue:updated', appointment);
    io.emit('appointment:updated', appointment);

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
