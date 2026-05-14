const db = require('../models/db');

// Tambah target tabungan
const addGoal = async (req, res) => {
  const { title, target_amount, deadline } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      'INSERT INTO saving_goals (user_id, title, target_amount, deadline) VALUES (?, ?, ?, ?)',
      [user_id, title, target_amount, deadline]
    );
    res.status(201).json({ message: 'Target tabungan berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ambil semua target tabungan user
const getGoals = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [goals] = await db.query(
      'SELECT * FROM saving_goals WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update progress tabungan
const updateProgress = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      'UPDATE saving_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
      [amount, id, user_id]
    );
    res.json({ message: 'Progress berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Hapus target tabungan
const deleteGoal = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    await db.query(
      'DELETE FROM saving_goals WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    res.json({ message: 'Target tabungan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addGoal, getGoals, updateProgress, deleteGoal };