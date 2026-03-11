import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function Anggaran() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [form, setForm] = useState({ categoryId: '', limitAmount: '' });

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [budgetRes, catRes] = await Promise.all([
        api.get(`/budgets?month=${month}&year=${year}`),
        api.get('/categories'),
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !form.categoryId) {
        setForm(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch budget data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.limitAmount) return;
    try {
      setIsSubmitting(true);
      await api.post('/budgets', {
        categoryId: form.categoryId,
        limitAmount: parseInt(form.limitAmount),
        month,
        year,
      });
      setForm({ categoryId: categories[0]?.id || '', limitAmount: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Failed to create budget:', err);
      alert('Gagal menyimpan anggaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limitAmount || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const monthName = new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else { setMonth(m => m - 1); }
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else { setMonth(m => m + 1); }
  };

  const getStatusColor = (pct) => {
    if (pct >= 90) return { bar: 'bg-rose-500', text: 'text-rose-500', label: 'Danger' };
    if (pct >= 70) return { bar: 'bg-amber-500', text: 'text-amber-500', label: 'Warning' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-500', label: 'OK' };
  };

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col min-h-screen">
      <header className="h-16 border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Anggaran</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Tutup Form' : 'Tambah Anggaran Baru'}
        </button>
      </header>

      <div className="p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Month indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl w-fit">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-primary/20 rounded">
            <span className="material-symbols-outlined text-sm text-slate-500">chevron_left</span>
          </button>
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white min-w-[120px] text-center">{monthName}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-primary/20 rounded">
            <span className="material-symbols-outlined text-sm text-slate-500">chevron_right</span>
          </button>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <section className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Tambah Anggaran</h3>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Kategori</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({...p, categoryId: e.target.value}))} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-3 text-sm">
                  {categories.length === 0 && <option>Belum ada kategori</option>}
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Limit Bulanan</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                  <input value={form.limitAmount} onChange={e => setForm(p => ({...p, limitAmount: e.target.value}))} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl pl-10 pr-4 py-3 text-sm" placeholder="0" type="number" required/>
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">{isSubmitting ? 'sync' : 'save'}</span>
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </section>
        )}

        {/* Budget Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
            Memuat anggaran...
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-4">account_balance_wallet</span>
            <p>Belum ada anggaran bulan ini.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {budgets.map((b) => {
              const pct = Math.round(b.percentage || 0);
              const status = getStatusColor(pct);
              const catName = categories.find(c => c.id === b.categoryId)?.name || 'Kategori';
              return (
                <div key={b.id} className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Kategori</span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{catName.toUpperCase()}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Limit</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{formatRupiah(b.limitAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Terpakai</p>
                        <p className={`font-bold text-sm ${status.text}`}>{formatRupiah(b.spent || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Sisa</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{formatRupiah(b.remaining || 0)}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs mb-2">
                        <span className={`font-medium ${status.text}`}>Status: {status.label}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-surface-dark rounded-full overflow-hidden">
                        <div className={`h-full ${status.bar} rounded-full transition-all duration-500`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ringkasan */}
        {budgets.length > 0 && (
          <section className="bg-slate-50 dark:bg-surface border border-slate-200 dark:border-border-dark rounded-2xl p-8">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-primary">analytics</span>
              RINGKASAN ANGGARAN
            </h4>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-4 bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark">
                <p className="text-sm text-slate-500 mb-1">Total Budget</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalBudget)}</p>
              </div>
              <div className="p-4 bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-slate-500">Total Terpakai</p>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{overallPct}%</span>
                </div>
                <p className="text-2xl font-black text-primary">{formatRupiah(totalSpent)}</p>
              </div>
              <div className="p-4 bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-slate-100 dark:border-border-dark">
                <p className="text-sm text-slate-500 mb-1">Total Sisa</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalRemaining)}</p>
              </div>
            </div>
            <div className="mt-8">
              <div className="h-3 w-full bg-slate-200 dark:bg-surface-dark rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: `${overallPct}%` }}></div>
                <div className="h-full bg-slate-300 dark:bg-border-dark" style={{ width: `${100 - overallPct}%` }}></div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
