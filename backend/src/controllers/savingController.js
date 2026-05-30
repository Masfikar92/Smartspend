const db = require('../models/db');

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

const updateProgress = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const user_id = req.user.id;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Nominal tidak valid' });
  }

  try {
    const [goals] = await db.query(
      'SELECT title FROM saving_goals WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (goals.length === 0) {
      return res.status(404).json({ message: 'Target tidak ditemukan' });
    }

    const title = goals[0].title;
    const today = new Date().toISOString().split('T')[0];

    await Promise.all([
      db.query(
        'UPDATE saving_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
        [amount, id, user_id]
      ),
      db.query(
        'INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, 'expense', 'Tabungan', `Tabungan: ${title}`, amount, today]
      )
    ]);

    res.json({ message: 'Progress berhasil diupdate' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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