import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSun, HiOutlineMoon, HiOutlineMenuAlt3, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              E
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Edu<span className="gradient-text">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn-ghost">Home</Link>
            <Link to="/courses" className="btn-ghost">Courses</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <HiOutlineSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-2 animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-dark-700 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 capitalize">
                        {user?.role === 'admin' ? 'Educator' : 'Student'}
                      </span>
                    </div>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/student'}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              <Link to="/" className="btn-ghost text-left" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/courses" className="btn-ghost text-left" onClick={() => setMobileOpen(false)}>Courses</Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn-ghost text-left" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="btn-primary text-center mt-2" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              ) : (
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/student'}
                  className="btn-ghost text-left"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
