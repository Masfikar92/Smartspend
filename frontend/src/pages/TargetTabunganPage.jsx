import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

const formatRp = (val) => 'Rp ' + Number(val).toLocaleString('id-ID');

export default function TargetTabunganPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddProgress, setShowAddProgress] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [form, setForm] = useState({ title: '', target_amount: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchGoals = async () => {
    try {
      const res = await api.get('/savings');
      setGoals(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/savings', form);
      setMsg('Target berhasil dibuat!');
      setForm({ title: '', target_amount: '', deadline: '' });
      setShowForm(false);
      fetchGoals();
    } catch (e) {
      setMsg('Gagal membuat target');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleAddProgress = async (id) => {
    if (!progressAmount) return;
    try {
      await api.put(`/savings/${id}/progress`, { amount: progressAmount });
      setProgressAmount('');
      setShowAddProgress(null);
      fetchGoals();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus target ini?')) return;
    try {
      await api.delete(`/savings/${id}`);
      fetchGoals();
    } catch (e) { console.error(e); }
  };

  const getProgress = (current, target) => {
    const pct = (Number(current) / Number(target)) * 100;
    return Math.min(pct, 100).toFixed(1);
  };

  const getDaysLeft = (deadline) => {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Sudah lewat';
    if (days === 0) return 'Hari ini!';
    return `${days} hari lagi`;
  };

  const getSavingRecommendation = (target, current, deadline) => {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return { amount: 0, per: 'bulan' };
    
    const remaining = Number(target) - Number(current);
    
    if (days <= 30) {
      // Hitung per minggu
      const weeks = Math.ceil(days / 7);
      return { 
        amount: Math.ceil(remaining / weeks), 
        per: 'minggu' 
      };
    } else {
      // Hitung per bulan
      const months = Math.ceil(days / 30);
      return { 
        amount: Math.ceil(remaining / months), 
        per: 'bulan' 
      };
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>Target Tabungan</h1>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Terapkan tujuan dan lacak progresmu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #54B5FF, #336D99)',
          color: 'white', border: 'none', fontWeight: '600',
          fontSize: '14px', cursor: 'pointer'
        }}>
          + Tambah Target
        </button>
      </div>

      {/* Form Tambah Target */}
      {showForm && (
        <div style={{
          background: 'linear-gradient(180deg, #54B5FF 0%, #3798E3 100%)',
          borderRadius: '16px', padding: '24px', marginBottom: '24px'
        }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', margin: '0 0 16px' }}>
            Buat Target Baru
          </h3>
          {msg && (
            <div style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '10px' }}>
              {msg}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>Nama Target</label>
              <input
                placeholder="Misal: Beli laptop"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>Nominal Target</label>
              <input
                type="number"
                placeholder="Rp"
                value={form.target_amount}
                onChange={e => setForm({...form, target_amount: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({...form, deadline: e.target.value})}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white'}}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              padding: '10px 20px', borderRadius: '10px',
              background: 'white', color: '#336D99',
              border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
            }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      )}

      {/* List Target */}
      {goals.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '60px',
          textAlign: 'center', border: '0.5px solid #e4e7ec'
        }}>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#101828', margin: '0 0 8px' }}>Belum ada target tabungan</p>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Klik "Tambah Target" untuk mulai menabung</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {goals.map(goal => {
            const pct = getProgress(goal.current_amount, goal.target_amount);
            const isComplete = pct >= 100;

            return (
              <div key={goal.id} style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                border: '0.5px solid #e4e7ec',
                borderTop: `4px solid ${isComplete ? '#12b76a' : '#54B5FF'}`
              }}>
                {/* Title + Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#101828', margin: '0 0 4px' }}>{goal.title}</h3>
                    <span style={{
                      fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: '500',
                      background: isComplete ? '#e1f5ee' : '#e3f2fd',
                      color: isComplete ? '#085041' : '#0c447c'
                    }}>
                      {isComplete ? '✅ Tercapai!' : `⏳ ${getDaysLeft(goal.deadline)}`}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(goal.id)} style={{
                    background: '#f04438', border: 'none', color: 'white',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                    padding: '5px 12px', borderRadius: '8px'
                  }}>Hapus</button>
                </div>

                {/* Nominal */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#667085' }}>Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}>{pct}%</span>
                  </div>
                  <div style={{ background: '#f2f4f7', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      background: isComplete ? '#12b76a' : 'linear-gradient(90deg, #54B5FF, #336D99)',
                      width: `${pct}%`, transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>

                {/* Detail */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: '#f5f7fa', borderRadius: '10px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#667085', margin: '0 0 2px' }}>Terkumpul</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#101828', margin: 0 }}>{formatRp(goal.current_amount)}</p>
                  </div>
                  <div style={{ background: '#f5f7fa', borderRadius: '10px', padding: '10px 12px' }}>
                    <p style={{ fontSize: '11px', color: '#667085', margin: '0 0 2px' }}>Target</p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#101828', margin: 0 }}>{formatRp(goal.target_amount)}</p>
                  </div>
                </div>

                {/* Rekomendasi nabung per bulan */}
                {!isComplete && (
                  <div style={{
                    background: '#e3f2fd', borderRadius: '10px',
                    padding: '10px 12px', marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#0c447c', margin: 0 }}>
                      {(() => {
                        const rec = getSavingRecommendation(goal.target_amount, goal.current_amount, goal.deadline);
                        return <>💡 Nabung <strong>{formatRp(rec.amount)}</strong>/{rec.per} untuk capai target</>;
                      })()}
                    </p>
                  </div>
                )}

                {/* Tambah Progress */}
                {!isComplete && (
                  showAddProgress === goal.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="Nominal tabungan"
                        value={progressAmount}
                        onChange={e => setProgressAmount(e.target.value)}
                        style={{
                          flex: 1, padding: '9px 12px', borderRadius: '10px',
                          border: '1px solid #d0d5dd', fontSize: '13px', outline: 'none'
                        }}
                      />
                      <button onClick={() => handleAddProgress(goal.id)} style={{
                        padding: '9px 14px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                        color: 'white', border: 'none', fontWeight: '600',
                        fontSize: '13px', cursor: 'pointer'
                      }}>Simpan</button>
                      <button onClick={() => setShowAddProgress(null)} style={{
                        padding: '9px 14px', borderRadius: '10px',
                        background: '#f2f4f7', color: '#667085',
                        border: 'none', fontSize: '13px', cursor: 'pointer'
                      }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddProgress(goal.id)} style={{
                      width: '100%', padding: '10px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                      color: 'white', border: 'none', fontWeight: '600',
                      fontSize: '14px', cursor: 'pointer'
                    }}>
                      + Tambah Tabungan
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}