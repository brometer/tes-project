const COLORS = ['#6b5be6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6'];
const DOT_COLORS = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500', 'bg-pink-500', 'bg-violet-500'];

export default function SpendingChart({ data = [] }) {
  // Build chart segments from data
  const total = data.reduce((sum, d) => sum + Number(d.total || 0), 0);
  const categories = data.map((d, i) => ({
    name: d.categoryName || 'Lain',
    percent: total > 0 ? Math.round((Number(d.total || 0) / total) * 100) : 0,
    color: COLORS[i % COLORS.length],
    dotColor: DOT_COLORS[i % DOT_COLORS.length],
  }));

  // Build SVG dash segments
  let offset = 0;
  const chartSegments = categories.map((cat) => {
    const seg = {
      percent: cat.percent,
      stroke: cat.color,
      dashArray: `${cat.percent} ${100 - cat.percent}`,
      dashOffset: `${-offset}`,
    };
    offset += cat.percent;
    return seg;
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold mb-6">Pengeluaran per Kategori</h3>
      {categories.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">Belum ada data pengeluaran.</p>
      ) : (
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="16"
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="4"
                className="dark:stroke-slate-700"
              />
              {chartSegments.map((seg, i) => (
                <circle
                  key={i}
                  cx="18" cy="18" r="16"
                  fill="transparent"
                  stroke={seg.stroke}
                  strokeWidth="4"
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  pathLength="100"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase">Total</span>
              <span className="text-lg font-bold">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.dotColor}`}></div>
                  <span>{cat.name}</span>
                </div>
                <span className="font-bold">{cat.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
