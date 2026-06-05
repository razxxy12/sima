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
      } catch {
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
            Data Perusahaan
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Kelola daftar perusahaan mitra magang.
          </p>
        </div>
        <Link
          to="/perusahaan/tambah"
          className="inline-flex items-center justify-center gap-2 electric-gradient text-white px-5 py-2.5 rounded-xl text-label-md font-semibold active:scale-95 transition-all shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_30px_rgba(0,112,243,0.5)]"
        >
          <span className="material-symbols-outlined text-lg">add_business</span>
          Tambah Perusahaan
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
        <input
          type="text"
          placeholder="Cari nama perusahaan..."
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

export default PerusahaanList;
