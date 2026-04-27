const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, deleteBooking, getBusySlots } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(createBooking).get(protect, getBookings);
router.route('/busy').get(getBusySlots);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id').delete(protect, deleteBooking);

module.exports = router;
