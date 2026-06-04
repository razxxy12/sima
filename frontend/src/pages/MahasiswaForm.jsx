import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const MahasiswaForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ nim: '', nama: '', email: '', prodi: '', angkatan: new Date().getFullYear(), no_hp: '', status_magang: 'Pending' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/mahasiswa/${id}`).then(res => {
        const m = res.data;
        setForm({ nim: m.nim, nama: m.nama, email: m.email, prodi: m.prodi, angkatan: m.angkatan, no_hp: m.no_hp || '', status_magang: m.status_magang });
      }).catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await api.put(`/mahasiswa/${id}`, form);
      else await api.post('/mahasiswa', form);
      navigate('/mahasiswa');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div><label className="block text-sm font-medium mb-1">NIM</label><input name="nim" value={form.nim} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Nama</label><input name="nama" value={form.nama} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Prodi</label><input name="prodi" value={form.prodi} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Angkatan</label><input type="number" name="angkatan" value={form.angkatan} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">No HP</label><input name="no_hp" value={form.no_hp} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Status Magang</label><select name="status_magang" value={form.status_magang} onChange={handleChange} className="w-full border rounded px-3 py-2"><option value="Pending">Pending</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option><option value="Aktif">Aktif</option><option value="Selesai">Selesai</option></select></div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          <button type="button" onClick={() => navigate('/mahasiswa')} className="border px-6 py-2 rounded hover:bg-gray-100">Batal</button>
        </div>
      </form>
    </div>
  );
};

export default MahasiswaForm;