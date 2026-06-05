import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleOverlayClick = () => setIsOpen(false);

  const adminLinks = [
    { to: '/',           label: 'Dashboard',   icon: 'dashboard' },
    { to: '/mahasiswa',  label: 'Mahasiswa',   icon: 'group' },
    { to: '/perusahaan', label: 'Perusahaan',  icon: 'corporate_fare' },
    { to: '/laporan',    label: 'Laporan',     icon: 'menu_book' },
    { to: '/profile',    label: 'Profil',      icon: 'person' },
  ];
  const mahasiswaLinks = [
    { to: '/',        label: 'Dashboard',    icon: 'dashboard' },
    { to: '/laporan', label: 'Laporan Saya', icon: 'menu_book' },
    { to: '/profile', label: 'Profil',       icon: 'person' },
  ];
  const links = user?.role === 'admin' ? adminLinks : mahasiswaLinks;

  return (
    <>
      {/* ── Tombol Hamburger (mobile only) ────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-0 left-0 z-50 h-16 w-16 flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
        aria-label="Buka menu"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="3"  width="22" height="2.2" rx="1.1" fill="currentColor"/>
          <rect y="10" width="22" height="2.2" rx="1.1" fill="currentColor"/>
          <rect y="17" width="22" height="2.2" rx="1.1" fill="currentColor"/>
        </svg>
      </button>

      {/* ── Overlay backdrop (mobile) ──────────────────────────────────── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Panel ─────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:flex-shrink-0
        `}
      >
        {/* Header sidebar */}
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SIMA</h1>
            <p className="text-xs text-gray-400 mt-1">Internship Management</p>
          </div>
          {/* Tombol tutup (mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
