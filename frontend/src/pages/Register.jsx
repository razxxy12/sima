import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [form, setForm]       = useState({ nama: '', email: '', password: '', nim: '', prodi: '', angkatan: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-surface-container-low border border-glass-stroke rounded-xl px-4 py-3 text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue transition-all';

  return (
    <div className="min-h-screen bg-bg-deep text-on-background overflow-y-auto">
      <div className="ambient-glow-bg" />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">Buat Akun</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Daftar sebagai mahasiswa magang</p>
        </div>

        <div className="glass-card w-full max-w-md rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-error-container/30 text-error border border-error/30 p-3 rounded-xl text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-xl text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-lg flex-shrink-0">check_circle</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Nama Lengkap</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                placeholder="Nama lengkap kamu"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@contoh.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">NIM</label>
              <input
                name="nim"
                value={form.nim}
                onChange={handleChange}
                required
                placeholder="Nomor Induk Mahasiswa"
                className={inputClass}
              />
            </div>

            {/* Prodi & Angkatan: stack vertikal di mobile, 2 kolom di sm+ */}
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Prodi</label>
              <input
                name="prodi"
                value={form.prodi}
                onChange={handleChange}
                placeholder="Teknik Informatika"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Angkatan</label>
              <input
                name="angkatan"
                type="number"
                value={form.angkatan}
                onChange={handleChange}
                placeholder="2022"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 electric-gradient rounded-xl text-label-md font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] disabled:opacity-60 mt-2"
            >
              {loading ? 'Mendaftar...' : (
                <>
                  <span>Daftar Sekarang</span>
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-body-md text-on-surface-variant">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 transition-all">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
