const db = require('../models/db');

// Tambah transaksi
const addTransaction = async (req, res) => {
  const { type, category, description, amount, date } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      'INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, type, category, description, amount, date]
    );
    res.status(201).json({ message: 'Transaksi berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ambil semua transaksi user
const getTransactions = async (req, res) => {
  const user_id = req.user.id;
  const { month, year } = req.query;

  try {
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    let params = [user_id];

    if (month && year) {
      query += ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(month, year);
    }

    query += ' ORDER BY date DESC';
    const [transactions] = await db.query(query, params);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ambil summary (total pemasukan, pengeluaran, sisa)
const getSummary = async (req, res) => {
  const user_id = req.user.id;
  const { month, year } = req.query;

  try {
    let query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions 
      WHERE user_id = ?
    `;
    let params = [user_id];

    if (month && year) {
      query += ' AND MONTH(date) = ? AND YEAR(date) = ?';
      params.push(month, year);
    }

    const [rows] = await db.query(query, params);
    const income = rows[0].total_income || 0;
    const expense = rows[0].total_expense || 0;

    res.json({
      total_income: income,
      total_expense: expense,
      balance: income - expense
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ambil data grafik 6 bulan terakhir
const getChartData = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.query(`
      SELECT 
        MONTH(date) as month,
        YEAR(date) as year,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(date), MONTH(date)
      ORDER BY YEAR(date), MONTH(date)
    `, [user_id]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Hapus transaksi
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    await db.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addTransaction, getTransactions, getSummary, getChartData, deleteTransaction };