const db = require('../models/db');
const bcrypt = require('bcryptjs');

// Update nama
const updateProfile = async (req, res) => {
  const { full_name } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      'UPDATE users SET full_name = ? WHERE id = ?',
      [full_name, user_id]
    );
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
    res.json({ message: 'Profil berhasil diupdate', user: users[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update password
const updatePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const user_id = req.user.id;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
    const user = users[0];

    // Kalau login Google, tidak punya password
    if (!user.password) {
      return res.status(400).json({ message: 'Akun Google tidak bisa ganti password' });
    }

    // Cek password lama
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password lama tidak sesuai' });
    }

    // Hash password baru
    const hashed = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user_id]);

    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { updateProfile, updatePassword };