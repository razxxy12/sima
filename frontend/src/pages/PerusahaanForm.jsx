import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const PerusahaanForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama_perusahaan: '', alamat: '', kota: '', bidang_usaha: '', email: '', telepon: '', pic: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/perusahaan/${id}`).then(res => {
        const p = res.data;
        setForm({ nama_perusahaan: p.nama_perusahaan, alamat: p.alamat || '', kota: p.kota || '', bidang_usaha: p.bidang_usaha || '', email: p.email || '', telepon: p.telepon || '', pic: p.pic || '' });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await api.put(`/perusahaan/${id}`, form);
      else await api.post('/perusahaan', form);
      navigate('/perusahaan');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'}</h2>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div><label className="block text-sm font-medium mb-1">Nama Perusahaan</label><input name="nama_perusahaan" value={form.nama_perusahaan} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
        <div><label className="block text-sm font-medium mb-1">Alamat</label><textarea name="alamat" value={form.alamat} onChange={handleChange} rows="2" className="w-full border rounded px-3 py-2" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Kota</label><input name="kota" value={form.kota} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Bidang Usaha</label><input name="bidang_usaha" value={form.bidang_usaha} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Telepon</label><input name="telepon" value={form.telepon} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">PIC</label><input name="pic" value={form.pic} onChange={handleChange} className="w-full border rounded px-3 py-2" /></div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          <button type="button" onClick={() => navigate('/perusahaan')} className="border px-6 py-2 rounded hover:bg-gray-100">Batal</button>
        </div>
      </form>
    </div>
  );
};

export default PerusahaanForm;