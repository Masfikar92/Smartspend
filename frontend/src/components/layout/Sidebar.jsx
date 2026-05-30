import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoFull from '../../assets/Logo-SmartSpend-Full-Putih.svg';
import {
  MdDashboard, MdRecommend,
  MdSavings, MdHistory, MdSettings, MdLogout, MdClose
} from 'react-icons/md';

const menus = [
  { to: '/dashboard',   icon: <MdDashboard size={20}/>, label: 'Dashboard' },
  { to: '/rekomendasi', icon: <MdRecommend size={20}/>, label: 'Rekomendasi' },
  { to: '/target',      icon: <MdSavings size={20}/>,   label: 'Target Tabungan' },
  { to: '/riwayat',     icon: <MdHistory size={20}/>,   label: 'Riwayat' },
  { to: '/pengaturan',  icon: <MdSettings size={20}/>,  label: 'Pengaturan' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .sidebar {
          width: 220px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #54B5FF 0%, #336D99 100%);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 50;
          transition: transform 0.25s ease;
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 240px;
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .sidebar-close-btn { display: flex !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .sidebar { width: 180px; }
          .sidebar-close-btn { display: none !important; }
        }
        @media (min-width: 1025px) {
          .sidebar { width: 220px; transform: translateX(0) !important; }
          .sidebar-close-btn { display: none !important; }
        }
        .nav-link-label {
          display: inline;
        }
        @media (min-width: 769px) and (max-width: 900px) {
          .nav-link-label { display: none; }
        }
      `}</style>

      <aside className="sidebar">
        {/* Tombol close di mobile */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          style={{
            display: 'none',
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.2)', border: 'none',
            borderRadius: '8px', padding: '6px', cursor: 'pointer',
            color: 'white', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <MdClose size={20} />
        </button>

        <img
          src={LogoFull}
          alt="SmartSpend"
          style={{ height: '36px', marginBottom: '32px', objectFit: 'contain', objectPosition: 'left' }}
        />

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', letterSpacing: '0.05em' }}>
          Menu
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {menus.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px',
                color: isActive ? '#1976d2' : 'rgba(255,255,255,0.85)',
                background: isActive ? 'white' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px', textDecoration: 'none',
                transition: 'all .15s',
              })}
            >
              {m.icon}
              <span className="nav-link-label">{m.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '9px',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: '10px', background: 'transparent', color: 'white',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <MdLogout size={16}/> <span className="nav-link-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}