import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Transaksi() {
  const [txList, setTxList] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    bankAccountId: '',
    categoryId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [txRes, bankRes, catRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/bank-accounts'),
        api.get('/categories'),
      ]);
      setTxList(txRes.data);
      setBanks(bankRes.data);
      setCategories(catRes.data);
      // Set defaults for dropdowns
      if (bankRes.data.length > 0 && !form.bankAccountId) {
        setForm(prev => ({ ...prev, bankAccountId: bankRes.data[0].id }));
      }
      if (catRes.data.length > 0 && !form.categoryId) {
        setForm(prev => ({ ...prev, categoryId: catRes.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch transaction data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.bankAccountId) return;

    try {
      setIsSubmitting(true);
      await api.post('/transactions', {
        ...form,
        amount: parseInt(form.amount),
      });
      setForm(prev => ({ ...prev, amount: '', description: '', date: new Date().toISOString().split('T')[0] }));
      fetchAll();
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert('Gagal menyimpan transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Top Header */}
      <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manajemen Transaksi</h2>
      </header>

      <div className="p-8 space-y-8">
        {/* TAMBAH TRANSAKSI SECTION */}
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Tambah Transaksi</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Catat pengeluaran atau pemasukan baru Anda</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Type & Nominal */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tipe Transaksi</label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium cursor-pointer transition-all ${form.type === 'expense' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 hover:border-rose-500/50'}`}>
                    <input checked={form.type === 'expense'} onChange={() => setForm(prev => ({ ...prev, type: 'expense' }))} className="hidden" name="tx_type" type="radio"/>
                    <span className="material-symbols-outlined text-sm">remove_circle</span>
                    Pengeluaran
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium cursor-pointer transition-all ${form.type === 'income' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 hover:border-emerald-500/50'}`}>
                    <input checked={form.type === 'income'} onChange={() => setForm(prev => ({ ...prev, type: 'income' }))} className="hidden" name="tx_type" type="radio"/>
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Pemasukan
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nominal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">Rp</span>
                  <input name="amount" value={form.amount} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" placeholder="0" type="number" required/>
                </div>
              </div>
            </div>

            {/* Middle Column: Account & Category */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Pilih Bank / Dompet</label>
                <select name="bankAccountId" value={form.bankAccountId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:ring-primary focus:border-primary">
                  {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kategori</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:ring-primary focus:border-primary">
                  {categories.length === 0 && <option value="">Belum ada kategori</option>}
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column: Details & Date */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Keterangan / Detail</label>
                <input name="description" value={form.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" placeholder="Misal: Makan Siang di Warteg" type="text"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tanggal</label>
                <input name="date" value={form.date} onChange={handleChange} className="w-full bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 py-3 text-slate-900 dark:text-slate-200 focus:ring-primary focus:border-primary" type="date"/>
              </div>
            </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-border-dark">
              <button disabled={isSubmitting} className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap" type="submit">
                <span className="material-symbols-outlined">{isSubmitting ? 'sync' : 'save'}</span>
                {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN TRANSAKSI'}
              </button>
            </div>
          </form>
        </section>

        {/* HISTORI TRANSAKSI SECTION */}
        <section className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Histori Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-background-dark/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Tgl</th>
                  <th className="px-6 py-4">Detail / Keterangan</th>
                  <th className="px-6 py-4">Bank</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4 text-right">Nominal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                        Memuat transaksi...
                      </div>
                    </td>
                  </tr>
                ) : txList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada transaksi.</td>
                  </tr>
                ) : (
                  txList.map((tx) => {
                    const isExpense = tx.type === 'expense';
                    const bankName = banks.find(b => b.id === tx.bankAccountId)?.name || '-';
                    const catName = categories.find(c => c.id === tx.categoryId)?.name || '-';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(tx.date)}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.description || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">{bankName}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{catName}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-bold ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {isExpense ? '-' : '+'} {formatRupiah(Math.abs(tx.amount))}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(tx.id)} className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors rounded-lg">
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
          <div className="p-4 border-t border-slate-200 dark:border-border-dark flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">Menampilkan <span className="text-slate-900 dark:text-slate-200">{txList.length}</span> transaksi</p>
          </div>
        </section>
      </div>
    </main>
  );
}
