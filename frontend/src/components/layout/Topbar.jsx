import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const { user } = useAuth();
  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const navigate = useNavigate();
  
  return (
    <div style={{
      position: 'fixed', top: 0, left: '220px',
      right: 0, height: '64px', zIndex: 100,
      background: 'white',
      borderBottom: '2px solid #3698E3',
      display: 'flex', alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 32px', gap: '12px',
    }}>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#344054' }}>
        {user?.full_name}
      </span>
      <div
        onClick={() => navigate('/pengaturan')}
        style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #54B5FF, #336D99)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: '700', fontSize: '14px',
          flexShrink: 0, cursor: 'pointer'
        }}>
        {initials}
      </div>
    </div>
  );
}