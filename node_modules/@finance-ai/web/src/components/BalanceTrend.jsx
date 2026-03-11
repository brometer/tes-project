export default function BalanceTrend({ data = [] }) {
  const maxBalance = Math.max(...data.map(d => d.balance), 1);
  
  const formatShort = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
    return val.toString();
  };

  const getOpacityClass = (index) => {
    const opacities = ['bg-primary/20', 'bg-primary/30', 'bg-primary/40', 'bg-primary/50', 'bg-primary/60', 'bg-primary'];
    return opacities[Math.min(index, opacities.length - 1)];
  };

  return (
    <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">trending_up</span>
        📈 TREN SALDO
      </h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-slate-400">Belum ada data</div>
      ) : (
        <>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {data.map((bar, i) => {
              const heightPct = Math.max((bar.balance / maxBalance) * 100, 5);
              return (
                <div
                  key={i}
                  className={`w-full ${getOpacityClass(i)} rounded-t-lg relative group transition-all`}
                  style={{ height: `${heightPct}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {formatShort(bar.balance)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-slate-500 uppercase font-bold px-1">
            {data.map((bar, i) => (
              <span key={i}>{bar.dayName}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
