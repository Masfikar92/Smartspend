import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import api from '../services/api';

const formatRp = (val) => 'Rp ' + Number(val).toLocaleString('id-ID');

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: '1.5px solid #d0d5dd', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '11px', fontWeight: '500',
          color: '#667085', userSelect: 'none'
        }}
      >?</div>
      {show && (
        <div style={{
          position: 'absolute', left: '24px', top: '-6px',
          width: '220px', background: 'white',
          border: '0.5px solid #d0d5dd', borderRadius: '8px',
          padding: '10px 12px', fontSize: '12px', color: '#667085',
          lineHeight: 1.6, zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {text}
        </div>
      )}
    </div>
  );
}

const PROVINSI_LIST = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Jambi',
  'Sumatera Selatan','Bengkulu','Lampung','Kepulauan Bangka Belitung',
  'Kepulauan Riau','DKI Jakarta','Jawa Barat','Jawa Tengah',
  'DI Yogyakarta','Jawa Timur','Banten','Bali',
  'Nusa Tenggara Barat','Nusa Tenggara Timur','Kalimantan Barat',
  'Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur',
  'Kalimantan Utara','Sulawesi Utara','Sulawesi Tengah',
  'Sulawesi Selatan','Sulawesi Tenggara','Gorontalo',
  'Sulawesi Barat','Maluku','Maluku Utara','Papua Barat','Papua',
];

const PEKERJAAN_LIST = [
  'Karyawan Swasta','PNS/ASN','Wiraswasta',
  'Buruh/Pekerja Harian','Pelajar/Mahasiswa','Tidak Bekerja',
];

const PENDIDIKAN_LIST = ['SD','SMP','SMA','D3','S1','S2','S3'];
const PERNIKAHAN_LIST = ['Belum Menikah','Menikah','Cerai'];

