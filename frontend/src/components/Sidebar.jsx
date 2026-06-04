import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const adminLinks = [
    { to: '/', label: 'Dashboard', icon: 'dashboard' },
    { to: '/mahasiswa', label: 'Mahasiswa', icon: 'group' },
    { to: '/perusahaan', label: 'Perusahaan', icon: 'corporate_fare' },
    { to: '/laporan', label: 'Laporan', icon: 'menu_book' },
    { to: '/profile', label: 'Profil', icon: 'person' }
  ];
  const mahasiswaLinks = [
    { to: '/', label: 'Dashboard', icon: 'dashboard' },
    { to: '/laporan', label: 'Laporan Saya', icon: 'menu_book' },
    { to: '/profile', label: 'Profil', icon: 'person' }
  ];
  const links = user?.role === 'admin' ? adminLinks : mahasiswaLinks;

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-tight">SIMA</h1>
        <p className="text-xs text-gray-400 mt-1">Internship Management</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-700">
        <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md">
          <span className="material-symbols-outlined text-xl">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;