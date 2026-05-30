import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <style>{`
        .topbar {
          position: fixed;
          top: 0;
          left: 220px;
          right: 0;
          height: 64px;
          z-index: 100;
          background: white;
          border-bottom: 2px solid #3698E3;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 24px;
          gap: 12px;
        }
        .topbar-hamburger { display: none !important; }

        @media (max-width: 768px) {
          .topbar { left: 0; padding: 0 16px; justify-content: space-between; }
          .topbar-hamburger { display: flex !important; }
          .topbar-username { display: none; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .topbar { left: 180px; }
          .topbar-hamburger { display: none !important; }
        }
      `}</style>

      <div className="topbar">
        {/* Hamburger — hanya mobile */}
        <button
          className="topbar-hamburger"
          onClick={onMenuClick}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px',
            display: 'none', alignItems: 'center',
            color: '#336D99',
          }}
        >
          <MdMenu size={26} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
          <span className="topbar-username" style={{ fontSize: '14px', fontWeight: '500', color: '#344054' }}>
            {user?.full_name}
          </span>
          <div
            onClick={() => navigate('/pengaturan')}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #54B5FF, #336D99)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '14px',
              flexShrink: 0, cursor: 'pointer',
            }}
          >
            {initials}
          </div>
        </div>
      </div>
    </>
  );
}