import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LaporanList = () => {
  const [laporan, setLaporan] = useState([]);
  const { user } = useAuth();
  const [judul, setJudul] = useState('');
  const fileRef = useRef(null);

  const fetchLaporan = async () => {
    try {
      const res = await api.get('/laporan');
      setLaporan(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLaporan(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    if (!file || !judul) return alert('Judul dan file wajib');
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('file', file);
    try {
      await api.post('/laporan/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Laporan berhasil diunggah');
      setJudul('');
      fileRef.current.value = '';
      fetchLaporan();
    } catch (err) { alert(err.response?.data?.message || 'Upload gagal'); }
  };

  const handleReview = async (id, status) => {
    try {
      await api.put(`/laporan/${id}/status`, { status });
      fetchLaporan();
    } catch (err) { alert('Gagal'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Laporan Magang</h2>
      {user?.role === 'mahasiswa' && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload Laporan Baru</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <input type="text" placeholder="Judul laporan" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full border p-2 rounded" />
            <input type="file" accept=".pdf,.docx" ref={fileRef} required className="block" />
            <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900">Upload</button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-semibold">Daftar Laporan</h3></div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahasiswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {laporan.map(l => (
              <tr key={l.id}>
                <td className="px-6 py-4">{l.nama_mahasiswa}</td>
                <td className="px-6 py-4">{l.judul}</td>
                <td className="px-6 py-4">{new Date(l.tanggal_upload).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${l.status === 'Approved' ? 'bg-green-100 text-green-800' : l.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{l.status}</span></td>
                <td className="px-6 py-4">
                  {l.file_pdf && <a href={`/${l.file_pdf}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mr-2">Lihat</a>}
                  {user?.role === 'admin' && l.status === 'Pending' && (
                    <>
                      <button onClick={() => handleReview(l.id, 'Approved')} className="text-green-600 hover:underline mr-2">Setujui</button>
                      <button onClick={() => handleReview(l.id, 'Rejected')} className="text-red-600 hover:underline">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanList;