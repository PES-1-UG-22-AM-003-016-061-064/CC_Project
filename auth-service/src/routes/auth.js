// File: routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Student = require('../models/Student');
const Profile = require('../models/Profile');

// Sign up for Student
router.post('/signup/student', async (req, res) => {
  const {
    name,
    email,
    password,
    parentEmail,
    rollNumber,
    department,
    year
  } = req.body;

  try {
    if (!name || !email || !password || !parentEmail) {
      return res.status(400).json({ error: 'Name, email, password, and parentEmail are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Student already exists' });

    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!parent) return res.status(404).json({ error: 'Parent not found. Ask them to sign up first.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const studentUser = await User.create({ name, email, password: hashedPassword, role: 'student' });

    await Student.create({ user: studentUser._id, parent: parent._id });

    // Build profile data dynamically
    const profileData = { userId: studentUser._id, role: 'student', name, email };
    if (rollNumber) profileData.rollNumber = rollNumber;
    if (department) profileData.department = department;
    if (year) profileData.year = year;
    await Profile.create(profileData);

    // Optionally update parent profile with studentId
    await Profile.findOneAndUpdate({ userId: parent._id }, { studentId: studentUser._id });

    res.status(201).json({ message: 'Student signed up and linked to parent', studentId: studentUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign up for Parent
router.post('/signup/parent', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Parent already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parentUser = await User.create({ name, email, password: hashedPassword, role: 'parent' });

    // Build parent profile data
    const profileData = { userId: parentUser._id, role: 'parent', name, email };
    if (phone) profileData.phone = phone;
    await Profile.create(profileData);

    res.status(201).json({ message: 'Parent account created', parentId: parentUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login for Parent/Student
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

    let studentData = null;
    if (user.role === 'parent') {
      const students = await Student.find({ parent: user._id }).populate('user');
      studentData = students.map(s => ({ studentId: s._id, studentName: s.user.name, studentEmail: s.user.email }));
    }

    res.status(200).json({ message: 'Login successful', token, studentData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;