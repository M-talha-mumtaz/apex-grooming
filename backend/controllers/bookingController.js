const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, services, serviceNames, date, timeSlot, notes } = req.body;

    // Check for double booking
    const existingBooking = await Booking.findOne({
      date,
      timeSlot,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked or you already have a reservation.' });
    }

    const booking = new Booking({
      clientName,
      clientEmail,
      clientPhone,
      services,
      serviceNames,
      date,
      timeSlot,
      notes,
      status: 'pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking: ' + error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('service', 'name price').sort({ date: 1, timeSlot: 1 });
    
    // Auto-patch legacy bookings that lost their service reference
    let modified = false;
    for (let b of bookings) {
      if (!b.serviceName && !b.service) {
        b.serviceName = 'Haircut';
        await b.save();
        modified = true;
      } else if (b.serviceName === 'Standard Grooming' || b.serviceName === 'Unknown Service') {
        b.serviceName = 'Haircut';
        await b.save();
        modified = true;
      }
    }
    
    // If we modified, re-fetch to ensure clean state
    const finalBookings = modified 
      ? await Booking.find({}).populate('service', 'name price').sort({ date: 1, timeSlot: 1 })
      : bookings;

    res.json(finalBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      
      const subject = status === 'accepted' 
        ? 'Your Salon Appointment is Confirmed!' 
        : 'Update on Your Salon Appointment';
        
      const htmlMsg = status === 'accepted' 
        ? `<h2>Booking Confirmed</h2><p>Hello ${booking.clientName},</p><p>We are pleased to confirm your appointment for <strong>${new Date(booking.date).toLocaleDateString('fi-FI')}</strong> at <strong>${booking.timeSlot}</strong>.</p><p>Thank you for choosing us!</p>`
        : `<h2>Booking Update</h2><p>Hello ${booking.clientName},</p><p>We regret to inform you that your appointment requested for <strong>${new Date(booking.date).toLocaleDateString('fi-FI')}</strong> at <strong>${booking.timeSlot}</strong> could not be accepted at this time.</p><p>Please contact us to reschedule, or book another available slot on our website.</p>`;

      await sendEmail({
        email: booking.clientEmail,
        subject: subject,
        html: htmlMsg
      });

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      await booking.deleteOne();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus, deleteBooking };