//Komponen form onboarding
function OnboardingForm({ onSaved }) {
  const [form, setForm] = useState({
    provinsi: 'DKI Jakarta',
    klasifikasi_wilayah: 'Perkotaan',
    jenis_kelamin: 'Laki-laki',
    usia: '',
    pendidikan_terakhir: 'SMA',
    status_pekerjaan: 'Karyawan Swasta',
    status_pernikahan: 'Belum Menikah',
    jumlah_tanggungan: 0,
    skor_literasi_keuangan: 50,
    cicilan_hutang: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.usia) return setError('Usia wajib diisi');
    setSaving(true);
    setError('');
    try {
      await api.post('/profile', {
        ...form,
        usia: Number(form.usia),
        jumlah_tanggungan: Number(form.jumlah_tanggungan),
        cicilan_hutang: Number(form.cicilan_hutang) || 0,
      });
      onSaved();
    } catch (e) {
      setError('Gagal menyimpan profil. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #d0d5dd', fontSize: '14px', color: '#101828',
    background: 'white', boxSizing: 'border-box', outline: 'none',
  };
  const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#344054', marginBottom: '6px', display: 'block' };
  const groupStyle = { display: 'flex', flexDirection: 'column' };

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px', borderBottom: '0.5px solid #e4e7ec', background: 'linear-gradient(135deg, #f0f7ff, #e8f4fd)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #54B5FF, #336D99)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
          }}></div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#101828', margin: 0 }}>
              Lengkapi Profil Keuangan
            </p>
            <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>
              Diisi sekali untuk hasil analisis yang lebih akurat
            </p>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div style={{ padding: '28px' }}>
        <div className='onboarding-grid'>

          {/* Provinsi */}
          <div style={groupStyle}>
            <label style={labelStyle}>Provinsi</label>
            <select style={inputStyle} value={form.provinsi} onChange={e => set('provinsi', e.target.value)}>
              {PROVINSI_LIST.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Wilayah */}
          <div style={groupStyle}>
            <label style={labelStyle}>Klasifikasi Wilayah</label>
            <select style={inputStyle} value={form.klasifikasi_wilayah} onChange={e => set('klasifikasi_wilayah', e.target.value)}>
              <option>Perkotaan</option>
              <option>Perdesaan</option>
            </select>
          </div>

          {/* Jenis kelamin */}
          <div style={groupStyle}>
            <label style={labelStyle}>Jenis Kelamin</label>
            <select style={inputStyle} value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)}>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
          </div>

          {/* Usia */}
          <div style={groupStyle}>
            <label style={labelStyle}>Usia (tahun)</label>
            <input style={inputStyle} type="number" min="10" max="99" placeholder="25"
              value={form.usia} onChange={e => set('usia', e.target.value)} />
          </div>

          {/* Pendidikan */}
          <div style={groupStyle}>
            <label style={labelStyle}>Pendidikan Terakhir</label>
            <select style={inputStyle} value={form.pendidikan_terakhir} onChange={e => set('pendidikan_terakhir', e.target.value)}>
              {PENDIDIKAN_LIST.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Pekerjaan */}
          <div style={groupStyle}>
            <label style={labelStyle}>Status Pekerjaan</label>
            <select style={inputStyle} value={form.status_pekerjaan} onChange={e => set('status_pekerjaan', e.target.value)}>
              {PEKERJAAN_LIST.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Status pernikahan */}
          <div style={groupStyle}>
            <label style={labelStyle}>Status Pernikahan</label>
            <select style={inputStyle} value={form.status_pernikahan} onChange={e => set('status_pernikahan', e.target.value)}>
              {PERNIKAHAN_LIST.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Tanggungan */}
          <div style={groupStyle}>
            <label style={labelStyle}>Jumlah Tanggungan</label>
            <input style={inputStyle} type="number" min="0" max="20" placeholder="0"
              value={form.jumlah_tanggungan} onChange={e => set('jumlah_tanggungan', e.target.value)} />
          </div>

          {/* Cicilan */}
          <div style={groupStyle}>
            <label style={labelStyle}>Cicilan/Hutang per Bulan (Rp)</label>
            <input style={inputStyle} type="number" min="0" placeholder="0"
              value={form.cicilan_hutang} onChange={e => set('cicilan_hutang', e.target.value)} />
          </div>

          {/* Literasi */}
          <div style={groupStyle}>
            <label style={labelStyle}>Skor Literasi Keuangan (0–100)</label>
            <input style={inputStyle} type="number" min="0" max="100" placeholder="50"
              value={form.skor_literasi_keuangan} onChange={e => set('skor_literasi_keuangan', e.target.value)} />
            <p style={{ fontSize: '11px', color: '#667085', margin: '4px 0 0' }}>
              Estimasi pemahaman keuanganmu. 0 = tidak tahu sama sekali, 100 = sangat paham.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#faece7', border: '1px solid #f04438', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#712b13', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={saving} style={{
          width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
          background: saving ? '#b2d4f5' : 'linear-gradient(135deg, #54B5FF, #336D99)',
          color: 'white', fontWeight: '600', fontSize: '14px',
          cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Menyimpan...' : 'Simpan & Lihat Analisis →'}
        </button>
      </div>
    </div>
  );
}

//Komponen badge kondisi
function KondisiBadge({ kondisi }) {
  const map = {
    'Keuangan Sehat'  : { bg: '#e1f5ee', text: '#085041', border: '#12b76a', emoji: '💚' },
    'Cukup Baik'      : { bg: '#e3f2fd', text: '#0c447c', border: '#54B5FF', emoji: '💛' },
    'Perlu Perbaikan' : { bg: '#faece7', text: '#712b13', border: '#f04438', emoji: '🔴' },
  };
  const c = map[kondisi] || map['Perlu Perbaikan'];
  return (
    <div style={{
      background: c.bg, border: `1.5px solid ${c.border}`,
      borderRadius: '99px', padding: '4px 14px', display: 'inline-flex',
      alignItems: 'center', gap: '6px',
    }}>
      <span>{c.emoji}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: c.text }}>{kondisi}</span>
    </div>
  );
}

// ─── SmartSpend AI Renderer ─────────────────────────────────────────────────
// Mengubah output teks Gemini menjadi JSX yang rapi tanpa simbol markdown
function renderSaranAI(text) {
  if (!text) return null;
  const HEADING_EMOJIS = ['📊','💸','🐷','📋','🎯','⚠️','✨','⚡','💪','🔍','📈','💡'];
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '') {
      elements.push(<div key={key++} style={{ height: '8px' }} />);
      continue;
    }

    const isHeading = HEADING_EMOJIS.some(e => trimmed.startsWith(e));
    if (isHeading) {
      elements.push(
        <div key={key++} style={{
          fontSize: '14px', fontWeight: '700', color: '#101828',
          lineHeight: 1.5, paddingBottom: '6px',
          borderBottom: '1px solid #f0f0f0',
          marginTop: i === 0 ? '0' : '12px', marginBottom: '8px',
        }}>
          {trimmed}
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const content = trimmed.replace(/^[-•]\s+/, '');
      elements.push(
        <div key={key++} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', paddingLeft: '4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#54B5FF', flexShrink: 0, marginTop: '8px' }} />
          <span style={{ fontSize: '14px', color: '#344054', lineHeight: 1.7, flex: 1 }}>{content}</span>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={key++} style={{ fontSize: '14px', color: '#344054', lineHeight: 1.75, margin: '0 0 6px 0' }}>
        {trimmed}
      </p>
    );
  }
  return elements;
}

