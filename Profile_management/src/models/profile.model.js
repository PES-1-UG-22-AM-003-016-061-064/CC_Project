const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the user's MongoDB ID
      ref: 'User',  // Reference to the User model (auth service)
      required: true,
      unique: true, // Ensures one profile per user
    },
    role: {
      type: String,
      enum: ['student', 'parent'], // Matched with auth service roles
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

    // Parent-specific
    studentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);