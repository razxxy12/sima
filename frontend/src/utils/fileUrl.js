const BACKEND = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');
console.log('BACKEND URL:', BACKEND);

export const fileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND}/${path.replace(/^\//, '')}`;
};