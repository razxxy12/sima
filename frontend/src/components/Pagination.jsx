const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-gray-600">Halaman {current} dari {total}</p>
      <div className="flex gap-1">
        <button disabled={current === 1} onClick={() => onChange(current - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 border rounded ${p === current ? 'bg-blue-800 text-white' : ''}`}>{p}</button>
        ))}
        <button disabled={current === total} onClick={() => onChange(current + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default Pagination;