import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const avatar = params.get('avatar');

    if (token) {
      login({
        full_name: decodeURIComponent(name),
        email,
        avatar,
        google_id: params.get('google_id')
      }, token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px'
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid #54B5FF',
        borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <p style={{ color: '#667085', fontSize: '14px' }}>Memproses login Google...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}