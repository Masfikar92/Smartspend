import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RiwayatPage from './pages/RiwayatPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LandingPage from './pages/LandingPage';
import TargetTabunganPage from './pages/TargetTabunganPage';
import PengaturanPage from './pages/PengaturanPage';

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="/riwayat" element={user ? <RiwayatPage /> : <Navigate to="/login" />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/target" element={user ? <TargetTabunganPage /> : <Navigate to="/login" />} />
      <Route path="/pengaturan" element={user ? <PengaturanPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;