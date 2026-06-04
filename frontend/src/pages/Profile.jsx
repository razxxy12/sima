import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama: '', no_hp: '', prodi: '', angkatan: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data);
      setForm({ nama: res.data.nama || '', no_hp: res.data.no_hp || '', prodi: res.data.prodi || '', angkatan: res.data.angkatan || '' });
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await api.put('/profile', form);
    alert('Profil diperbarui');
    setEditMode(false);
    const res = await api.get('/profile');
    setProfile(res.data);
    setUser(prev => ({ ...prev, ...res.data }));
  };

  const handleChangePassword = async () => {
    try {
      await api.put('/profile/password', passwordForm);
      alert('Password berhasil diubah, silakan login ulang');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) { alert(err.response?.data?.message || 'Gagal mengubah password'); }
  };

  const handleFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    try {
      const res = await api.post('/profile/foto', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(prev => ({ ...prev, foto: res.data.foto }));
      setProfile(prev => ({ ...prev, foto: res.data.foto }));
      alert('Foto berhasil diupload');
    } catch (err) { alert(err.response?.data?.message || 'Gagal upload foto'); } finally { fileInputRef.current.value = ''; }
  };

  const handleDeleteFoto = async () => {
    if (!window.confirm('Yakin ingin menghapus foto profil?')) return;
    try {
      await api.delete('/profile/foto');
      setUser(prev => ({ ...prev, foto: null }));
      setProfile(prev => ({ ...prev, foto: null }));
      alert('Foto berhasil dihapus');
    } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus foto'); }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <img src={user?.foto ? `/${user.foto}` : 'https://via.placeholder.com/150'} alt="foto" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} />
        <div className="flex flex-col gap-2 items-center">
          <label className="cursor-pointer bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-900 text-sm">
            Ganti Foto
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoUpload} className="hidden" />
          </label>
          {user?.foto && <button onClick={handleDeleteFoto} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Hapus Foto</button>}
        </div>
      </div>
      <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Profil</h2>
        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div><label className="block text-sm">Nama</label><input value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border p-2 rounded" /></div>
            {user?.role === 'mahasiswa' && (
              <>
                <div><label className="block text-sm">No HP</label><input value={form.no_hp} onChange={e => setForm({...form, no_hp: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm">Prodi</label><input value={form.prodi} onChange={e => setForm({...form, prodi: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm">Angkatan</label><input type="number" value={form.angkatan} onChange={e => setForm({...form, angkatan: e.target.value})} className="w-full border p-2 rounded" /></div>
              </>
            )}
            <div className="flex gap-3"><button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">Simpan</button><button type="button" onClick={() => setEditMode(false)} className="border px-4 py-2 rounded">Batal</button></div>
          </form>
        ) : (
          <div className="space-y-3">
            <p><strong>Nama:</strong> {profile.nama}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.nim && <p><strong>NIM:</strong> {profile.nim}</p>}
            {profile.prodi && <p><strong>Prodi:</strong> {profile.prodi}</p>}
            {profile.angkatan && <p><strong>Angkatan:</strong> {profile.angkatan}</p>}
            {profile.no_hp && <p><strong>No HP:</strong> {profile.no_hp}</p>}
            <button onClick={() => setEditMode(true)} className="bg-gray-200 px-4 py-2 rounded mt-2">Edit Profil</button>
          </div>
        )}
        <hr className="my-8" />
        <h3 className="text-lg font-semibold mb-4">Ubah Password</h3>
        <div className="space-y-3 max-w-sm">
          <input type="password" placeholder="Password lama" value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full border p-2 rounded" />
          <input type="password" placeholder="Password baru" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full border p-2 rounded" />
          <button onClick={handleChangePassword} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Ubah Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;