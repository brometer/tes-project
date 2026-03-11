import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.error) {
          setErrorMsg(res.error.message || 'Login failed.');
        } else {
          // Force a hard redirect to ensure session is loaded correctly on the new page
          window.location.href = '/dashboard';
        }
      } else {
        const res = await register(name, email, password);
        if (res.error) {
          setErrorMsg(res.error.message || 'Registration failed.');
        } else {
          // Better auth automatically signs in after registration. Force hard redirect.
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-[480px] z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <svg className="size-8 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Finance AI</h1>
          </div>
        </div>
        
        {/* Login Card */}
        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-white/5 rounded-xl p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Silakan masuk ke dashboard keuangan Anda' : 'Daftar untuk mulai mengelola keuangan Anda'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {errorMsg}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <input 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    placeholder="Nama Anda" 
                    type="text"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                  placeholder="nama@email.com" 
                  type="email"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && <a className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Lupa Password?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                  placeholder="Masukkan password" 
                  type="password"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-surface px-4 text-slate-400">Atau masuk dengan</span>
            </div>
          </div>
          
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              <img alt="Google" className="size-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHh0mUo8Ph6122YlJXhrRtJxEDmbhfhv27MRc0b7_5bDukNCThVRZahuyG6KhbueUpAWMPDDJQWlachAQitnk-3-QnBCPMrt6WgLjE3JGkoU_-hWrVkGDYUfntv74p2g68u7zwuDHZWLue5lrm1OsCh-7NlDbwoTStr3ge8tVFosqswKqM0r-RUTFXfWzqhBGiIzyUgA4ku2bmwmW5pSXwiavrYY_gB9Yay0InmmYwMRrVRsQzN7dHlzQj1fLdGJE0Ay7ZAK2gmk" />
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">brand_awareness</span>
              <span className="text-sm font-semibold">Apple</span>
            </button>
          </div>
        </div>
        
        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all ml-1"
          >
            {isLogin ? 'Daftar Sekarang' : 'Masuk di sini'}
          </button>
        </p>
        
        {/* Small decorative element */}
        <div className="mt-12 flex justify-center items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="text-[10px] font-medium tracking-widest uppercase">Secured by AI Shield</div>
          <div className="w-1 h-1 rounded-full bg-slate-500"></div>
          <div className="text-[10px] font-medium tracking-widest uppercase">Privacy Focused</div>
        </div>
      </div>
    </div>
  );
}
