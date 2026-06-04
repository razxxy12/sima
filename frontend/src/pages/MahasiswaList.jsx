import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const MahasiswaList = () => {
  const [data, setData]           = useState([]);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]       = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get(`/mahasiswa?page=${page}&search=${search}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus mahasiswa ini?')) {
      try {
        await api.delete(`/mahasiswa/${id}`);
        fetchData();
      } catch (err) {
        alert('Gagal menghapus');
      }
    }
  };

  const columns = [
    { header: 'NIM',    accessor: 'nim' },
    { header: 'Nama',   accessor: 'nama' },
    { header: 'Prodi',  accessor: 'prodi' },
    {
      header: 'Status',
      accessor: 'status_magang',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status_magang === 'Approved' || row.status_magang === 'Aktif'
              ? 'bg-green-100 text-green-800'
              : row.status_magang === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.status_magang}
        </span>
      ),
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/mahasiswa/edit/${row.id}`}
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Data Mahasiswa</h2>
        <Link
          to="/mahasiswa/tambah"
          className="inline-flex items-center justify-center gap-1 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition text-sm font-medium"
        >
          + Tambah Mahasiswa
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari NIM atau nama..."
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

export default MahasiswaList;
