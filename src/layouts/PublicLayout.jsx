import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-bg-subtle">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 dark:bg-dark-950 text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">E</div>
                <span className="text-xl font-bold text-white">EduFlow</span>
              </div>
              <p className="text-sm leading-relaxed max-w-md">
                Empowering India's next generation of tech professionals with world-class online courses. Learn from industry experts.
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1"><HiOutlineMail className="w-4 h-4" /> support@eduflow.in</span>
                <span className="flex items-center gap-1"><HiOutlinePhone className="w-4 h-4" /> +91 98765 43210</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Web Development</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Data Science</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Mobile Development</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">DevOps</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
            <p>© 2026 EduFlow. Made with ❤️ in India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
