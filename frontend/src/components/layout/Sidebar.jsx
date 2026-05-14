import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoFull from '../../assets/Logo-SmartSpend-Full-Putih.svg';
import {
  MdDashboard, MdSmartToy, MdRecommend,
  MdSavings, MdHistory, MdSettings, MdLogout
} from 'react-icons/md';

const menus = [
  { to: '/dashboard', icon: <MdDashboard size={20}/>, label: 'Dashboard' },
  { to: '/smartbot', icon: <MdSmartToy size={20}/>, label: 'SmartBot AI' },
  { to: '/rekomendasi', icon: <MdRecommend size={20}/>, label: 'Rekomendasi' },
  { to: '/target', icon: <MdSavings size={20}/>, label: 'Target Tabungan' },
  { to: '/riwayat', icon: <MdHistory size={20}/>, label: 'Riwayat' },
  { to: '/pengaturan', icon: <MdSettings size={20}/>, label: 'Pengaturan' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: 'linear-gradient(180deg, #54B5FF 0%, #336D99 100%)',
      display: 'flex', flexDirection: 'column', padding: '24px 16px',
      position: 'fixed', top: 0, left: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      <img src={LogoFull} alt="SmartSpend" style={{ height: '36px', marginBottom: '32px', objectFit: 'contain', objectPosition: 'left' }} />

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', letterSpacing: '0.05em' }}>Menu</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {menus.map((m) => (
          <NavLink key={m.to} to={m.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px',
              color: isActive ? '#1976d2' : 'rgba(255,255,255,0.85)',
              background: isActive ? 'white' : 'transparent',
              fontWeight: isActive ? '600' : '400',
              fontSize: '14px', textDecoration: 'none',
              transition: 'all .15s',
            })}>
            {m.icon}
            {m.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        
        <button onClick={handleLogout} style={{
          width: '100%', padding: '9px', border: '1.5px solid rgba(255,255,255,0.4)',
          borderRadius: '10px', background: 'transparent', color: 'white',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <MdLogout size={16}/> Logout
        </button>
      </div>
    </aside>
  );
}