//Main page
export default function RekomendasiPage() {
  const [profileExists, setProfileExists] = useState(null); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfileExists(res.data.exists);
        if (res.data.exists) fetchRecommendation();
      } catch {
        setProfileExists(false);
      }
    };
    checkProfile();
  }, []);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/recommendation');
      setData(res.data);
    } catch {
      setError('Gagal mengambil analisis. Pastikan data transaksi bulan ini sudah ada.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSaved = () => {
    setProfileExists(true);
    fetchRecommendation();
  };

  return (
    <MainLayout>
      <style>{`
        .onboarding-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 640px) {
          .onboarding-grid { grid-template-columns: 1fr; }
          .summary-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>
          Analisis Keuangan
        </h1>
        <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>
          Prediksi kondisi & rekomendasi berbasis AI dan Data Science
        </p>
      </div>

      {/* Belum cek profil */}
      {profileExists === null && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '0.5px solid #e4e7ec' }}>
          <p style={{ fontSize: '14px', color: '#667085' }}>Memuat...</p>
        </div>
      )}

      {/* Profil belum ada → tampilkan form onboarding */}
      {profileExists === false && (
        <OnboardingForm onSaved={handleProfileSaved} />
      )}

      {/* Profil ada → tampilkan hasil analisis */}
      {profileExists === true && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {loading && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '0.5px solid #e4e7ec' }}>
              <p style={{ fontSize: '14px', color: '#667085' }}>Menganalisis data keuanganmu...</p>
            </div>
          )}

          {error && (
            <div style={{ background: '#faece7', borderRadius: '12px', padding: '16px 20px', border: '1px solid #f04438', fontSize: '14px', color: '#712b13' }}>
              ⚠️ {error}
            </div>
          )}

          {data && !loading && (
            <>
              {/* ── Ringkasan keuangan ── */}
              <div className='summary-grid'>
                {[
                  { label: 'Pemasukan',      value: formatRp(data.summary.income),  color: '#085041', bg: '#e1f5ee' },
                  { label: 'Pengeluaran',    value: formatRp(data.summary.expense), color: '#712b13', bg: '#faece7' },
                  { label: 'Tabungan',       value: formatRp(data.summary.saving),  color: '#0c447c', bg: '#e3f2fd' },
                  { label: 'Rasio Tabungan', value: `${data.summary.rasio}%`,       color: '#633806', bg: '#faeeda' },
                ].map((item, i) => (
                  <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: item.color, opacity: 0.8, margin: '0 0 4px' }}>{item.label}</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: item.color, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '12px', color: '#667085', textAlign: 'right', margin: '-4px 0 0' }}>
                * Semua angka mencerminkan arus keuangan bulan ini · bukan total saldo
              </p>

              {/*SECTION 1: PREDIKSI (AI model)*/}
              <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{ padding: '18px 24px', borderBottom: '0.5px solid #e4e7ec', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #f0f7ff, #e8f4fd)' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                  }}></div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#101828', margin: 0 }}>Prediksi Kondisi Keuangan</p>
                    <p style={{ fontSize: '12px', color: '#667085', margin: 0 }}>Powered by AI · Deep Learning Model</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Kondisi utama */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <KondisiBadge kondisi={data.kondisi.kondisi_keuangan} />
                      <p style={{ fontSize: '13px', color: '#667085', margin: '8px 0 0' }}>
                        {data.kondisi.pesan}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#667085', margin: '0 0 2px' }}>Confidence</p>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#101828', margin: 0 }}>
                        {(data.kondisi.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Tabungan ideal */}
                  <div style={{ background: '#f0f7ff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#336D99', margin: '0 0 2px' }}>Tabungan Ideal per Bulan</p>
                      {(() => {
                        const prediksi = data.kondisi.rekomendasi_tabungan;
                        const income = data.summary.income;
                        const batasMin = income * 0.10;
                        const batasMaks = income * 0.40;
                        const valid = prediksi >= batasMin && prediksi <= batasMaks;
                        return (
                          <>
                            <p style={{ fontSize: '22px', fontWeight: '700', color: '#0c447c', margin: 0 }}>
                              {formatRp(valid ? prediksi : Math.round(income * 0.2))}
                            </p>
                            <p style={{ fontSize: '11px', color: '#667085', margin: '4px 0 0' }}>
                              {valid ? 'Berdasarkan prediksi AI · disesuaikan profil kamu' : '20% dari pendapatan · aturan 50/30/20'}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                    <span style={{ fontSize: '32px' }}>🎯</span>
                  </div>

                  {/* Probabilitas per kelas */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#344054', margin: 0 }}>
                      Distribusi Probabilitas
                    </p>
                    <Tooltip text="Seberapa yakin model terhadap setiap kemungkinan kondisi. Totalnya selalu 100%. Makin tinggi angkanya, makin yakin model terhadap kondisi tersebut." />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(data.kondisi.probabilities).map(([label, prob]) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#667085' }}>{label}</span>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#101828' }}>{(prob * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ background: '#f2f4f7', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: '99px',
                            background: 'linear-gradient(90deg, #54B5FF, #336D99)',
                            width: `${prob * 100}%`, transition: 'width 0.6s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/*SECTION 2: REKOMENDASI (DS model)*/}
              <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
                {/* Section header */}
                <div style={{ padding: '18px 24px', borderBottom: '0.5px solid #e4e7ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #f0fff8, #e1f5ee)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #12b76a, #085041)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                    }}></div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: '#101828', margin: 0 }}>Rekomendasi Budgeting</p>
                      <p style={{ fontSize: '12px', color: '#667085', margin: 0 }}>Powered by Data Science · KMeans Clustering</p>
                    </div>
                  </div>
                  {/* Cluster badge */}
                  <div style={{ background: '#e1f5ee', border: '1px solid #12b76a', borderRadius: '99px', padding: '4px 12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#085041' }}>
                      {data.cluster.nama_cluster}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.cluster.rekomendasi.map((r, i) => {
                      const isKritis = r.includes('KRITIS') || r.includes('TERLALU TINGGI') || r.includes('SANGAT TINGGI');
                      const isWarning = r.includes('PERLU') || r.includes('KURANGI') || r.includes('DIPANTAU');
                      const isOk = r.includes('SUDAH') || r.includes('TERKENDALI') || r.includes('TINGGI —');
                      const accent = isKritis ? '#f04438' : isWarning ? '#f79009' : isOk ? '#12b76a' : '#54B5FF';
                      const accentBg = isKritis ? '#faece7' : isWarning ? '#fef6e7' : isOk ? '#e1f5ee' : '#f0f7ff';

                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'flex-start', gap: '12px',
                          padding: '14px 16px', borderRadius: '12px',
                          background: accentBg, border: `1px solid ${accent}30`
                        }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: accent, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'white',
                            fontSize: '11px', fontWeight: '700', flexShrink: 0
                          }}>{i + 1}</div>
                          <p style={{ fontSize: '13.5px', color: '#344054', margin: 0, lineHeight: 1.65 }}>{r}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/*SECTION 3: Panduan 50/30/20*/}
              <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '0.5px solid #e4e7ec', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f79009, #b54708)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                  }}></div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#101828', margin: 0 }}>Panduan Budgeting 50/30/20</p>
                    <p style={{ fontSize: '12px', color: '#667085', margin: 0 }}>Berdasarkan pendapatanmu bulan ini</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  {Number(data.summary.income) === 0 ? (
                    <p style={{ fontSize: '14px', color: '#667085', textAlign: 'center' }}>Belum ada data pemasukan bulan ini.</p>
                  ) : (() => {
                    const income = Number(data.summary.income);
                    const expense = Number(data.summary.expense);
                    const b = data.budget_5030_20;
                    const items = [
                      { label: 'Kebutuhan Pokok', desc: 'Makan, tempat tinggal, transport, tagihan', persen: '50%', ideal: b.kebutuhan.ideal, aktual: b.kebutuhan.aktual, color: '#1976d2', bg: '#e3f2fd' },
                      { label: 'Keinginan',       desc: 'Hiburan, jajan, belanja, gaya hidup',      persen: '30%', ideal: b.keinginan.ideal, aktual: b.keinginan.aktual, color: '#7b1fa2', bg: '#f3e5f5' },
                      { label: 'Tabungan & Investasi', desc: 'Dana darurat, investasi, target tabungan', persen: '20%', ideal: b.tabungan.ideal,   aktual: b.tabungan.aktual,   color: '#2e7d32', bg: '#e8f5e9' },
                    ];
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: '#f5f7fa', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', color: '#667085' }}>Pendapatanmu bulan ini</span>
                          <span style={{ fontSize: '15px', fontWeight: '700', color: '#101828' }}>{formatRp(income)}</span>
                        </div>
                        {items.map((item, i) => {
                          const pct = item.ideal > 0 ? Math.min((item.aktual / item.ideal) * 100, 100) : 0;
                          const melebihi = item.label !== 'Tabungan & Investasi' && item.aktual > item.ideal;
                          const tabunganCukup = item.label === 'Tabungan & Investasi' && item.aktual >= item.ideal;
                          return (
                            <div key={i} style={{ background: item.bg, borderRadius: '12px', padding: '16px 20px', border: `1px solid ${item.color}20` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: item.color, color: 'white' }}>{item.persen}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#101828' }}>{item.label}</span>
                                  </div>
                                  <p style={{ fontSize: '12px', color: '#667085', margin: 0 }}>{item.desc}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                                  <p style={{ fontSize: '16px', fontWeight: '700', color: melebihi ? '#f04438' : item.color, margin: '0 0 2px' }}>
                                    {formatRp(item.aktual)}
                                  </p>
                                  <p style={{ fontSize: '11px', color: '#667085', margin: 0 }}>
                                    dari ideal <strong style={{ color: item.color }}>{formatRp(item.ideal)}</strong>
                                  </p>
                                </div>
                              </div>
                              <div style={{ background: 'rgba(0,0,0,0.08)', borderRadius: '99px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
                                <div style={{ height: '100%', borderRadius: '99px', background: melebihi ? '#f04438' : tabunganCukup ? '#12b76a' : item.color, width: `${pct}%`, transition: 'width 0.5s ease' }} />
                              </div>
                              <p style={{ fontSize: '11px', margin: 0, textAlign: 'right',
                                color: melebihi ? '#f04438' : tabunganCukup ? '#12b76a' : '#667085'
                              }}>
                                {melebihi
                                  ? '⚠️ Melebihi batas ideal'
                                  : tabunganCukup
                                  ? '✓ Target tabungan tercapai'
                                  : item.label === 'Tabungan & Investasi'
                                  ? '⚠️ Belum mencapai target tabungan'
                                  : '✓ Dalam batas aman'}
                              </p>
                            </div>
                          );
                        })}
                        <div style={{ background: '#f5f7fa', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#667085', lineHeight: 1.6 }}>
                          💡 <strong>Aturan 50/30/20</strong> adalah panduan umum. Sesuaikan dengan kondisi dan prioritas keuanganmu.
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* SECTION 4: SmartSpend AI (Generative AI) */}
              <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '0.5px solid #e4e7ec', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #fff8f0, #fef6e7)' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                  }}></div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#101828', margin: 0 }}>SmartSpend AI</p>
                    <p style={{ fontSize: '12px', color: '#667085', margin: 0 }}>Powered by Generative AI · Saran personal berbasis data keuanganmu</p>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  {data.saran_ai ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {renderSaranAI(data.saran_ai)}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f9fafb', borderRadius: '12px' }}>
                      <p style={{ fontSize: '32px', margin: '0 0 8px' }}>✨</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#344054', margin: '0 0 6px' }}>Analisis AI belum tersedia</p>
                      <p style={{ fontSize: '13px', color: '#667085', margin: 0, lineHeight: 1.6 }}>
                        Gunakan Rekomendasi Budgeting dan Prediksi Kondisi di atas sebagai panduan keuanganmu.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/*Action buttons*/}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={fetchRecommendation} style={{
                  padding: '12px 24px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                  color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                }}>
                  🔄 Analisis Ulang
                </button>
                <button onClick={() => setProfileExists(false)} style={{
                  padding: '12px 24px', borderRadius: '10px',
                  border: '1px solid #d0d5dd', background: 'white',
                  color: '#344054', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                }}>
                  ✏️ Edit Profil
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </MainLayout>
  );
}