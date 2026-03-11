import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'swap_horiz', label: 'Transaksi', path: '/transaksi' },
    { icon: 'account_balance', label: 'Anggaran', path: '/anggaran' },
    { icon: 'event_repeat', label: 'Recurring', path: '/recurring' },
    { icon: 'bar_chart', label: 'Laporan', path: '/laporan' },
    { icon: 'account_balance', label: 'Kelola Bank', path: '/kelola-bank' },
  ]

  return (
    <aside className="w-72 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 shrink-0">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">{user?.name || 'User'}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Premium User</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={
              location.pathname === item.path
                ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-medium'
                : 'flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors'
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* CTA Button */}
      <div className="mt-auto space-y-3 relative">
        <button 
          onClick={() => navigate('/transaksi')}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Tambah Transaksi</span>
        </button>
        <button 
          onClick={async () => {
            const err = await logout();
            if(!err?.error) navigate('/login');
          }}
          className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  )
}
