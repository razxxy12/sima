import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ nama: '', email: '', password: '', nim: '', prodi: '', angkatan: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Registrasi berhasil! Mengalihkan ke login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">SIMA</h1>
            <p className="text-sm text-gray-500 mt-1">Daftar sebagai Mahasiswa</p>
          </div>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input name="nama" value={form.nama} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input name="nim" value={form.nim} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prodi</label>
              <input name="prodi" value={form.prodi} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
              <input name="angkatan" type="number" value={form.angkatan} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg transition-colors">Daftar</button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-700 hover:underline font-medium">Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;