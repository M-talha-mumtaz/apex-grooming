const express = require('express');
const router = express.Router();
const { getServices, createService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getServices).post(protect, createService);
router.route('/:id').delete(protect, deleteService);

module.exports = router;
