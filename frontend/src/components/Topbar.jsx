import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/fileUrl';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0">
      {/* Spacer di mobile agar judul tidak tertimpa tombol hamburger */}
      <div className="pl-10 md:pl-0">
        <p className="text-sm font-semibold text-gray-800">
          Selamat Datang, {user?.nama || 'Pengguna'}
        </p>
        <p className="text-xs text-gray-500 hidden md:block">Pantau aktivitas magang terkini</p>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.nama}</span>
        <img
          src={fileUrl(user?.foto) || 'https://placehold.co/40'}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40'; }}
        />
      </div>
    </header>
  );
};

export default Topbar;
