import { useNavigate } from 'react-router-dom';

const formatRupiah = (nominal) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal);
};

export default function TotalBalanceBanner({ totalBalance = 0 }) {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/20">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-white/80 font-medium uppercase tracking-wider text-sm mb-1">
              💰 TOTAL SALDO GABUNGAN
            </p>
            <h4 className="text-4xl font-black">{formatRupiah(totalBalance)}</h4>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/transaksi')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-xl font-semibold transition-colors"
            >
              Tarik Saldo
            </button>
            <button 
              onClick={() => navigate('/transaksi')}
              className="bg-white text-primary px-6 py-2 rounded-xl font-semibold shadow-lg transition-colors hover:bg-white/90"
            >
              Top Up
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
