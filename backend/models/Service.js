const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // in EUR
  duration: { type: Number, required: true }, // in minutes
  category: { type: String, required: true }, // e.g., 'Haircut', 'Beard', 'Styling'
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
