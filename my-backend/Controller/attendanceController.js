import jwt from 'jsonwebtoken';
import Attendance from '../models/Attendance.js';

export const markAttendance = async (req, res) => {
  try {
    const { token, studentId } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(400).json({ message: 'Invalid or expired QR' });

    const alreadyMarked = await Attendance.findOne({
      studentId,
      courseCode: decoded.courseCode
    });

    if (alreadyMarked) return res.status(400).json({ message: 'Already marked' });

    const record = new Attendance({
      studentId,
      courseCode: decoded.courseCode,
      timestamp: new Date()
    });

    await record.save();
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
