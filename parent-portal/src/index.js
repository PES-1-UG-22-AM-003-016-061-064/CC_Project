{/*
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const parentRoutes = require('./routes/parentRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/parent', parentRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Parent Portal Service running on port ${process.env.PORT}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));

*/}
const express = require('express');
const path = require('path');
const app = express();
const port = 5005;  // Use the same port as your frontend, if needed.
const mongoose = require('mongoose')

const parentRoutes = require('./routes/parentRoutes'); // Import parent routes

// Middleware to serve static files (html, css, js)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON in requests
app.use(express.json());

// Use parent routes for the dashboard endpoint
app.use('/parent', parentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Parent portal server running at http://localhost:${port}`);
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Parent Portal Service running on port ${process.env.PORT}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));


