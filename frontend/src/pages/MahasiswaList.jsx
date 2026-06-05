import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const MahasiswaList = () => {
  const [data, setData]             = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');

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
      } catch {
        alert('Gagal menghapus');
      }
    }
  };

  const statusBadge = (status) => {
    if (status === 'Approved' || status === 'Aktif')
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    if (status === 'Pending')
      return 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20';
    return 'bg-error/10 text-error border border-error/20';
  };

  const columns = [
    { header: 'NIM',   accessor: 'nim' },
    { header: 'Nama',  accessor: 'nama' },
    { header: 'Prodi', accessor: 'prodi' },
    {
      header: 'Status',
      accessor: 'status_magang',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge(row.status_magang)}`}>
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
            className="text-electric-blue hover:text-primary text-label-md font-medium transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-error hover:text-red-300 text-label-md font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface">
            Data Mahasiswa
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Kelola dan pantau status magang semua mahasiswa.
          </p>
        </div>
        <Link
          to="/mahasiswa/tambah"
          className="inline-flex items-center justify-center gap-2 electric-gradient text-white px-5 py-2.5 rounded-xl text-label-md font-semibold active:scale-95 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)]"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Tambah Mahasiswa
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          type="text"
          placeholder="Cari NIM atau nama..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-glass-fill border border-glass-stroke rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all text-body-md backdrop-blur-xl"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data} />
        <div className="px-4 md:px-6 py-3 border-t border-glass-stroke">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default MahasiswaList;
