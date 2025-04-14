const express = require('express');
const Profile = require('../models/profile.model');
const authenticateUser = require('../middleware/auth.middleware');

const router = express.Router();

// GET /profile/me - Get current user's profile
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /profile/me - Update current user's profile
router.put('/me', authenticateUser, async (req, res) => {
  try {
    const { name, email, phone, rollNumber, department, year, designation, subjects, studentId } = req.body;

    // Validate the request body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Find the existing profile
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update fields based on role
    if (profile.role === 'student') {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone || profile.phone;
      profile.rollNumber = rollNumber || profile.rollNumber;
      profile.department = department || profile.department;
      profile.year = year || profile.year;
    } else if (profile.role === 'professor') {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone || profile.phone;
      profile.designation = designation || profile.designation;
      profile.subjects = subjects || profile.subjects;
    } else if (profile.role === 'parent') {
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.phone = phone || profile.phone;
      profile.studentId = studentId || profile.studentId;
    }

    // Save the updated profile
    await profile.save();

    return res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
