const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const externalUserService = require('../services/externalUserService'); // New import

// Sign up for Student
router.post('/signup/student', async (req, res) => {
  const { name, email, password, parentEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Student already exists' });

    // Check if email exists in external system
    const externalEmailExists = await externalUserService.emailExists(email);
    if (externalEmailExists) return res.status(400).json({ error: 'Email already exists in instructor/admin system' });

    const parent = await User.findOne({ email: parentEmail, role: 'parent' });
    if (!parent) return res.status(404).json({ error: 'Parent not found. Ask them to sign up first.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const studentUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    });

    const studentProfile = await Student.create({
      user: studentUser._id,
      parent: parent._id
    });

    res.status(201).json({ message: 'Student signed up and linked to parent', studentId: studentProfile._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign up for Parent
router.post('/signup/parent', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Parent already exists' });

    // Check if email exists in external system
    const externalEmailExists = await externalUserService.emailExists(email);
    if (externalEmailExists) return res.status(400).json({ error: 'Email already exists in instructor/admin system' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'parent'
    });

    res.status(201).json({ message: 'Parent account created', parentId: parent._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login for Parent/Student
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email (this will check both parent and student roles)
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // expires in 1 hour
    );

    // Send back the token to the user
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEW ENDPOINT: Validate a user from any system
router.get('/validate/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // First check local system
    const localUser = await User.findById(userId);
    if (localUser) {
      return res.status(200).json({
        valid: true,
        source: 'local',
        userId: localUser._id,
        role: localUser.role
      });
    }
    
    // If not found locally, check external system
    const externalUser = await externalUserService.validateUser(userId);
    if (externalUser && externalUser.valid) {
      return res.status(200).json({
        valid: true,
        source: 'external',
        userId: externalUser.user_id,
        role: externalUser.role
      });
    }
    
    // User not found in either system
    return res.status(404).json({ valid: false, error: 'User not found' });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEW ENDPOINT: Get all users from both systems
router.get('/users', async (req, res) => {
  try {
    const role = req.query.role;
    
    // Get local users
    const query = role ? { role } : {};
    const localUsers = await User.find(query);
    
    // Get external users
    const externalUsers = await externalUserService.listUsers(role);
    
    // Combine and format results
    const combinedUsers = [
      ...localUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        source: 'local'
      })),
      ...externalUsers.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role,
        source: 'external'
      }))
    ];
    
    res.status(200).json({ users: combinedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;