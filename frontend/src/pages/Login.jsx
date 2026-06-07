import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-deep text-on-background">
      {/* Ambient background glow */}
      <div className="ambient-glow-bg" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-headline-xl font-bold text-primary tracking-tight">SIMA</h1>
          <p className="text-body-md text-on-surface-variant max-w-xs mx-auto">
            Sistem Informasi Manajemen Magang
          </p>
        </div>

        {/* Card */}
        <div className="glass-card w-full max-w-sm rounded-2xl p-8 space-y-8">
          {/* Error */}
          {error && (
            <div className="bg-error-container/30 text-error border border-error/30 p-3 rounded-xl text-label-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <div className="flex items-center gap-3 bg-surface-container-low border border-glass-stroke rounded-xl px-4 h-14 transition-all duration-300 focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/20">
                <span className="material-symbols-outlined text-outline">mail</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="bg-transparent border-none outline-none ring-0 w-full text-on-surface text-body-md p-0 focus:ring-0 peer"
                />
                <label
                  htmlFor="email"
                  className="absolute left-11 top-4 text-body-md text-outline pointer-events-none transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-outline"
                >
                  Email
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex items-center gap-3 bg-surface-container-low border border-glass-stroke rounded-xl px-4 h-14 transition-all duration-300 focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/20">
                <span className="material-symbols-outlined text-outline">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="bg-transparent border-none outline-none ring-0 w-full text-on-surface text-body-md p-0 focus:ring-0 peer"
                />
                <label
                  htmlFor="password"
                  className="absolute left-11 top-4 text-body-md text-outline pointer-events-none transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-85 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-outline"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPass ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 electric-gradient rounded-xl text-label-md font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] disabled:opacity-60"
            >
              {loading ? 'Masuk...' : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center">
            <p className="text-body-md text-on-surface-variant">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
                Daftar sebagai Mahasiswa
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
