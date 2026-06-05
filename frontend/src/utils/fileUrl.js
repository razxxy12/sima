const BACKEND = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');

export const fileUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${BACKEND}/${filePath.replace(/^\//, '')}`;
};

// Khusus file laporan — lewat route API yang authenticated
// agar header Content-Type benar dan PDF bisa dibuka di browser
export const laporanFileUrl = (filePath) => {
  if (!filePath) return null;
  const filename = filePath.split('/').pop(); // ambil nama file saja
  const base = import.meta.env.VITE_API_BASE_URL || '/api';
  return `${base}/laporan/file/${filename}`;
};
