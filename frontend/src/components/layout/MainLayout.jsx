import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '220px' }}>
        <Topbar />
        <main style={{ padding: '32px', marginTop: '64px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}