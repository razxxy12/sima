import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    document.body.classList.remove('sidebar-open');
  }, [location.pathname]);

  const openSidebar = () => {
    setIsOpen(true);
    document.body.classList.add('sidebar-open');
  };
  const closeSidebar = () => {
    setIsOpen(false);
    document.body.classList.remove('sidebar-open');
  };

  const adminLinks = [
    { to: '/',           label: 'Dashboard',  icon: 'dashboard' },
    { to: '/mahasiswa',  label: 'Mahasiswa',  icon: 'group' },
    { to: '/perusahaan', label: 'Perusahaan', icon: 'corporate_fare' },
    { to: '/laporan',    label: 'Laporan',    icon: 'menu_book' },
    { to: '/profile',    label: 'Profil',     icon: 'person' },
  ];
  const mahasiswaLinks = [
    { to: '/',        label: 'Dashboard',    icon: 'dashboard' },
    { to: '/laporan', label: 'Laporan Saya', icon: 'menu_book' },
    { to: '/profile', label: 'Profil',       icon: 'person' },
  ];
  const links = user?.role === 'admin' ? adminLinks : mahasiswaLinks;

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={openSidebar}
        className="md:hidden fixed top-0 left-0 z-50 h-16 w-16 flex items-center justify-center text-primary hover:bg-white/5 transition-colors"
        aria-label="Buka menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex flex-col
          w-72 md:w-64
          glass-card border-r border-glass-stroke rounded-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:flex-shrink-0
        `}
        style={{ height: '100dvh' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-glass-stroke flex items-center justify-between">
          <div>
            <h1 className="text-headline-md font-bold text-electric-blue tracking-tighter">SIMA</h1>
            <p className="text-label-sm text-on-surface-variant mt-0.5">Internship Management</p>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-outline hover:text-primary p-1 rounded-lg transition-colors"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav Links — scrollable jika banyak menu */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-3 rounded-xl text-label-md font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-electric-blue/15 text-electric-blue border border-electric-blue/20'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-electric-blue rounded-r-full" />
                  )}
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout — selalu terlihat di bagian bawah */}
        <div className="flex-shrink-0 p-3 border-t border-glass-stroke">
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-3 text-label-md text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all duration-200"
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
