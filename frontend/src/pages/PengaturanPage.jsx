import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function PengaturanPage() {
  const { user, login } = useAuth();
  const [profileForm, setProfileForm] = useState({ full_name: user?.full_name || '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isGoogleUser = !user?.password && user?.google_id;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setLoadingProfile(true);
    try {
      const res = await api.put('/user/profile', profileForm);
      const token = localStorage.getItem('token');
      login(res.data.user, token);
      setProfileMsg('Profil berhasil diupdate!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal update profil');
    } finally {
      setLoadingProfile(false);
      setTimeout(() => setProfileMsg(''), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return setPasswordError('Password baru dan konfirmasi tidak cocok');
    }
    if (passwordForm.new_password.length < 8) {
      return setPasswordError('Password baru minimal 8 karakter');
    }
    setLoadingPassword(true);
    try {
      await api.put('/user/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordMsg('Password berhasil diubah!');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Gagal ubah password');
    } finally {
      setLoadingPassword(false);
      setTimeout(() => setPasswordMsg(''), 3000);
    }
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#101828', margin: 0 }}>Pengaturan</h1>
        <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>Kelola profil dan keamanan akunmu</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>

        {/* Section Profil */}
        <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #54B5FF, #336D99)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>Profil</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Ubah nama lengkapmu</p>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '20px', flexShrink: 0
              }}>
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#101828', margin: 0 }}>{user?.full_name}</p>
                <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>{user?.email}</p>
              </div>
            </div>

            {profileMsg && (
              <div style={{ background: '#e1f5ee', color: '#085041', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
                ✅ {profileMsg}
              </div>
            )}
            {profileError && (
              <div style={{ background: '#faece7', color: '#712b13', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
                ❌ {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#344054', display: 'block', marginBottom: '6px' }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={e => setProfileForm({ full_name: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid #d0d5dd', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
              <button type="submit" disabled={loadingProfile} style={{
                padding: '11px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                color: 'white', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', alignSelf: 'flex-start',
                paddingLeft: '24px', paddingRight: '24px'
              }}>
                {loadingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>

        {/* Section Keamanan */}
        <div style={{ background: 'white', borderRadius: '16px', border: '0.5px solid #e4e7ec', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #54B5FF, #336D99)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>Keamanan</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Ubah password akunmu</p>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Kalau login Google */}
            {user?.google_id ? (
              <div style={{ background: '#e3f2fd', borderRadius: '10px', padding: '14px 16px' }}>
                <p style={{ fontSize: '14px', color: '#0c447c', margin: 0 }}>
                  Kamu login menggunakan Google, tidak perlu mengatur password.
                </p>
              </div>
            ) : (
              <>
                {passwordMsg && (
                  <div style={{ background: '#e1f5ee', color: '#085041', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
                    ✅ {passwordMsg}
                  </div>
                )}
                {passwordError && (
                  <div style={{ background: '#faece7', color: '#712b13', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
                    ❌ {passwordError}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Password Lama', key: 'current_password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                    { label: 'Password Baru', key: 'new_password', show: showNew, toggle: () => setShowNew(!showNew) },
                    { label: 'Konfirmasi Password Baru', key: 'confirm_password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#344054', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={field.show ? 'text' : 'password'}
                          value={passwordForm[field.key]}
                          onChange={e => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                          required
                          placeholder={field.key === 'new_password' ? 'Min. 8 karakter' : ''}
                          style={{
                            width: '100%', padding: '11px 40px 11px 14px',
                            borderRadius: '10px', border: '1.5px solid #d0d5dd',
                            fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <button type="button" onClick={field.toggle} style={{
                          position: 'absolute', right: '12px', top: '50%',
                          transform: 'translateY(-50%)', background: 'none',
                          border: 'none', cursor: 'pointer', color: '#667085', fontSize: '16px'
                        }}>
                          {field.show ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button type="submit" disabled={loadingPassword} style={{
                    padding: '11px', borderRadius: '10px', border: 'none',
                    background: 'linear-gradient(135deg, #54B5FF, #336D99)',
                    color: 'white', fontWeight: '700', fontSize: '14px',
                    cursor: 'pointer', alignSelf: 'flex-start',
                    paddingLeft: '24px', paddingRight: '24px'
                  }}>
                    {loadingPassword ? 'Menyimpan...' : 'Ubah Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}