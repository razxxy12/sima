import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const PerusahaanList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const res = await api.get(`/perusahaan?page=${page}&search=${search}`);
    setData(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus?')) {
      await api.delete(`/perusahaan/${id}`);
      fetchData();
    }
  };

  const columns = [
    { header: 'Nama', accessor: 'nama_perusahaan' },
    { header: 'Bidang', accessor: 'bidang_usaha' },
    { header: 'Kota', accessor: 'kota' },
    { header: 'PIC', accessor: 'pic' },
    { header: 'Aksi', render: (row) => (
      <div className="flex gap-2">
        <Link to={`/perusahaan/edit/${row.id}`} className="text-blue-600">Edit</Link>
        <button onClick={() => handleDelete(row.id)} className="text-red-600">Hapus</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Data Perusahaan</h2>
        <Link to="/perusahaan/tambah" className="bg-blue-800 text-white px-4 py-2 rounded">+ Tambah</Link>
      </div>
      <input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border p-2 rounded w-64" />
      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={data} />
        <div className="p-3 border-t"><Pagination current={page} total={totalPages} onChange={setPage} /></div>
      </div>
    </div>
  );
};

export default PerusahaanList;