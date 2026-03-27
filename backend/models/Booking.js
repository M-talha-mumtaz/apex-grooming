const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // legacy
  serviceName: { type: String }, // legacy
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  serviceNames: [{ type: String }],
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // Format HH:MM
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

// Prevent duplicate bookings at the same time slot for a general salon (or specific barber).
// For simplicity, we ensure date + timeSlot is unique per booking if it's accepted or pending.
// It will be handled in the controller logic.

module.exports = mongoose.model('Booking', bookingSchema);
