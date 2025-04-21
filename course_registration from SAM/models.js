const mongoose = require('mongoose');

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  code: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    default: 30
  },
  start_date: Date,
  end_date: Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'courses'
});

// Registration Schema
const registrationSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Reference to the Profile model
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'dropped', 'completed'],
    default: 'active'
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'registrations'
});

// Models
const Course = mongoose.model('Course', courseSchema);
const Registration = mongoose.model('Registration', registrationSchema);

module.exports = {
  mongoose,
  Course,
  Registration
};
