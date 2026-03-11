import { Link } from 'react-router-dom';

const formatRupiah = (nominal) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal);
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function RecentTransactions({ transactions = [] }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          🔄 TRANSAKSI TERAKHIR
        </h3>
        <Link to="/transaksi" className="text-primary text-sm font-semibold hover:underline">
          Lihat Semua
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700">
              <th className="pb-3 font-medium">Deskripsi</th>
              <th className="pb-3 font-medium">Kategori</th>
              <th className="pb-3 font-medium">Waktu</th>
              <th className="pb-3 font-medium text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isExpense = tx.type === 'expense';
                return (
                  <tr key={tx.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpense ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          <span className="material-symbols-outlined">
                            {isExpense ? 'arrow_downward' : 'arrow_upward'}
                          </span>
                        </div>
                        <span className="font-semibold">{tx.description || 'Transaksi'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{tx.category || '-'}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{formatDate(tx.date)}</td>
                    <td className={`py-4 text-right font-bold ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {isExpense ? '-' : '+'}{formatRupiah(Math.abs(tx.amount))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
