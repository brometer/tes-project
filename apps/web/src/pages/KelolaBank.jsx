import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function KelolaBank() {
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', color: 'blue', balance: '' });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: '',
    color: 'blue'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch banks on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/bank-accounts');
      setBanks(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data bank. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setIsSubmitting(true);
      await api.post('/bank-accounts', {
        name: formData.name,
        balance: formData.initialBalance ? parseInt(formData.initialBalance) : 0,
        color: formData.color,
      });
      // Reset form and refresh list
      setFormData({ name: '', initialBalance: '', color: 'blue' });
      fetchBanks();
    } catch (err) {
      console.error('Failed to create bank:', err);
      alert('Gagal menyimpan bank baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (bank) => {
    setBankToDelete(bank);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bankToDelete) return;
    
    try {
      setIsSubmitting(true);
      await api.delete(`/bank-accounts/${bankToDelete.id}`);
      setIsDeleteModalOpen(false);
      setBankToDelete(null);
      fetchBanks();
    } catch (err) {
      console.error('Failed to delete bank:', err);
      alert('Gagal menghapus bank.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (bank) => {
    setEditData({ id: bank.id, name: bank.name, color: bank.color, balance: bank.balance });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editData.name) return;
    try {
      setIsSubmitting(true);
      await api.put(`/bank-accounts/${editData.id}`, {
        name: editData.name,
        color: editData.color,
        balance: editData.balance ? parseInt(editData.balance) : 0,
      });
      setIsEditModalOpen(false);
      fetchBanks();
    } catch (err) {
      console.error('Failed to update bank:', err);
      alert('Gagal mengupdate bank.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const totalBalance = banks.reduce((sum, bank) => sum + Number(bank.balance), 0);
  const formatRupiah = (nominal) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal);
  };

  // Color map for Tailwind classes
  const colorMap = {
    purple: 'bg-purple-500 shadow-purple-500/50',
    blue: 'bg-blue-500 shadow-blue-500/50',
    emerald: 'bg-emerald-500 shadow-emerald-500/50',
    amber: 'bg-amber-500 shadow-amber-500/50',
    rose: 'bg-rose-500 shadow-rose-500/50',
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Kelola Bank</h2>
          <p className="text-slate-500 dark:text-slate-400">Atur akun bank dan dompet digital Anda</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 rounded-full border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto w-full">
        {/* Add New Bank Card */}
        <section className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-border-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-900 dark:text-white">Tambah Bank Baru</h3>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nama Bank</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-sm py-3 px-4 text-slate-900 dark:text-slate-100" 
                  placeholder="Contoh: Bank Mandiri" 
                  type="text" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Saldo Awal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                  <input 
                    name="initialBalance"
                    value={formData.initialBalance}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none text-sm py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100" 
                    placeholder="0" 
                    type="number" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Warna Label</label>
                <div className="flex items-center gap-3 h-[46px] px-2">
                  {['purple', 'blue', 'emerald', 'amber', 'rose'].map((c) => (
                    <label key={c} className="relative cursor-pointer">
                      <input 
                        checked={formData.color === c} 
                        onChange={() => handleColorChange(c)}
                        className="peer sr-only" 
                        name="bank-color" 
                        type="radio" 
                      />
                      <div className={`size-8 rounded-full bg-${c}-500 ring-2 ring-transparent peer-checked:ring-white dark:peer-checked:ring-surface-dark peer-checked:ring-offset-2 peer-checked:ring-offset-${c}-500 border-2 border-transparent transition-all`}></div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isSubmitting ? 'sync' : 'save'}
                  </span>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Bank Baru'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Active Bank List Card */}
        <section className="bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-border-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_balance</span>
            <h3 className="font-bold text-lg uppercase tracking-wider text-slate-900 dark:text-white">Daftar Bank Aktif</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-surface-dark/50 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 w-20">Warna</th>
                  <th className="px-6 py-4">Nama Bank</th>
                  <th className="px-6 py-4">Saldo</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark border-b border-slate-100 dark:border-border-dark">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                        Memuat data bank...
                      </div>
                    </td>
                  </tr>
                ) : banks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      Anda belum menambahkan bank.
                    </td>
                  </tr>
                ) : (
                  banks.map((bank) => (
                    <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-surface-dark/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`size-4 rounded-full ${colorMap[bank.color] || colorMap.blue} shadow-sm`}></div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{bank.name}</td>
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{formatRupiah(bank.balance)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => startEdit(bank)}
                            className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors rounded-lg"
                          >
                            <span className="material-symbols-outlined text-xl">edit_square</span>
                          </button>
                          <button 
                            className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors rounded-lg"
                            onClick={() => confirmDelete(bank)}
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-surface-dark/30 flex justify-between items-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Bank Aktif: <span className="text-slate-900 dark:text-white font-bold">{banks.length}</span></p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Saldo: <span className="text-primary font-bold">{formatRupiah(totalBalance)}</span></p>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-background-dark/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className="size-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">warning</span>
              </div>
              <h4 className="text-xl font-bold mb-3 uppercase tracking-wide text-rose-500">Konfirmasi Hapus Bank</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Hapus bank <span className="font-bold text-slate-900 dark:text-white">{bankToDelete?.name}</span>? Semua transaksi terkait akan tetap tersimpan tapi bank ditandai sebagai <span className="text-rose-500 font-bold">[Dihapus]</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Batal
                </button>
                <button 
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/30"
                  onClick={handleDelete}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isSubmitting ? 'sync' : 'delete_forever'}
                  </span>
                  {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-background-dark/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-surface border border-slate-200 dark:border-border-dark rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <h4 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Edit Bank</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nama Bank</label>
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData(p => ({...p, name: e.target.value}))}
                    className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg py-3 px-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Saldo Akhir</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                    <input
                      type="number"
                      value={editData.balance}
                      onChange={(e) => setEditData(p => ({...p, balance: e.target.value}))}
                      className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Warna</label>
                  <div className="flex gap-3">
                    {['purple', 'blue', 'emerald', 'amber', 'rose'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditData(p => ({...p, color: c}))}
                        className={`size-8 rounded-full bg-${c}-500 ring-2 transition-all ${editData.color === c ? 'ring-white ring-offset-2 ring-offset-primary scale-110' : 'ring-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors"
                >
                  Batal
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleUpdate}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30"
                >
                  <span className="material-symbols-outlined text-lg">{isSubmitting ? 'sync' : 'save'}</span>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => setIsEditModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
