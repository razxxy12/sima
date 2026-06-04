import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">SIMA</h1>
            <p className="text-sm text-gray-500 mt-1">Sistem Informasi Manajemen Magang</p>
          </div>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="mahasiswa@sima.ac.id" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              Login
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-700 hover:underline font-medium">Daftar sebagai Mahasiswa</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;