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
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const inputClass    = 'w-full bg-surface-container-low border border-glass-stroke rounded-xl px-4 py-3 text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue transition-all';
  const labelClass    = 'block text-label-md text-on-surface-variant mb-1.5';
  const textareaClass = `${inputClass} resize-none`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/perusahaan')}
          className="flex items-center gap-1 text-label-md text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Kembali
        </button>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface">
          {isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          {isEdit ? 'Perbarui data perusahaan mitra.' : 'Tambahkan perusahaan mitra magang baru.'}
        </p>
      </div>

      {error && (
        <div className="bg-error-container/30 text-error border border-error/30 p-3 rounded-xl text-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
          {error}
        </div>
      )}

      <div className="glass-card rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Nama Perusahaan</label>
            <input name="nama_perusahaan" value={form.nama_perusahaan} onChange={handleChange} required placeholder="PT Contoh Maju" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Alamat</label>
            <textarea name="alamat" value={form.alamat} onChange={handleChange} rows="2" placeholder="Jl. Contoh No. 1" className={textareaClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kota</label>
              <input name="kota" value={form.kota} onChange={handleChange} placeholder="Medan" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bidang Usaha</label>
              <input name="bidang_usaha" value={form.bidang_usaha} onChange={handleChange} placeholder="Teknologi Informasi" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="info@perusahaan.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Telepon</label>
              <input name="telepon" value={form.telepon} onChange={handleChange} placeholder="061-xxxxxxxx" className={inputClass} />
            </div>
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
              onClick={() => navigate('/perusahaan')}
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

export default PerusahaanForm;
