const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected.');

    const studentUser = await User.findOne({ email: 'student2@example.com' });
    const studentProfile = await Student.findOne({ user: studentUser._id });

    if (!studentProfile) {
      console.log('Student not found.');
      return;
    }

    studentProfile.attendance.push(
      { date: new Date('2025-04-10'), status: 'Present' },
      { date: new Date('2025-04-11'), status: 'Absent' }
    );

    studentProfile.marks.push(
      { subject: 'Math', exam: 'Unit Test 1', score: 18, outOf: 20 },
      { subject: 'Science', exam: 'Mid Term', score: 70, outOf: 100 }
    );

    studentProfile.ptm.push(
      { date: new Date('2025-04-05'), notes: 'Discussed academic performance', attended: true },
      { date: new Date('2025-03-01'), notes: 'Missed PTM', attended: false }
    );

    await studentProfile.save();

    console.log('Dummy data added to student profile.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

seedData();
