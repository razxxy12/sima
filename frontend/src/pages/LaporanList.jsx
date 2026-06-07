import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MAX_FILE_SIZE_MB    = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const fetchBlobUrl = async (filePath) => {
  const filename = filePath.split('/').pop();
  const response = await api.get(`/laporan/file/${filename}`, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};

const statusBadge = (status) => {
  if (status === 'Approved') return 'bg-green-500/10 text-green-400 border-green-500/20';
  if (status === 'Pending')  return 'bg-electric-blue/10 text-electric-blue border-electric-blue/20';
  return 'bg-error/10 text-error border-error/20';
};

const LaporanList = () => {
  const [laporan, setLaporan]         = useState([]);
  const [judul, setJudul]             = useState('');
  const [uploading, setUploading]     = useState(false);
  const [fileError, setFileError]     = useState('');
  const [preview, setPreview]         = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const { user }                      = useAuth();
  const fileRef                       = useRef(null);

  const fetchLaporan = async () => {
    try {
      const res = await api.get('/laporan');
      setLaporan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLaporan(); }, []);

  const closePreview = () => {
    if (preview?.blobUrl) URL.revokeObjectURL(preview.blobUrl);
    setPreview(null);
  };

  const handleLihat = async (l) => {
    setLoadingFile(true);
    try {
      const blobUrl = await fetchBlobUrl(l.file_pdf);
      const ext = l.file_pdf.split('.').pop().toLowerCase();
      setPreview({ blobUrl, judul: l.judul, ext });
    } catch {
      alert('Gagal memuat file. Pastikan file masih tersedia.');
    } finally {
      setLoadingFile(false);
    }
  };

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
      await api.post('/laporan/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface">
          Laporan Magang
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          {user?.role === 'mahasiswa' ? 'Upload dan pantau status laporan magang kamu.' : 'Tinjau dan kelola semua laporan mahasiswa.'}
        </p>
      </div>

      {/* Loading overlay */}
      {loadingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-electric-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="text-label-md text-on-surface">Memuat file...</span>
          </div>
        </div>
      )}

      {/* Modal Preview */}
      {preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-b border-glass-stroke flex-shrink-0">
            <span className="text-label-md text-on-surface font-medium truncate max-w-[60%]">{preview.judul}</span>
            <div className="flex items-center gap-3">
              <a
                href={preview.blobUrl}
                download={preview.judul}
                className="inline-flex items-center gap-1 text-label-md electric-gradient text-white px-3 py-1.5 rounded-lg transition"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download
              </a>
              <button
                onClick={closePreview}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-white/10 transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {preview.ext === 'pdf' ? (
              <iframe src={preview.blobUrl} className="w-full h-full border-0" title={preview.judul} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-on-surface gap-4">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">description</span>
                <p className="text-body-md text-on-surface-variant">File DOCX tidak bisa ditampilkan langsung di browser.</p>
                <a
                  href={preview.blobUrl}
                  download={preview.judul}
                  className="inline-flex items-center gap-2 electric-gradient text-white px-5 py-2.5 rounded-xl text-label-md font-semibold"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Form (mahasiswa only) */}
      {user?.role === 'mahasiswa' && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-headline-md font-semibold text-on-surface mb-5">Upload Laporan Baru</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">Judul Laporan</label>
              <input
                type="text"
                placeholder="Masukkan judul laporan"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                className="w-full bg-surface-container-low border border-glass-stroke rounded-xl px-4 py-3 text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-1.5">
                File Laporan
                <span className="ml-2 text-label-sm text-outline font-normal">Maks. {MAX_FILE_SIZE_MB} MB</span>
              </label>
              <label className={`file-drop-zone flex flex-col items-center justify-center gap-2 p-6 rounded-xl cursor-pointer hover:bg-white/5 transition-all ${fileError ? 'ring-2 ring-error' : ''}`}>
                <span className="material-symbols-outlined text-3xl text-outline">cloud_upload</span>
                <span className="text-label-md text-on-surface-variant">Klik untuk pilih file PDF atau DOCX</span>
                <span className="text-label-sm text-outline">Format: PDF, DOCX · Maks. {MAX_FILE_SIZE_MB} MB</span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  ref={fileRef}
                  required
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileError && (
                <p className="mt-1.5 text-label-sm text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {fileError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading || !!fileError}
              className="inline-flex items-center gap-2 electric-gradient text-white px-6 py-2.5 rounded-xl text-label-md font-semibold active:scale-95 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)] disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Mengunggah...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  Upload Laporan
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-stroke">
          <h3 className="text-headline-md font-semibold text-on-surface">Daftar Laporan</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-glass-stroke">
            <thead>
              <tr className="bg-surface-container-low">
                {['Mahasiswa', 'Judul', 'Tanggal', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-4 md:px-6 py-3 text-left text-label-sm text-outline uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-stroke">
              {laporan.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-body-md text-on-surface-variant">
                    Belum ada laporan
                  </td>
                </tr>
              ) : (
                laporan.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-body-md text-on-surface whitespace-nowrap">{l.nama_mahasiswa}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-body-md text-on-surface max-w-[200px] truncate">{l.judul}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-body-md text-on-surface-variant whitespace-nowrap">
                      {new Date(l.tanggal_upload).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadge(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {l.file_pdf && (
                          <button
                            onClick={() => handleLihat(l)}
                            className="text-electric-blue hover:text-primary text-label-md font-medium transition-colors"
                          >
                            Lihat
                          </button>
                        )}
                        {user?.role === 'admin' && l.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleReview(l.id, 'Approved')}
                              className="text-green-400 hover:text-green-300 text-label-md font-medium transition-colors"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReview(l.id, 'Rejected')}
                              className="text-error hover:text-red-300 text-label-md font-medium transition-colors"
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
