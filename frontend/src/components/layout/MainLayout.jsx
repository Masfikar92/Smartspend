import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40,
            display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0 }} className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main style={{ padding: '24px', marginTop: '64px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-overlay { display: block !important; }
          .main-content { margin-left: 0 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .main-content { margin-left: 180px; }
        }
        @media (min-width: 1025px) {
          .main-content { margin-left: 220px; }
        }
      `}</style>
    </div>
  );
}