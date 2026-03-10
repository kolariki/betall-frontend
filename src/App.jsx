import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import NeonLanding from './pages/NeonLanding';
import Home from './pages/Home';
import MarketDetail from './pages/MarketDetail';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Leaderboard from './pages/Leaderboard';

function AppLayout() {
  return <Layout><Outlet /></Layout>;
}

function HomeOrLanding() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Home /> : <Navigate to="/landing" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Neon landing - full screen, no header/nav */}
      <Route path="/landing" element={<NeonLanding />} />

      {/* All other routes with header/nav Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeOrLanding />} />
        <Route path="/markets" element={<Home />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
