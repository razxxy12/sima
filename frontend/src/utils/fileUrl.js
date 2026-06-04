// Ambil base URL backend (tanpa /api di akhir)
const BACKEND = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');

export const fileUrl = (path) => {
  if (!path) return null;
  // Jika sudah full URL (http/https), kembalikan apa adanya
  if (path.startsWith('http')) return path;
  // Buang slash di awal jika ada, lalu gabung dengan backend URL
  return `${BACKEND}/${path.replace(/^\//, '')}`;
};