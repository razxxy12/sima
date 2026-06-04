import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const MahasiswaList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get(`/mahasiswa?page=${page}&search=${search}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus?')) {
      try {
        await api.delete(`/mahasiswa/${id}`);
        fetchData();
      } catch (err) { alert('Gagal menghapus'); }
    }
  };

  const columns = [
    { header: 'NIM', accessor: 'nim' },
    { header: 'Nama', accessor: 'nama' },
    { header: 'Prodi', accessor: 'prodi' },
    { header: 'Status', accessor: 'status_magang', render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status_magang === 'Approved' || row.status_magang === 'Aktif' ? 'bg-green-100 text-green-800' :
          row.status_magang === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>{row.status_magang}</span>
    )},
    { header: 'Aksi', render: (row) => (
        <div className="flex gap-2">
          <Link to={`/mahasiswa/edit/${row.id}`} className="text-blue-600 hover:underline">Edit</Link>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Hapus</button>
        </div>
    )}
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Data Mahasiswa</h2>
        <Link to="/mahasiswa/tambah" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition">+ Tambah Mahasiswa</Link>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Cari NIM atau nama..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={data} />
        <div className="px-6 py-3 border-t">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default MahasiswaList;