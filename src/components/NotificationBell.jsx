import { useState, useRef, useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi';
import { notifications } from '../data/dummyData';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const ref = useRef(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  const typeIcons = {
    assignment: '📝',
    grade: '🏆',
    course: '📚',
    announcement: '📢',
    reminder: '⏰',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
      >
        <HiOutlineBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center animate-bounce-slow">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 glass-card p-0 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {items.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b border-gray-100 dark:border-dark-800 last:border-0 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors
                  ${!n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
              >
                <div className="flex gap-3">
                  <span className="text-lg flex-shrink-0">{typeIcons[n.type] || '📌'}</span>
                  <div>
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
