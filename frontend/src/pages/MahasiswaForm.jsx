import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const MahasiswaForm = () => {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]       = useState({
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

  const handleChange  = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await api.put(`/mahasiswa/${id}`, form);
      else        await api.post('/mahasiswa', form);
      navigate('/mahasiswa');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const inputClass  = 'w-full bg-surface-container-low border border-glass-stroke rounded-xl px-4 py-3 text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue transition-all';
  const labelClass  = 'block text-label-md text-on-surface-variant mb-1.5';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/mahasiswa')}
          className="flex items-center gap-1 text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Kembali
        </button>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface">
          {isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          {isEdit ? 'Perbarui data mahasiswa yang sudah ada.' : 'Isi form berikut untuk mendaftarkan mahasiswa baru.'}
        </p>
      </div>

      {error && (
        <div className="bg-error-container/30 text-error border border-error/30 p-3 rounded-xl text-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
          {error}
        </div>
      )}

      <div className="glass-card rounded-xl p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>NIM</label>
            <input name="nim" value={form.nim} onChange={handleChange} required placeholder="Nomor Induk Mahasiswa" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Nama Lengkap</label>
            <input name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap mahasiswa" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@contoh.com" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Prodi</label>
              <input name="prodi" value={form.prodi} onChange={handleChange} placeholder="Teknik Informatika" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Angkatan</label>
              <input type="number" name="angkatan" value={form.angkatan} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>No HP</label>
            <input name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="08xxxxxxxxxx" className={inputClass} />
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

          <div className="flex flex-wrap gap-3 pt-2 border-t border-glass-stroke">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 electric-gradient text-white px-6 py-2.5 rounded-xl text-label-md font-semibold active:scale-95 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Simpan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mahasiswa')}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-glass-stroke text-label-md text-on-surface-variant hover:bg-white/5 transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaForm;
