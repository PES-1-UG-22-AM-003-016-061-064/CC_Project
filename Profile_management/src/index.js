require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const profileRoutes = require('./routes/profile.routes');

const app = express();
const PORT = process.env.PORT || 4002;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware to parse JSON
app.use(express.json());

// Health check route (optional but useful)
app.get('/', (req, res) => {
  res.send('Profile Management Service is running!');
});

// Mount profile routes
app.use('/profile', profileRoutes);

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`Profile service listening on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
