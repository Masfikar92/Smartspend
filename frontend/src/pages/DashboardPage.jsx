import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const EXPENSE_CATEGORIES = [
  'Makanan & Minuman','Transportasi','Tempat Tinggal',
  'Pulsa & Internet','Hiburan','Belanja & Fashion',
  'Kesehatan','Pendidikan','Tagihan & Utilitas',
  'Hadiah & Sosial','Tabungan & Investasi','Lainnya'
];
const INCOME_CATEGORIES = [
  'Gaji','Freelance','Kiriman / Uang Saku',
  'Investasi','Bisnis','Lainnya'
];

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'];

const formatRp = (val) =>
  'Rp ' + Number(val).toLocaleString('id-ID');

export default function DashboardPage() {
  const { user } = useAuth();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [chartData, setChartData] = useState([]);
  const [form, setForm] = useState({
  description: '', amount: '', type: 'expense', category: ''
});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchSummary = async () => {
    try {
      const res = await api.get('/transactions/summary', {
        params: { month: currentMonth + 1, year: currentYear }
      });
      setSummary(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchChart = async () => {
    try {
      const res = await api.get('/transactions/chart');
      const formatted = res.data.map(row => ({
        name: MONTH_NAMES[row.month - 1].slice(0, 3),
        Pemasukan: Number(row.income),
        Pengeluaran: Number(row.expense),
      }));
      setChartData(formatted);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSummary(); }, [currentMonth, currentYear]);
  useEffect(() => { fetchChart(); }, []);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return setMsg('Pilih kategori dulu');
    setSaving(true);
    try {
      await api.post('/transactions', {
        ...form,
        date: new Date().toISOString().split('T')[0]
      });
      setMsg('Transaksi berhasil disimpan!');
      setForm({ description: '', amount: '', type: 'expense', category: '', date: now.toISOString().split('T')[0] });
      fetchSummary();
      fetchChart();
    } catch (e) {
      setMsg('Gagal menyimpan transaksi');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const maxVal = Math.max(...chartData.map(d => Math.max(d.Pemasukan, d.Pengeluaran)), 0);
  const yMax = Math.ceil((maxVal + 2000000) / 1000000) * 1000000;

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>Dashboard Finansialmu</h1>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Hi, {user?.full_name?.split(' ')[0]} </p>
        </div>
      </div>

      {/* Summary + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

      {/* Summary Card */}
      <div style={{
        background: 'linear-gradient(180deg, #54B5FF 0%, #3798E3 100%)',
        borderRadius: '16px', padding: '28px 24px', color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
            <MdArrowBackIos size={20}/>
          </button>
          <span style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '0.01em' }}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
            <MdArrowForwardIos size={20}/>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '16px', opacity: 0.85, margin: '0 0 6px' }}>Sisa Uang</p>
          <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{formatRp(summary.balance)}</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: '1.5px solid rgba(255,255,255,0.35)',
          paddingTop: '16px', gap: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', opacity: 0.85, margin: '0 0 4px' }}>Pemasukan</p>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{formatRp(summary.total_income)}</p>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1.5px solid rgba(255,255,255,0.35)' }}>
            <p style={{ fontSize: '16px', opacity: 0.85, margin: '0 0 4px' }}>Pengeluaran</p>
            <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{formatRp(summary.total_expense)}</p>
          </div>
        </div>
      </div>

      {/* Form Catatan */}
      <div style={{
        background: 'linear-gradient(180deg, #54B5FF 0%, #3798E3 100%)',
        borderRadius: '16px', padding: '24px'
      }}>
        <h3 style={{ color: 'white', fontWeight: '700', fontSize: '18px', margin: '0 0 16px' }}>
          Catatan Keuangan
        </h3>

        {msg && (
          <div style={{
            background: 'rgba(255,255,255,0.25)', color: 'white',
            padding: '8px 12px', borderRadius: '8px',
            fontSize: '13px', marginBottom: '10px'
          }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Keterangan"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            required
            style={{
              padding: '12px 16px', borderRadius: '10px',
              border: 'none', fontSize: '14px', outline: 'none',
              width: '100%', boxSizing: 'border-box',
              background: 'white'
            }}
          />

      {/* Nominal + Toggle Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input
          type="number"
          placeholder="Nominal"
          value={form.amount}
          onChange={e => setForm({...form, amount: e.target.value})}
          required
          style={{
            padding: '12px 16px', borderRadius: '10px',
            border: 'none', fontSize: '14px', outline: 'none',
            background: 'white', width: '100%', boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button type="button"
            onClick={() => setForm({...form, type: 'income', category: ''})}
            style={{
              padding: '12px 6px', borderRadius: '10px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: 'none',
              background: form.type === 'income' ? 'white' : 'rgba(255,255,255,0.25)',
              color: form.type === 'income' ? '#336D99' : 'white',
              transition: 'all .15s'
            }}>
            Pemasukan
          </button>
          <button type="button"
            onClick={() => setForm({...form, type: 'expense', category: ''})}
            style={{
              padding: '12px 6px', borderRadius: '10px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: 'none',
              background: form.type === 'expense' ? 'white' : 'rgba(255,255,255,0.25)',
              color: form.type === 'expense' ? '#336D99' : 'white',
              transition: 'all .15s'
            }}>
            Pengeluaran
          </button>
        </div>
      </div>

      <select
        value={form.category}
        onChange={e => setForm({...form, category: e.target.value})}
        style={{
          padding: '12px 16px', borderRadius: '10px',
          border: 'none', fontSize: '14px', outline: 'none',
          width: '100%', boxSizing: 'border-box',
          color: form.category ? '#101828' : '#000000',
          background: 'rgba(255, 255, 255, 0.5)'
        }}>
        <option value="">-- Pilih Kategori --</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <button type="submit" disabled={saving} style={{
        padding: '13px', borderRadius: '10px', border: 'none',
        background: 'white', color: '#336D99', fontWeight: '700',
        fontSize: '15px', cursor: 'pointer', transition: 'all .15s'
      }}>
        {saving ? 'Menyimpan...' : 'Simpan'}
      </button>
        </form>
      </div>
      </div>

      {/* Grafik */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '0.5px solid #e4e7ec' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#101828', margin: 0 }}>Grafik Keuangan</h3>
            <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>6 bulan terakhir</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#667085' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '20px', height: '3px', background: '#1976d2', display: 'inline-block', borderRadius: '2px' }}></span>
              Pemasukan
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '20px', height: '3px', background: '#D85A30', display: 'inline-block', borderRadius: '2px' }}></span>
              Pengeluaran
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085', fontSize: '14px' }}>
            Belum ada data transaksi. Mulai catat keuanganmu!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#888' }}
                domain={[0, yMax]}
                tickFormatter={(v) => `Rp ${(v/1000000).toFixed(1)}jt`}
              />
              <Tooltip formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`} />
              <Line type="monotone" dataKey="Pemasukan" stroke="#1976d2" strokeWidth={2.5} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="Pengeluaran" stroke="#D85A30" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </MainLayout>
  );
}