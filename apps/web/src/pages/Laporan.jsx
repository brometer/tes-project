import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const COLORS = ['bg-primary', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-pink-500'];

export default function Laporan() {
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
  const [byBank, setByBank] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => { fetchReport(); }, [month, year]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const [sumRes, bankRes, catRes] = await Promise.all([
        api.get(`/reports/summary?month=${month}&year=${year}`),
        api.get(`/reports/by-bank?month=${month}&year=${year}`),
        api.get(`/reports/by-category?month=${month}&year=${year}`),
      ]);
      setSummary(sumRes.data);
      setByBank(bankRes.data);
      setByCategory(catRes.data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else { setMonth(m => m - 1); }
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else { setMonth(m => m + 1); }
  };

  const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Category chart data
  const totalCatSpending = byCategory.reduce((s, c) => s + Number(c.total || 0), 0);

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/reports/export/${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-${month}-${year}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <header className="h-16 border-b border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analisis Laporan Keuangan</h2>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Period Selector */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Periode Laporan</p>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <div className="px-6 py-2 bg-white dark:bg-surface border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg font-bold min-w-[160px] text-center">
                  {monthName}
                </div>
                <button onClick={nextMonth} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
              <span className="text-lg font-medium">Memuat laporan...</span>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg">
                      <span className="material-symbols-outlined">trending_up</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">TOTAL PEMASUKAN</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{formatRupiah(summary.income)}</h3>
                </div>
                <div className="bg-white dark:bg-surface p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg">
                      <span className="material-symbols-outlined">trending_down</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">TOTAL PENGELUARAN</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{formatRupiah(summary.expense)}</h3>
                </div>
              </div>

              {/* Nett Banner */}
              <div className="relative overflow-hidden bg-primary rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-white/80 text-sm font-medium mb-1">SELISIH (NETT)</p>
                  <h3 className="text-3xl font-bold">{formatRupiah(summary.net)}</h3>
                </div>
                <div className="relative z-10 flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined">{summary.net >= 0 ? 'check_circle' : 'warning'}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">Status: {summary.net >= 0 ? 'Surplus' : 'Defisit'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Breakdown per Bank */}
                <div className="lg:col-span-2 bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-200 dark:border-border-dark shrink-0">
                    <h4 className="font-bold text-slate-900 dark:text-white">Breakdown per Bank</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-surface-dark/50">
                          <th className="px-6 py-3 font-bold">Bank / Akun</th>
                          <th className="px-6 py-3 font-bold text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                        {byBank.length === 0 ? (
                          <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-400">Tidak ada data bank.</td></tr>
                        ) : (
                          byBank.map((bank) => (
                            <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-surface-dark/30 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-primary text-sm">account_balance</span>
                                </div>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{bank.name}</span>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-right text-slate-900 dark:text-white">{formatRupiah(bank.balance)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Breakdown per Kategori */}
                <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col">
                  <div className="p-6 border-b border-slate-200 dark:border-border-dark shrink-0">
                    <h4 className="font-bold text-slate-900 dark:text-white">Kategori Pengeluaran</h4>
                  </div>
                  <div className="p-6 flex-1 space-y-6">
                    {byCategory.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-4">Belum ada data.</p>
                    ) : (
                      byCategory.map((cat, i) => {
                        const pct = totalCatSpending > 0 ? Math.round((cat.total / totalCatSpending) * 100) : 0;
                        return (
                          <div key={cat.categoryId || i} className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${COLORS[i % COLORS.length]}`}></span>
                                {cat.categoryName || 'Lain-lain'}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-surface-dark rounded-full overflow-hidden">
                              <div className={`${COLORS[i % COLORS.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Export Section */}
              <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Export Data</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Download laporan keuangan periode {monthName}</p>
                  </div>
                  <div className="hidden md:block w-px bg-slate-200 dark:bg-border-dark"></div>
                  <div className="flex flex-col justify-center gap-3 md:w-48">
                    <button onClick={() => handleExport('csv')} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm">
                      <span className="material-symbols-outlined">download</span>
                      Download CSV
                    </button>
                    <button onClick={() => handleExport('pdf')} className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-surface border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors shadow-sm">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
