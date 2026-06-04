import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/fileUrl';

const Profile = () => {
  const { user, setUser }       = useAuth();
  const [profile, setProfile]   = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm]         = useState({ nama: '', no_hp: '', prodi: '', angkatan: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [fotoLoading, setFotoLoading]   = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/profile').then((res) => {
      setProfile(res.data);
      setForm({
        nama:     res.data.nama     || '',
        no_hp:    res.data.no_hp    || '',
        prodi:    res.data.prodi    || '',
        angkatan: res.data.angkatan || '',
      });
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await api.put('/profile', form);
    alert('Profil diperbarui');
    setEditMode(false);
    const res = await api.get('/profile');
    setProfile(res.data);
    setUser((prev) => ({ ...prev, ...res.data }));
  };

  const handleChangePassword = async () => {
    try {
      await api.put('/profile/password', passwordForm);
      alert('Password berhasil diubah, silakan login ulang');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah password');
    }
  };

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    setFotoLoading(true);
    try {
      const res = await api.post('/profile/foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser((prev) => ({ ...prev, foto: res.data.foto }));
      setProfile((prev) => ({ ...prev, foto: res.data.foto }));
      alert('Foto berhasil diupload');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal upload foto');
    } finally {
      setFotoLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFoto = async () => {
    if (!window.confirm('Yakin ingin menghapus foto profil?')) return;
    try {
      await api.delete('/profile/foto');
      setUser((prev) => ({ ...prev, foto: null }));
      setProfile((prev) => ({ ...prev, foto: null }));
      alert('Foto berhasil dihapus');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus foto');
    }
  };

  if (!profile) return <div className="p-6 text-gray-500">Loading...</div>;

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    /* grid: 1 kolom mobile, 3 kolom desktop */
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

      {/* ── Kartu Foto ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <img
          src={fileUrl(user?.foto) || 'https://placehold.co/150'}
          alt="foto profil"
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-gray-200"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150'; }}
        />
        <p className="font-semibold text-gray-800 mb-1">{profile.nama}</p>
        <p className="text-xs text-gray-500 mb-4 capitalize">{profile.role}</p>

        <div className="flex flex-col gap-2 items-center">
          <label className={`cursor-pointer ${fotoLoading ? 'opacity-50 cursor-not-allowed' : ''} bg-blue-800 text-white px-4 py-1.5 rounded-lg hover:bg-blue-900 text-sm w-full text-center`}>
            {fotoLoading ? 'Mengunggah...' : 'Ganti Foto'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFotoUpload}
              disabled={fotoLoading}
              className="hidden"
            />
          </label>
          {user?.foto && (
            <button
              onClick={handleDeleteFoto}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 text-sm w-full"
            >
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      {/* ── Kartu Detail Profil ───────────────────────────────────────── */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Profil Saya</h2>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className={labelClass}>Nama</label>
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={inputClass}
              />
            </div>
            {user?.role === 'mahasiswa' && (
              <>
                <div>
                  <label className={labelClass}>No HP</label>
                  <input
                    value={form.no_hp}
                    onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Prodi</label>
                    <input
                      value={form.prodi}
                      onChange={(e) => setForm({ ...form, prodi: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Angkatan</label>
                    <input
                      type="number"
                      value={form.angkatan}
                      onChange={(e) => setForm({ ...form, angkatan: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 text-sm">
                Simpan
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 text-sm">
                Batal
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Nama',     value: profile.nama },
              { label: 'Email',    value: profile.email },
              profile.nim      && { label: 'NIM',      value: profile.nim },
              profile.prodi    && { label: 'Prodi',    value: profile.prodi },
              profile.angkatan && { label: 'Angkatan', value: profile.angkatan },
              profile.no_hp    && { label: 'No HP',    value: profile.no_hp },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide sm:w-24 flex-shrink-0">{label}</span>
                <span className="text-sm text-gray-800">{value}</span>
              </div>
            ))}
            <button
              onClick={() => setEditMode(true)}
              className="mt-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Edit Profil
            </button>
          </div>
        )}

        {/* Ubah Password */}
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-4">Ubah Password</h3>
        <div className="space-y-3 w-full max-w-sm">
          <input
            type="password"
            placeholder="Password lama"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password baru"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className={inputClass}
          />
          <button
            onClick={handleChangePassword}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 text-sm w-full sm:w-auto"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
