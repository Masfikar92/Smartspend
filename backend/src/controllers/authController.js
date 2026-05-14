const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// REGISTER
const register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Cek email sudah ada belum
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await db.query(
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
      [full_name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Akun berhasil dibuat' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek email ada tidak
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (users.length === 0) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const user = users[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };