require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-booking';
console.log('Connecting to MongoDB at:', mongoUri);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.log('Please make sure your local MongoDB instance is running (e.g. run "mongod" or start the mongod service).');
  });

// API Routes
app.use('/api/events', eventRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.send('Event Booking API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
