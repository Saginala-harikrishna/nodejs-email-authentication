const db = require('../config/db');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../services/mailService');
const bcrypt = require('bcrypt');

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    await sendOTPEmail(email, otp);
    await db.execute(
      'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    );

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { name, email, password, otp } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1',
      [email]
    );

    if (!rows.length) return res.status(400).json({ message: 'No OTP found for this email.' });

    const record = rows[0];

    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    await db.execute('DELETE FROM otps WHERE email = ?', [email]);

    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ message: 'Verification failed.' });
  }
};
