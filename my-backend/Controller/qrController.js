import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

export const generateQR = async (req, res) => {
  try {
    const { courseCode, lecturerId } = req.body;

    // Create token that expires in 5 minutes
    const token = jwt.sign(
      { courseCode, lecturerId },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    const qr = await QRCode.toDataURL(token);
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
