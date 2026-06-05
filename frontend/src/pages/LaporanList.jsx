import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_CLASS = {
  Approved: 'bg-green-100 text-green-800',
  Pending:  'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const LaporanList = () => {
  const [laporan, setLaporan]     = useState([]);
  const [judul, setJudul]         = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  const { user }                  = useAuth();
  const fileRef                   = useRef(null);

  const fetchLaporan = async () => {
    try {
      const res = await api.get('/laporan');
      setLaporan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLaporan(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setFileError('');
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB. File kamu: ${(file.size / 1024 / 1024).toFixed(1)} MB`);
      e.target.value = '';
    } else {
      setFileError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file || !judul) return alert('Judul dan file wajib diisi');
    if (file.size > MAX_FILE_SIZE_BYTES) return alert(`Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB`);
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('file', file);
    setUploading(true);
    try {
      await api.post('/laporan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Laporan berhasil diunggah');
      setJudul('');
      setFileError('');
      if (fileRef.current) fileRef.current.value = '';
      fetchLaporan();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleReview = async (id, status) => {
    try {
      await api.put(`/laporan/${id}/status`, { status });
      fetchLaporan();
    } catch {
      alert('Gagal memperbarui status');
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-6">Laporan Magang</h2>

      {/* ── Form Upload (mahasiswa only) ─────────────────────────────── */}
      {user?.role === 'mahasiswa' && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload Laporan Baru</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan</label>
              <input
                type="text"
                placeholder="Masukkan judul laporan"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File (PDF / DOCX)
                <span className="ml-2 text-xs font-normal text-gray-400">Maks. {MAX_FILE_SIZE_MB} MB</span>
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileRef}
                required
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-800 hover:file:bg-blue-100"
              />
              {fileError ? (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {fileError}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">Format yang didukung: PDF, DOCX · Maksimal {MAX_FILE_SIZE_MB} MB</p>
              )}
            </div>
            <button
              type="submit"
              disabled={uploading || !!fileError}
              className="w-full sm:w-auto bg-blue-800 text-white px-6 py-2.5 rounded-lg hover:bg-blue-900 disabled:opacity-60 text-sm font-medium"
            >
              {uploading ? 'Mengunggah...' : 'Upload Laporan'}
            </button>
          </form>
        </div>
      )}

      {/* ── Tabel Laporan ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Daftar Laporan</h3>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Mahasiswa', 'Judul', 'Tanggal', 'Status', 'Aksi'].map((h) => (
                  <th
                    key={h}
                    className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {laporan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    Belum ada laporan
                  </td>
                </tr>
              ) : (
                laporan.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      {l.nama_mahasiswa}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 max-w-[200px] truncate">
                      {l.judul}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(l.tanggal_upload).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          STATUS_CLASS[l.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {l.file_pdf && (
                          <a
                            href={`/${l.file_pdf}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Lihat
                          </a>
                        )}
                        {user?.role === 'admin' && l.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleReview(l.id, 'Approved')}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReview(l.id, 'Rejected')}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanList;
