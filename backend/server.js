const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

app.get('/', (req, res) => {
  res.send('Premium Salon API is running...');
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    // Try primary connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/salon');
    console.log('MongoDB connected');
    
    // ONE-TIME FORCE WIPE AND SEED TO FIX DUPLICATES
    const Service = require('./models/Service');
    await Service.deleteMany({});
    await Service.insertMany([
      {
        name: 'Haircut',
        description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
        price: 25,
        duration: 30,
        category: 'Hair',
        image: '/images/services/hair-cut.jpg'
      },
      {
        name: 'Beard Trim',
        description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
        price: 15,
        duration: 20,
        category: 'Beard',
        image: '/images/services/beard-trim.jpg'
      },
      {
        name: 'Hair Styling',
        description: 'Professional styling using luxury products providing that perfect finish.',
        price: 30,
        duration: 25,
        category: 'Styling',
        image: '/images/services/hair-styling.jpg'
      }
    ]);
    console.log('Database wiped and seeded exactly 3 times.');
  } catch (err) {
    console.error('\n❌ STRICT ERROR: Database connection failed.');
    console.error('If you are using a local DB, make sure MongoDB is running.');
    console.error('If you are using MongoDB Atlas, check your network access (IP Whitelist) or password.');
    console.error('Error details:', err.message, '\n');
    process.exit(1);
  }
};

const seedDatabase = async (Service) => {
  console.log('Seeding services...');
  // MUST pass {} to strictly wipe the entire collection in Mongoose
  await Service.deleteMany({});
  await Service.insertMany([
    {
      name: 'Haircut',
      description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
      price: 25,
      duration: 30,
      category: 'Hair',
      image: '/images/services/hair-cut.jpg'
    },
    {
      name: 'Beard Trim',
      description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
      price: 15,
      duration: 20,
      category: 'Beard',
      image: '/images/services/beard-trim.jpg'
    },
    {
      name: 'Hair Styling',
      description: 'Professional styling using luxury products providing that perfect finish.',
      price: 30,
      duration: 25,
      category: 'Styling',
      image: '/images/services/hair-styling.jpg'
    }
  ]);
  console.log('Seeding complete.');
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);
