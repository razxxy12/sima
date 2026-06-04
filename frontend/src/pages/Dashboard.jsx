import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
    api.get('/dashboard/activities').then(res => setActivities(res.data.activities)).catch(console.error);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="school" label="Total Mahasiswa" value={stats.total_mahasiswa || 0} color="bg-blue-500" />
        <StatCard icon="corporate_fare" label="Total Perusahaan" value={stats.total_perusahaan || 0} color="bg-green-500" />
        <StatCard icon="description" label="Total Laporan" value={stats.total_laporan || 0} color="bg-yellow-500" />
        <StatCard icon="check_circle" label="Laporan Disetujui" value={stats.laporan_approved || 0} color="bg-indigo-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
          {activities.length > 0 ? (
            <ul className="space-y-3">
              {activities.map(act => (
                <li key={act.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${act.status === 'Approved' ? 'bg-green-500' : act.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{act.description}</p>
                    <p className="text-xs text-gray-500">{new Date(act.time).toLocaleString('id-ID')}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">Belum ada aktivitas</p>}
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Ringkasan Magang</h3>
          <p className="text-gray-500 text-sm">Mahasiswa aktif: {stats.mahasiswa_aktif || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;