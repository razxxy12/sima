import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/fileUrl';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-glass-fill backdrop-blur-md border-b border-glass-stroke px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0 shadow-[0_8px_32px_rgba(0,112,243,0.08)]">
      {/* Spacer di mobile agar tidak tertimpa hamburger */}
      <div className="pl-10 md:pl-0">
        <p className="text-body-md font-semibold text-on-surface">
          Selamat Datang, {user?.nama || 'Pengguna'}
        </p>
        <p className="text-label-sm text-on-surface-variant hidden md:block">
          Pantau aktivitas magang terkini
        </p>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="text-label-md text-on-surface hidden sm:block">{user?.nama}</span>
        <img
          src={fileUrl(user?.foto) || 'https://placehold.co/40'}
          alt="avatar"
          className="w-9 h-9 rounded-full border border-electric-blue/40 object-cover shadow-[0_0_10px_rgba(0,112,243,0.2)]"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40'; }}
        />
      </div>
    </header>
  );
};

export default Topbar;
