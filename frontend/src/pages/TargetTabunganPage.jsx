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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(form.deadline);
    if (!form.deadline || deadlineDate <= today) return setMsg('Deadline harus di masa depan');
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
    if (!confirm('Hapus target ini? Riwayat tabungan yang sudah tercatat tidak akan ikut terhapus.')) return;
    try {
      await api.delete(`/savings/${id}`);
      fetchGoals();
    } catch (e) { console.error(e); }
  };

  const getProgress = (current, target) => Math.min((Number(current) / Number(target)) * 100, 100).toFixed(1);

  const getDaysLeft = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Sudah lewat';
    if (days === 0) return 'Hari ini!';
    return `${days} hari lagi`;
  };

  const getSavingRecommendation = (target, current, deadline) => {
    const remaining = Number(target) - Number(current);
    if (remaining <= 0) return { amount: 0, per: 'bulan' };
    const diffDays = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { amount: 0, per: 'bulan' };
    if (diffDays <= 30) {
      return { amount: Math.ceil(remaining / Math.max(1, Math.round(diffDays / 7))), per: 'minggu' };
    }
    const now = new Date();
    const deadlineDate = new Date(deadline);
    let months = 0;
    const cursor = new Date(now.getFullYear(), now.getMonth(), 1);
    const deadlineMonth = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), 1);
    while (cursor < deadlineMonth) { months++; cursor.setMonth(cursor.getMonth() + 1); }
    return { amount: Math.ceil(remaining / Math.max(1, months)), per: 'bulan' };
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white' };
  const labelStyle = { fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' };

  return (
    <MainLayout>
      <style>{`
        .target-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .target-goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .target-progress-btns { display: flex; gap: 8px; }
        @media (max-width: 640px) {
          .target-form-grid { grid-template-columns: 1fr; }
          .target-goals-grid { grid-template-columns: 1fr; }
          .target-progress-btns { flex-direction: column; }
          .target-progress-btns button { width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>Target Tabungan</h1>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Terapkan tujuan dan lacak progresmu</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #54B5FF, #336D99)',
          color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
        }}>+ Tambah Target</button>
      </div>

      {/* Form Tambah Target */}
      {showForm && (
        <div style={{ background: 'linear-gradient(180deg, #54B5FF 0%, #3798E3 100%)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: '16px', margin: '0 0 16px' }}>Buat Target Baru</h3>
          {msg && (
            <div style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '10px' }}>
              {msg}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="target-form-grid" style={{ marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Nama Target</label>
                <input placeholder="Misal: Beli laptop" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nominal Target</label>
                <input type="number" placeholder="Rp" value={form.target_amount} onChange={e => setForm({...form, target_amount: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required style={inputStyle} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px 20px', borderRadius: '10px',
              background: 'white', color: '#336D99', border: 'none',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer'
            }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </div>
      )}

      {/* List Target */}
      {goals.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '0.5px solid #e4e7ec' }}>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#101828', margin: '0 0 8px' }}>Belum ada target tabungan</p>
          <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Klik "Tambah Target" untuk mulai menabung</p>
        </div>
      ) : (
        <div className="target-goals-grid">
          {goals.map(goal => {
            const pct = getProgress(goal.current_amount, goal.target_amount);
            const isComplete = pct >= 100;
            return (
              <div key={goal.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '0.5px solid #e4e7ec', borderTop: `4px solid ${isComplete ? '#12b76a' : '#54B5FF'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#101828', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{goal.title}</h3>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: '500', background: isComplete ? '#e1f5ee' : '#e3f2fd', color: isComplete ? '#085041' : '#0c447c' }}>
                      {isComplete ? '✅ Tercapai!' : `⏳ ${getDaysLeft(goal.deadline)}`}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(goal.id)} style={{ background: '#f04438', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: '5px 12px', borderRadius: '8px', flexShrink: 0 }}>Hapus</button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#667085' }}>Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}>{pct}%</span>
                  </div>
                  <div style={{ background: '#f2f4f7', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '99px', background: isComplete ? '#12b76a' : 'linear-gradient(90deg, #54B5FF, #336D99)', width: `${pct}%`, transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>

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

                {!isComplete && (
                  <div style={{ background: '#e3f2fd', borderRadius: '10px', padding: '10px 12px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', color: '#0c447c', margin: 0 }}>
                      {(() => {
                        const rec = getSavingRecommendation(goal.target_amount, goal.current_amount, goal.deadline);
                        return <>💡 Nabung <strong>{formatRp(rec.amount)}</strong>/{rec.per} untuk capai target</>;
                      })()}
                    </p>
                  </div>
                )}

                {!isComplete && (
                  showAddProgress === goal.id ? (
                    <div>
                      <input type="number" placeholder="Nominal tabungan" value={progressAmount} onChange={e => setProgressAmount(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #d0d5dd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
                      <div className="target-progress-btns">
                        <button onClick={() => handleAddProgress(goal.id)} style={{ flex: 1, padding: '9px 14px', borderRadius: '10px', background: 'linear-gradient(135deg, #54B5FF, #336D99)', color: 'white', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Simpan</button>
                        <button onClick={() => setShowAddProgress(null)} style={{ flex: 1, padding: '9px 14px', borderRadius: '10px', background: '#f2f4f7', color: '#667085', border: 'none', fontSize: '13px', cursor: 'pointer' }}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddProgress(goal.id)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #54B5FF, #336D99)', color: 'white', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
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