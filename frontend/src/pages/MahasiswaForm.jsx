import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const MahasiswaForm = () => {
  const { id }    = useParams();
  const isEdit    = Boolean(id);
  const navigate  = useNavigate();

  const [form, setForm]     = useState({
    nim: '', nama: '', email: '', prodi: '',
    angkatan: new Date().getFullYear(), no_hp: '', status_magang: 'Pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/mahasiswa/${id}`).then((res) => {
        const m = res.data;
        setForm({
          nim: m.nim, nama: m.nama, email: m.email,
          prodi: m.prodi, angkatan: m.angkatan,
          no_hp: m.no_hp || '', status_magang: m.status_magang,
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
      if (isEdit) await api.put(`/mahasiswa/${id}`, form);
      else        await api.post('/mahasiswa', form);
      navigate('/mahasiswa');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const inputClass  = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
  const labelClass  = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        {isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
        <div>
          <label className={labelClass}>NIM</label>
          <input name="nim" value={form.nim} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Nama Lengkap</label>
          <input name="nama" value={form.nama} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
        </div>

        {/* Prodi & Angkatan: 2 kolom di sm, 1 di mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Prodi</label>
            <input name="prodi" value={form.prodi} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Angkatan</label>
            <input type="number" name="angkatan" value={form.angkatan} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>No HP</label>
          <input name="no_hp" value={form.no_hp} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Status Magang</label>
          <select name="status_magang" value={form.status_magang} onChange={handleChange} className={inputClass}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Aktif">Aktif</option>
            <option value="Selesai">Selesai</option>
          </select>
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
            onClick={() => navigate('/mahasiswa')}
            className="flex-1 sm:flex-none border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default MahasiswaForm;
