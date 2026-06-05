const DataTable = ({ columns, data }) => (
  <div className="w-full overflow-x-auto">
    <table className="min-w-full divide-y divide-glass-stroke">
      <thead>
        <tr className="bg-surface-container-low">
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="px-4 md:px-6 py-3 text-left text-label-sm text-outline uppercase tracking-wider whitespace-nowrap"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-glass-stroke">
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-10 text-center text-body-md text-on-surface-variant"
            >
              Tidak ada data
            </td>
          </tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-white/5 transition-colors group">
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className="px-4 md:px-6 py-3 md:py-4 text-body-md text-on-surface whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
