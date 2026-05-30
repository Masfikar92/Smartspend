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
          background: linear-gradient(180deg, #54B5FF 0%, #336D99 100%);
          display: flex;
          flex-direction: column;
          padding: 0;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          height: 100dvh;
          min-height: -webkit-fill-available;
          overflow: hidden;
          z-index: 50;
          transition: transform 0.25s ease;
        }
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 24px 16px;
          overflow: hidden;
        }
        .sidebar-nav-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        .sidebar-nav-scroll::-webkit-scrollbar { display: none; }
        .sidebar-logout {
          flex-shrink: 0;
          padding-top: 16px;
          margin-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.15);
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
        .nav-link-label { display: inline; }
        @media (min-width: 769px) and (max-width: 900px) {
          .nav-link-label { display: none; }
        }
      `}</style>

      <aside className="sidebar">
        <div className="sidebar-inner">

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
            style={{ height: '36px', marginBottom: '24px', objectFit: 'contain', objectPosition: 'left', flexShrink: 0 }}
          />

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '8px', letterSpacing: '0.05em', flexShrink: 0 }}>
            Menu
          </p>

          {/* Nav menu */}
          <div className="sidebar-nav-scroll">
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
          </div>

          {/* Logout */}
          <div className="sidebar-logout">
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

        </div>
      </aside>
    </>
  );
}