const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

const services = [
  {
    name: 'Haircut',
    description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
    price: 25,
    duration: 30,
    category: 'Hair',
    image: '/hair-cut.jpg'
  },
  {
    name: 'Beard Trim',
    description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
    price: 15,
    duration: 20,
    category: 'Beard',
    image: '/beard-trim.jpg'
  },
  {
    name: 'Hair Styling',
    description: 'Professional styling using luxury products providing that perfect finish.',
    price: 30,
    duration: 25,
    category: 'Styling',
    image: '/hair-styling.jpg'
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/salon')
  .then(async () => {
    console.log('MongoDB Connected. Seeding...');
    await Service.deleteMany();
    await Service.insertMany(services);
    console.log('Services inserted successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
