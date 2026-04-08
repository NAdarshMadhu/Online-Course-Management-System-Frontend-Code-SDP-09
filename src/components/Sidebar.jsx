import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlinePlusCircle, HiOutlineCollection,
  HiOutlineUpload, HiOutlineChartBar, HiOutlineAcademicCap,
  HiOutlineBookOpen, HiOutlineClipboardList, HiOutlineClipboardCheck,
  HiOutlineCog, HiX, HiOutlineUserGroup,
} from 'react-icons/hi';

const adminLinks = [
  { to: '/admin', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/admin/create-course', icon: HiOutlinePlusCircle, label: 'Create Course' },
  { to: '/admin/manage-courses', icon: HiOutlineCollection, label: 'Manage Courses' },
  { to: '/admin/upload-content', icon: HiOutlineUpload, label: 'Upload Content' },
  { to: '/admin/track-progress', icon: HiOutlineChartBar, label: 'Track Progress' },
  { to: '/admin/assignments', icon: HiOutlineClipboardCheck, label: 'Assignments' },
  { to: '/admin/students', icon: HiOutlineUserGroup, label: 'Students' },
];

const studentLinks = [
  { to: '/student', icon: HiOutlineHome, label: 'Dashboard', end: true },
  { to: '/student/courses', icon: HiOutlineAcademicCap, label: 'My Courses' },
  { to: '/student/viewer', icon: HiOutlineBookOpen, label: 'Course Viewer' },
  { to: '/student/assignments', icon: HiOutlineClipboardList, label: 'Assignments' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 lg:z-30 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]
          w-72 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
        `}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-800">
          <span className="text-lg font-bold gradient-text">EduFlow</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 capitalize font-medium">
                {user?.role === 'admin' ? 'Educator' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-dark-800">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">Need Help?</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Contact support@eduflow.in</p>
          </div>
        </div>
      </aside>
    </>
  );
}
