import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import BankAccountCards from '../components/BankAccountCards'
import TotalBalanceBanner from '../components/TotalBalanceBanner'
import SpendingChart from '../components/SpendingChart'
import BudgetAlerts from '../components/BudgetAlerts'
import BalanceTrend from '../components/BalanceTrend'
import RecentTransactions from '../components/RecentTransactions'

export default function Dashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/dashboard');
        setDashData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const userName = user?.name || 'User';

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {greeting()}, {userName} 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{todayStr}</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 gap-3">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
          <span className="text-lg font-medium">Memuat dashboard...</span>
        </div>
      ) : (
        <>
          {/* Bank Accounts */}
          <BankAccountCards accounts={dashData?.accounts || []} />

          {/* Total Balance */}
          <TotalBalanceBanner totalBalance={dashData?.totalBalance || 0} />

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <SpendingChart data={dashData?.spendingByCategory || []} />
            <BudgetAlerts alerts={dashData?.budgetAlerts || []} />
          </section>

          {/* Bottom Row: Trend + Transactions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <BalanceTrend data={dashData?.balanceTrend || []} />
            <RecentTransactions transactions={dashData?.recentTransactions || []} />
          </section>
        </>
      )}
    </main>
  )
}
