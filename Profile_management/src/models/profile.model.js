const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Links to Auth service user ID
    },
    role: {
      type: String,
      enum: ['student', 'parent', 'professor'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,

    // Student-specific
    rollNumber: String,
    department: String,
    year: Number,

    // Professor-specific
    designation: String,
    subjects: [String],

    // Parent-specific
    studentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
