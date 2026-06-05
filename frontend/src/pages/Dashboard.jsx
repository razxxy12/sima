import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats]           = useState({});
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(console.error);
    api.get('/dashboard/activities')
      .then((res) => setActivities(res.data.activities))
      .catch(console.error);
  }, []);

  const statusBadge = (status) => {
    if (status === 'Approved') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'Pending')  return 'bg-electric-blue/10 text-electric-blue border-electric-blue/20';
    return 'bg-error/10 text-error border-error/20';
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon="school"
          label="Total Mahasiswa"
          value={stats.total_mahasiswa || 0}
          color="text-electric-blue"
          glowColor="bg-electric-blue"
        />
        <StatCard
          icon="corporate_fare"
          label="Total Perusahaan"
          value={stats.total_perusahaan || 0}
          color="text-green-400"
          glowColor="bg-green-500"
        />
        <StatCard
          icon="description"
          label="Total Laporan"
          value={stats.total_laporan || 0}
          color="text-secondary"
          glowColor="bg-secondary"
        />
        <StatCard
          icon="check_circle"
          label="Laporan Disetujui"
          value={stats.laporan_approved || 0}
          color="text-indigo-accent"
          glowColor="bg-indigo-accent"
        />
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Terbaru */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-stroke">
            <h3 className="text-headline-md font-semibold text-on-surface">Aktivitas Terbaru</h3>
          </div>
          <div className="divide-y divide-glass-stroke">
            {activities.length > 0 ? activities.map((act) => (
              <div key={act.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-outline group-hover:text-electric-blue transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">description</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-medium text-on-surface truncate">{act.description}</p>
                    <p className="text-label-sm text-outline mt-0.5">
                      {new Date(act.time).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadge(act.status)}`}>
                  {act.status}
                </span>
              </div>
            )) : (
              <p className="text-on-surface-variant text-body-md p-6">Belum ada aktivitas</p>
            )}
          </div>
        </div>

        {/* Ringkasan Magang */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-stroke">
            <h3 className="text-headline-md font-semibold text-on-surface">Ringkasan Magang</h3>
          </div>
          <div className="divide-y divide-glass-stroke px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                <span className="text-body-md text-on-surface-variant">Mahasiswa Aktif</span>
              </div>
              <span className="text-body-md font-semibold text-on-surface">{stats.mahasiswa_aktif || 0}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-electric-blue" />
                <span className="text-body-md text-on-surface-variant">Laporan Pending</span>
              </div>
              <span className="text-body-md font-semibold text-electric-blue">
                {(stats.total_laporan || 0) - (stats.laporan_approved || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-body-md text-on-surface-variant">Laporan Disetujui</span>
              </div>
              <span className="text-body-md font-semibold text-green-400">{stats.laporan_approved || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
