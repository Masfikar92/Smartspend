import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'];
const formatRp = (val) => 'Rp ' + Number(val).toLocaleString('id-ID');

export default function RiwayatPage() {
  const now = new Date();
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', { params: { month: selectedMonth, year: selectedYear } });
      setTransactions(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTransactions(); }, [selectedMonth, selectedYear]);

  return (
    <MainLayout>
      <style>{`
        .riwayat-table-header { display: grid; grid-template-columns: 130px 1fr 150px 120px; padding: 12px 16px; background: linear-gradient(135deg, #54B5FF, #336D99); gap: 8px; }
        .riwayat-row { display: grid; grid-template-columns: 130px 1fr 150px 120px; padding: 12px 16px; gap: 8px; align-items: center; }
        .riwayat-tanggal { display: block; }
        @media (max-width: 640px) {
          .riwayat-table-header { grid-template-columns: 100px 1fr 120px; }
          .riwayat-row { grid-template-columns: 100px 1fr 120px; }
          .riwayat-tanggal { display: none; }
          .riwayat-th-tanggal { display: none; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>Riwayat Transaksi</h1>
        <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Semua catatan keuanganmu</p>
      </div>

      {/* Filter */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '0.5px solid #e4e7ec', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>Filter Bulan:</span>
        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #d0d5dd', fontSize: '13px', color: '#344054', outline: 'none' }}>
          {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #d0d5dd', fontSize: '13px', color: '#344054', outline: 'none' }}>
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Tabel */}
      <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
        <div className="riwayat-table-header">
          {['Tipe', 'Keterangan', 'Nominal'].map((h, i) => (
            <span key={i} style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{h}</span>
          ))}
          <span className="riwayat-th-tanggal" style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>Tanggal</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#667085', fontSize: '14px' }}>Memuat data...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#667085', fontSize: '14px' }}>Tidak ada transaksi di bulan ini.</div>
        ) : transactions.map((t, i) => {
          const isSaving = t.category === 'Tabungan';
          const bg    = t.type === 'income' ? '#e1f5ee' : isSaving ? '#e3f2fd' : '#faece7';
          const color = t.type === 'income' ? '#0f6e56' : isSaving ? '#0c447c' : '#993c1d';
          const label = t.type === 'income' ? '↑ Masuk' : isSaving ? '🏦 Tabungan' : '↓ Keluar';
          return (
            <div key={t.id} className="riwayat-row" style={{ borderBottom: i < transactions.length - 1 ? '0.5px solid #f2f4f7' : 'none', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600', background: bg, color, width: 'fit-content' }}>
                {label}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#101828', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || '-'}</p>
                <p style={{ fontSize: '11px', color: '#667085', margin: 0 }}>{t.category}</p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: t.type === 'income' ? '#0f6e56' : '#993c1d', whiteSpace: 'nowrap' }}>
                {t.type === 'income' ? '+' : isSaving ? '🏦' : '-'} {formatRp(t.amount)}
              </span>
              <span className="riwayat-tanggal" style={{ fontSize: '12px', color: '#667085' }}>
                {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}