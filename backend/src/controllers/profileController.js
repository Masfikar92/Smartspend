const db = require('../models/db');

// GET /api/profile — ambil profil user yang login
const getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1',
      [user_id]
    );

    if (rows.length === 0) {
      return res.json({ exists: false, profile: null });
    }

    res.json({ exists: true, profile: rows[0] });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/profile — simpan atau update profil user
const saveProfile = async (req, res) => {
  const user_id = req.user.id;
  const {
    provinsi,
    klasifikasi_wilayah,
    jenis_kelamin,
    usia,
    pendidikan_terakhir,
    status_pekerjaan,
    status_pernikahan,
    jumlah_tanggungan,
    skor_literasi_keuangan,
    cicilan_hutang,
  } = req.body;

  try {
    // Cek apakah profil sudah ada
    const [existing] = await db.query(
      'SELECT id FROM user_profiles WHERE user_id = ? LIMIT 1',
      [user_id]
    );

    if (existing.length > 0) {
      // Update
      await db.query(`
        UPDATE user_profiles SET
          provinsi               = ?,
          klasifikasi_wilayah    = ?,
          jenis_kelamin          = ?,
          usia                   = ?,
          pendidikan_terakhir    = ?,
          status_pekerjaan       = ?,
          status_pernikahan      = ?,
          jumlah_tanggungan      = ?,
          skor_literasi_keuangan = ?,
          cicilan_hutang         = ?
        WHERE user_id = ?
      `, [
        provinsi, klasifikasi_wilayah, jenis_kelamin, usia,
        pendidikan_terakhir, status_pekerjaan, status_pernikahan,
        jumlah_tanggungan, skor_literasi_keuangan, cicilan_hutang,
        user_id
      ]);
    } else {
      // Insert baru
      await db.query(`
        INSERT INTO user_profiles (
          user_id, provinsi, klasifikasi_wilayah, jenis_kelamin, usia,
          pendidikan_terakhir, status_pekerjaan, status_pernikahan,
          jumlah_tanggungan, skor_literasi_keuangan, cicilan_hutang
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        user_id, provinsi, klasifikasi_wilayah, jenis_kelamin, usia,
        pendidikan_terakhir, status_pekerjaan, status_pernikahan,
        jumlah_tanggungan, skor_literasi_keuangan, cicilan_hutang
      ]);
    }

    res.json({ message: 'Profil berhasil disimpan' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, saveProfile };
