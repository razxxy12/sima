import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/fileUrl';

const Profile = () => {
  const { user, setUser }               = useAuth();
  const [profile, setProfile]           = useState(null);
  const [editMode, setEditMode]         = useState(false);
  const [form, setForm]                 = useState({ nama: '', no_hp: '', prodi: '', angkatan: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const [fotoLoading, setFotoLoading]   = useState(false);
  const [saveLoading, setSaveLoading]   = useState(false);
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
    setSaveLoading(true);
    try {
      await api.put('/profile', form);
      setEditMode(false);
      const res = await api.get('/profile');
      setProfile(res.data);
      setUser((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setSaveLoading(false);
    }
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
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus foto');
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64 text-on-surface-variant">
      <svg className="animate-spin h-5 w-5 mr-3 text-electric-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Memuat profil...
    </div>
  );

  const inputClass = 'w-full bg-surface-container-low border border-glass-stroke rounded-xl px-4 py-3 text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all';
  const labelClass = 'block text-label-md text-on-surface-variant mb-1.5';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface">Profil Saya</h2>
        <p className="text-body-md text-on-surface-variant mt-1">Kelola informasi pribadi dan keamanan akun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="glass-card rounded-xl p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={fileUrl(user?.foto) || 'https://placehold.co/120'}
              alt="foto profil"
              className="w-28 h-28 rounded-full object-cover border-2 border-electric-blue/30 shadow-[0_0_20px_rgba(0,112,243,0.2)]"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120'; }}
            />
            <label className={`absolute -bottom-1 -right-1 w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-container transition-colors ${fotoLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {fotoLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <span className="material-symbols-outlined text-white text-base">photo_camera</span>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoUpload} disabled={fotoLoading} className="hidden" />
            </label>
          </div>

          <p className="text-body-md font-semibold text-on-surface">{profile.nama}</p>
          <p className="text-label-sm text-on-surface-variant capitalize mt-0.5">{profile.role}</p>
          {profile.nim && <p className="text-label-sm text-outline mt-1">{profile.nim}</p>}

          {user?.foto && (
            <button
              onClick={handleDeleteFoto}
              className="mt-4 flex items-center gap-1 text-label-md text-error hover:text-red-300 transition-colors"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              Hapus Foto
            </button>
          )}
        </div>

        {/* Detail & Edit */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-headline-md font-semibold text-on-surface">Informasi Profil</h3>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 text-label-md text-electric-blue hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className={labelClass}>Nama</label>
                  <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className={inputClass} />
                </div>
                {user?.role === 'mahasiswa' && (
                  <>
                    <div>
                      <label className={labelClass}>No HP</label>
                      <input value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} placeholder="08xxxxxxxxxx" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Prodi</label>
                        <input value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Angkatan</label>
                        <input type="number" value={form.angkatan} onChange={(e) => setForm({ ...form, angkatan: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-2 border-t border-glass-stroke">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="inline-flex items-center gap-2 electric-gradient text-white px-5 py-2 rounded-xl text-label-md font-semibold transition-all disabled:opacity-60"
                  >
                    {saveLoading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button type="button" onClick={() => setEditMode(false)} className="px-5 py-2 rounded-xl border border-glass-stroke text-label-md text-on-surface-variant hover:bg-white/5 transition-all">
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Nama',     value: profile.nama,     icon: 'person' },
                  { label: 'Email',    value: profile.email,    icon: 'mail' },
                  profile.nim      && { label: 'NIM',      value: profile.nim,      icon: 'badge' },
                  profile.prodi    && { label: 'Prodi',    value: profile.prodi,    icon: 'school' },
                  profile.angkatan && { label: 'Angkatan', value: profile.angkatan, icon: 'calendar_today' },
                  profile.no_hp    && { label: 'No HP',    value: profile.no_hp,    icon: 'phone' },
                ].filter(Boolean).map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-glass-stroke last:border-0">
                    <span className="material-symbols-outlined text-outline text-lg w-5 flex-shrink-0">{icon}</span>
                    <span className="text-label-sm text-on-surface-variant w-20 flex-shrink-0">{label}</span>
                    <span className="text-body-md text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-headline-md font-semibold text-on-surface mb-5">Ubah Password</h3>
            <div className="space-y-3 max-w-sm">
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
                className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-xl text-label-md font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-lg">lock_reset</span>
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
