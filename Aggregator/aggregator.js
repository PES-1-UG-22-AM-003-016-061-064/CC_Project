const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7000; // Aggregator service on port 5000

app.use(express.json());

app.get('/student/dashboard', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  try {
    // Call Profile Management
    const profileRes = await axios.get('http://localhost:4002/profile/me', {
      headers: { Authorization: authHeader }
    });

    // Call Course Registration
    const coursesRes = await axios.get('http://localhost:1000/registrations/student', {
      headers: { Authorization: authHeader }
    });

    return res.status(200).json({
      message: 'Student dashboard data fetched successfully',
      profile: profileRes.data,
      registeredCourses: coursesRes.data
    });

  } catch (error) {
    console.error('Aggregator error:', error?.response?.data || error.message);
    return res.status(500).json({ message: 'Error fetching data', error: error?.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Aggregator service running on port ${PORT}`);
});
