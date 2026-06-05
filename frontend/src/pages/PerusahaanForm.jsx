import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const PerusahaanForm = () => {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_perusahaan: '', alamat: '', kota: '',
    bidang_usaha: '', email: '', telepon: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/perusahaan/${id}`).then((res) => {
        const p = res.data;
        setForm({
          nama_perusahaan: p.nama_perusahaan,
          alamat:          p.alamat       || '',
          kota:            p.kota         || '',
          bidang_usaha:    p.bidang_usaha || '',
          email:           p.email        || '',
          telepon:         p.telepon      || '',
        });
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await api.put(`/perusahaan/${id}`, form);
      else        await api.post('/perusahaan', form);
      navigate('/perusahaan');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const inputClass    = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
  const labelClass    = 'block text-sm font-medium text-gray-700 mb-1';
  const textareaClass = `${inputClass} resize-none`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        {isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <div>
          <label className={labelClass}>Nama Perusahaan</label>
          <input name="nama_perusahaan" value={form.nama_perusahaan} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Alamat</label>
          <textarea name="alamat" value={form.alamat} onChange={handleChange} rows="2" className={textareaClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Kota</label>
            <input name="kota" value={form.kota} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bidang Usaha</label>
            <input name="bidang_usaha" value={form.bidang_usaha} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telepon</label>
            <input name="telepon" value={form.telepon} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none bg-blue-800 text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 transition disabled:opacity-60 text-sm font-medium"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/perusahaan')}
            className="flex-1 sm:flex-none border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerusahaanForm;
