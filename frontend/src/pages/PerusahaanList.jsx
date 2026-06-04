import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const PerusahaanList = () => {
  const [data, setData]             = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get(`/perusahaan?page=${page}&search=${search}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus perusahaan ini?')) {
      try {
        await api.delete(`/perusahaan/${id}`);
        fetchData();
      } catch (err) {
        alert('Gagal menghapus');
      }
    }
  };

  const columns = [
    { header: 'Nama Perusahaan', accessor: 'nama_perusahaan' },
    { header: 'Bidang',          accessor: 'bidang_usaha' },
    { header: 'Kota',            accessor: 'kota' },
    { header: 'PIC',             accessor: 'pic' },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/perusahaan/edit/${row.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Data Perusahaan</h2>
        <Link
          to="/perusahaan/tambah"
          className="inline-flex items-center justify-center gap-1 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition text-sm font-medium"
        >
          + Tambah Perusahaan
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          placeholder="Cari nama perusahaan..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-72 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={data} />
        <div className="px-4 md:px-6 py-3 border-t">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default PerusahaanList;
