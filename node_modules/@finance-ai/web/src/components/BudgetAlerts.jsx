const formatRupiah = (nominal) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal);
};

export default function BudgetAlerts({ alerts = [] }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold mb-6">Budget Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">Belum ada anggaran yang aktif.</p>
      ) : (
        <div className="space-y-6">
          {alerts.map((budget) => {
            const pct = budget.percentage || 0;
            const isWarning = pct >= 75;
            const barColor = isWarning ? 'bg-amber-500' : 'bg-emerald-500';
            const icon = isWarning ? 'warning' : 'check_circle';
            const iconColor = isWarning ? 'text-amber-500' : 'text-emerald-500';

            return (
              <div key={budget.id || budget.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{budget.category || budget.name}</span>
                    <span className={`${iconColor} material-symbols-outlined text-sm`}>{icon}</span>
                  </div>
                  <span className="text-sm font-bold">
                    {pct}% ({formatRupiah(budget.spent || 0)} / {formatRupiah(budget.limit || budget.amount || 0)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div
                    className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
