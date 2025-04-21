const Student = require('../models/Student');
const User = require('../models/User'); 

const getDashboard = async (req, res) => {
  try {
    const parentId = req.user.id;

    const students = await Student.find({ parent: parentId })
      .populate('user', 'name email') // optional: show student name/email
      .populate('parent', 'name email'); // optional

    res.status(200).json({
      success: true,
      data: students.map(student => ({
        studentId: student._id,
        studentInfo: student.user,
        attendance: student.attendance,
        marks: student.marks,
        ptm: student.ptm
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboard };
