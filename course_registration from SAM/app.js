const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { Registration, Course } = require('./models');
const dotenv = require('dotenv');
const authenticateUser = require(('./authenticate'))
dotenv.config();

const app = express();
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 1000;
MONGO_URL =  process.env.MONGO_URI || "mongodb+srv://chekoduakash:wp65Gs4gg71JNhPW@cluster0.sy3k34t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Course Registration Microservice' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Create a new course
app.post('/courses', async (req, res) => {
  try {
    const { title, description, code, capacity, start_date, end_date } = req.body;

    if (!title || !code) {
      return res.status(400).json({ error: 'Title and course code are required' });
    }

    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(409).json({
        error: 'Course with this code already exists',
        course_id: existingCourse._id
      });
    }

    const newCourse = await Course.create({
      title,
      description,
      code,
      capacity: capacity || 30,
      start_date,
      end_date
    });

    return res.status(201).json({
      message: 'Course created successfully',
      course_id: newCourse._id,
      course: newCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
});

// Get all courses
app.get('/courses', authenticateUser, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

// Get course by ID
app.get('/courses/:id', authenticateUser, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    console.error(`Error fetching course ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch course', details: error.message });
  }
});

// Register a student
app.post('/register', authenticateUser, async (req, res) => {
  try {
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Get the user ID directly from the authentication middleware
    const userId = req.user._id;

    // Check if the user is a student by role (from the JWT payload)
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Only students can register for courses' });
    }

    // Find the course
    const course = await Course.findById(course_id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if the student is already registered for this course
    const existingRegistration = await Registration.findOne({
      student_id: userId,
      course_id
    });
    if (existingRegistration) {
      return res.status(409).json({
        error: 'Student already registered for this course',
        registration_id: existingRegistration._id
      });
    }

    // Check if the course has reached its capacity
    const registrationCount = await Registration.countDocuments({ course_id });
    if (course.capacity && registrationCount >= course.capacity) {
      return res.status(400).json({ error: 'Course has reached maximum capacity' });
    }

    // Create a new registration
    const registration = await Registration.create({
      student_id: userId,
      course_id,
      status: 'active',
      registration_date: new Date()
    });

    res.status(201).json({
      message: 'Registration successful',
      registration_id: registration._id,
      student_id: userId,
      course_id,
      course_title: course.title
    });
  } catch (error) {
    console.error('Error registering for course:', error);
    res.status(500).json({ error: 'Failed to register for course', details: error.message });
  }
});

// Get student registrations
app.get('/registrations/student', authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch registrations for the logged-in student using userId from the JWT payload
    const registrations = await Registration.find({ student_id: userId }).populate('course_id');

    res.status(200).json({
      student_id: userId,
      registrations: registrations.map(reg => ({
        id: reg._id,
        course_id: reg.course_id?._id,
        status: reg.status,
        registration_date: reg.registration_date,
        course: reg.course_id ? {
          title: reg.course_id.title,
          code: reg.course_id.code
        } : null
      }))
    });
  } catch (error) {
    console.error(`Error fetching registrations for student ${req.user._id}:`, error);
    res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Course Registration service listening on port ${PORT}`);
});

module.exports = app;
