import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function Recurring() {
  const [items, setItems] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    amount: '',
    bankAccountId: '',
    categoryId: '',
    type: 'expense',
    interval: 'monthly',
    dayOfInterval: '1',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [recRes, bankRes, catRes] = await Promise.all([
        api.get('/recurring'),
        api.get('/bank-accounts'),
        api.get('/categories'),
      ]);
      setItems(recRes.data);
      setBanks(bankRes.data);
      setCategories(catRes.data);
      if (bankRes.data.length > 0 && !form.bankAccountId) {
        setForm(p => ({ ...p, bankAccountId: bankRes.data[0].id }));
      }
      if (catRes.data.length > 0 && !form.categoryId) {
        setForm(p => ({ ...p, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch recurring data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    try {
      setIsSubmitting(true);
      await api.post('/recurring', {
        ...form,
        amount: parseInt(form.amount),
        dayOfInterval: parseInt(form.dayOfInterval),
      });
      setForm(p => ({ ...p, name: '', amount: '', dayOfInterval: '1' }));
      fetchAll();
    } catch (err) {
      console.error('Failed to create recurring:', err.response?.data || err.message || err);
      alert(`Gagal menyimpan: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/recurring/${id}/toggle`);
      fetchAll();
    } catch (err) {
      console.error('Failed to toggle recurring:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi rutin ini?')) return;
    try {
      await api.delete(`/recurring/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Failed to delete recurring:', err);
    }
  };

  const totalMonthly = items
    .filter(i => i.isActive)
    .reduce((s, i) => s + Number(i.amount), 0);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
      <header className="h-16 border-b border-slate-200 dark:border-border-dark flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recurring Transactions</h2>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Recurring Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your automated payments and subscriptions</p>
        </div>

        {/* Form */}
        <section className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-6">TAMBAH TRANSAKSI RUTIN</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Transaksi</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100" placeholder="e.g. Netflix Subscription" type="text" required/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nominal</label>
              <input name="amount" value={form.amount} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100" placeholder="0" type="number" required/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bank / Sumber</label>
              <select name="bankAccountId" value={form.bankAccountId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100">
                {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kategori</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100">
                {categories.length === 0 && <option>Belum ada kategori</option>}
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal / Interval</label>
              <div className="flex gap-2">
                <select name="dayOfInterval" value={form.dayOfInterval} onChange={handleChange} className="w-20 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100">
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select name="interval" value={form.interval} onChange={handleChange} className="flex-1 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100">
                  <option value="monthly">Setiap Bulan</option>
                  <option value="weekly">Setiap Minggu</option>
                  <option value="yearly">Setiap Tahun</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button disabled={isSubmitting} type="submit" className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">{isSubmitting ? 'sync' : 'add_circle'}</span>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        </section>

        {/* Recurring list */}
        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">DAFTAR RECURRING AKTIF</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-surface-dark">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Nama</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Bank</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Tgl</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                        Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada transaksi rutin.</td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const bankName = banks.find(b => b.id === item.bankAccountId)?.name || '-';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-surface-dark/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                        <td className="px-6 py-4 text-rose-500 dark:text-rose-400 font-medium">-{formatRupiah(item.amount)}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{bankName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{item.dayOfInterval}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleToggle(item.id)} className="inline-flex items-center gap-1.5">
                            <span className={`inline-block size-2 rounded-full ${item.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            <span className={`text-xs font-bold uppercase ${item.isActive ? 'text-green-500' : 'text-slate-400'}`}>{item.isActive ? 'On' : 'Off'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors rounded-lg">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-surface-dark/50 border-t border-slate-200 dark:border-border-dark flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Recurring per Bulan</span>
            <span className="text-xl font-black text-rose-500 dark:text-rose-400">{formatRupiah(totalMonthly)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
