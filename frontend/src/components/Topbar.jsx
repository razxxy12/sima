import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between flex-shrink-0">
      <div className="hidden md:block">
        <p className="text-sm font-semibold text-gray-800">Selamat Datang, {user?.nama || 'Pengguna'}</p>
        <p className="text-xs text-gray-500">Pantau aktivitas magang terkini</p>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm font-medium text-gray-700">{user?.nama}</span>
        <img
          src={user?.foto ? `/${user.foto}` : 'https://via.placeholder.com/40'}
          alt="avatar"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
      </div>
    </header>
  );
};

export default Topbar;