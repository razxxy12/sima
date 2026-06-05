const Pagination = ({ current, total, onChange }) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex justify-between items-center">
      <p className="text-label-md text-on-surface-variant">Halaman {current} dari {total}</p>
      <div className="flex gap-1">
        <button
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="px-3 py-1.5 rounded-lg border border-glass-stroke text-label-md text-on-surface-variant hover:bg-white/5 disabled:opacity-40 transition-all"
        >
          Prev
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 rounded-lg border text-label-md transition-all ${
              p === current
                ? 'electric-gradient text-white border-electric-blue/40 shadow-[0_0_10px_rgba(0,112,243,0.3)]'
                : 'border-glass-stroke text-on-surface-variant hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={current === total}
          onClick={() => onChange(current + 1)}
          className="px-3 py-1.5 rounded-lg border border-glass-stroke text-label-md text-on-surface-variant hover:bg-white/5 disabled:opacity-40 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
