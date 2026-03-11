import { useNavigate } from 'react-router-dom';

const colorMap = {
  blue: {
    bg: 'bg-blue-600/10',
    text: 'text-blue-600',
  },
  teal: {
    bg: 'bg-teal-600/10',
    text: 'text-teal-600',
  },
  orange: {
    bg: 'bg-orange-600/10',
    text: 'text-orange-600',
  },
  emerald: {
    bg: 'bg-emerald-600/10',
    text: 'text-emerald-600',
  },
  purple: {
    bg: 'bg-purple-600/10',
    text: 'text-purple-600',
  },
  amber: {
    bg: 'bg-amber-600/10',
    text: 'text-amber-600',
  },
  rose: {
    bg: 'bg-rose-600/10',
    text: 'text-rose-600',
  },
}

const formatRupiah = (nominal) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal);
};

export default function BankAccountCards({ accounts = [] }) {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">credit_card</span>
        Bank Accounts
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {accounts.length === 0 ? (
          <div className="min-w-[240px] bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 text-sm flex items-center justify-center">
            Belum ada bank.
          </div>
        ) : (
          accounts.map((account) => {
            const colors = colorMap[account.color] || colorMap.blue;
            return (
              <div
                key={account.id || account.name}
                className="min-w-[240px] bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${colors.text}`}>account_balance</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{account.name}</p>
                <p className="text-xl font-bold mt-1">{formatRupiah(account.balance)}</p>
              </div>
            )
          })
        )}
        {/* Add Bank Button */}
        <button 
          onClick={() => navigate('/kelola-bank')}
          className="min-w-[240px] border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-5 text-slate-400 hover:text-primary hover:border-primary transition-all group"
        >
          <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add_circle</span>
          <span className="mt-2 font-medium">Tambah Bank</span>
        </button>
      </div>
    </section>
  )
}
