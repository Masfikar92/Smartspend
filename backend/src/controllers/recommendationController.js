const db = require('../models/db');
const axios = require('axios');

const ML_SERVICE = 'http://localhost:8000';

const getRecommendation = async (req, res) => {
  const user_id = req.user.id;

  try {
    const now   = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();

    // Ambil summary pemasukan & pengeluaran bulan ini
    const [summary] = await db.query(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions 
      WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
    `, [user_id, month, year]);

    const income  = Number(summary[0].income)  || 0;
    const expense = Number(summary[0].expense) || 0;
    const saving  = income - expense;
    const rasio   = income > 0 ? (saving / income) * 100 : 0;

    // Ambil pengeluaran per kategori
    const [categories] = await db.query(`
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND type = 'expense'
      AND MONTH(date) = ? AND YEAR(date) = ?
      GROUP BY category
    `, [user_id, month, year]);

    const catMap = {};
    categories.forEach(c => { catMap[c.category] = Number(c.total); });

    // Ambil profil demografi user
    const [profiles] = await db.query(
      `SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1`,
      [user_id]
    );
    const profile = profiles[0] || {};

    // expense_for_model: exclude kategori Tabungan agar tidak bias ke model
    // (tabungan bukan pengeluaran konsumsi, tapi sudah tercatat sebagai expense di DB)
    const tabungan_dicatat  = catMap['Tabungan'] || 0;
    const expense_for_model = expense - tabungan_dicatat;
    const saving_for_model  = income - expense_for_model;
    const rasio_for_model   = income > 0 ? (saving_for_model / income) * 100 : 0;

    // Fitur keuangan untuk model (pakai nilai yang sudah di-exclude tabungan)
    const keuangan = {
      pendapatan_bulanan            : income,
      total_pengeluaran             : expense_for_model,
      tabungan_bulanan              : saving_for_model > 0 ? saving_for_model : 0,
      rasio_tabungan_persen         : rasio_for_model,
      pengeluaran_perumahan_listrik : (catMap['Tempat Tinggal'] || 0) + (catMap['Tagihan & Utilitas'] || 0),
      pengeluaran_makanan_pokok     : catMap['Makanan & Minuman'] || 0,
      pengeluaran_transportasi      : catMap['Transportasi']      || 0,
      pengeluaran_pendidikan        : catMap['Pendidikan']        || 0,
      pengeluaran_kesehatan         : catMap['Kesehatan']         || 0,
      pengeluaran_hiburan_rekreasi  : catMap['Hiburan']           || 0,
      pengeluaran_jajan_makan_luar  : catMap['Makanan & Minuman'] || 0,
    };

    // Breakdown 50/30/20 — pakai expense & saving aktual (include tabungan)
    // agar user melihat gambaran cashflow yang sesungguhnya
    const kebutuhan_aktual =
      (catMap['Makanan & Minuman'] || 0) +
      (catMap['Tempat Tinggal']    || 0) +
      (catMap['Tagihan & Utilitas']|| 0) +
      (catMap['Transportasi']      || 0) +
      (catMap['Kesehatan']         || 0) +
      (catMap['Pendidikan']        || 0);

    const keinginan_aktual =
      (catMap['Hiburan']           || 0) +
      (catMap['Belanja']           || 0) +
      (catMap['Lainnya']           || 0);

    // Tabungan aktual = sisa cashflow + yang sudah dicatat sebagai tabungan target
    const tabungan_aktual = (saving > 0 ? saving : 0) + tabungan_dicatat;

    const budget_5030_20 = {
      kebutuhan: {
        ideal   : Math.round(income * 0.5),
        aktual  : kebutuhan_aktual,
        kategori: ['Makanan & Minuman', 'Tempat Tinggal', 'Tagihan & Utilitas', 'Transportasi', 'Kesehatan', 'Pendidikan'],
      },
      keinginan: {
        ideal   : Math.round(income * 0.3),
        aktual  : keinginan_aktual,
        kategori: ['Hiburan', 'Belanja', 'Lainnya'],
      },
      tabungan: {
        ideal   : Math.round(income * 0.2),
        aktual  : tabungan_aktual,
        kategori: ['Sisa income setelah pengeluaran', 'Tabungan target'],
      },
    };

    // Payload AI model
    const aiPayload = {
      ...keuangan,
      provinsi              : profile.provinsi               || 'DKI Jakarta',
      klasifikasi_wilayah   : profile.klasifikasi_wilayah    || 'Perkotaan',
      jenis_kelamin         : profile.jenis_kelamin          || 'Laki-laki',
      usia                  : profile.usia                   || 25,
      pendidikan_terakhir   : profile.pendidikan_terakhir    || 'SMA',
      status_pekerjaan      : profile.status_pekerjaan       || 'Karyawan Swasta',
      status_pernikahan     : profile.status_pernikahan      || 'Belum Menikah',
      jumlah_tanggungan     : profile.jumlah_tanggungan      || 0,
      skor_literasi_keuangan: profile.skor_literasi_keuangan || 50,
      cicilan_hutang        : profile.cicilan_hutang         || 0,
    };

    // Payload DS model
    const dsPayload = {
      ...keuangan,
      skor_literasi_keuangan: profile.skor_literasi_keuangan || 50,
      cicilan_hutang        : profile.cicilan_hutang         || 0,
    };

    // Panggil kedua model secara paralel
    const [aiResponse, dsResponse] = await Promise.all([
      axios.post(`${ML_SERVICE}/predict/kondisi`, aiPayload),
      axios.post(`${ML_SERVICE}/predict/cluster`, dsPayload),
    ]);

    res.json({
      summary        : { income, expense, saving, rasio: rasio.toFixed(1) },
      kondisi        : aiResponse.data,
      cluster        : dsResponse.data,
      budget_5030_20 : budget_5030_20,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getRecommendation };