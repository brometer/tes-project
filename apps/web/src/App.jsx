import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Transaksi from './pages/Transaksi'
import Anggaran from './pages/Anggaran'
import Recurring from './pages/Recurring'
import Laporan from './pages/Laporan'
import KelolaBank from './pages/KelolaBank'

// Dashboard Layout wrapper
function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  )
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/anggaran" element={<Anggaran />} />
            <Route path="/recurring" element={<Recurring />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/kelola-bank" element={<KelolaBank />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
