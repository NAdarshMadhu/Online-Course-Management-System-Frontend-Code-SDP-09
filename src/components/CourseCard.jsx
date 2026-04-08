import { HiStar, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const gradients = [
  'from-primary-500 via-primary-600 to-accent-600',
  'from-emerald-500 via-teal-500 to-cyan-600',
  'from-orange-500 via-red-500 to-pink-600',
  'from-blue-500 via-indigo-500 to-purple-600',
  'from-pink-500 via-rose-500 to-red-600',
  'from-violet-500 via-purple-500 to-fuchsia-600',
];

export default function CourseCard({ course, enrolled = false, progress = 0, index = 0 }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link
      to={`/course/${course.id}`}
      className="glass-card overflow-hidden card-hover group block"
    >
      {/* Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm text-white">
            {course.level}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm text-white">
            {course.category}
          </span>
        </div>
        {/* Floating shapes */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700 delay-100" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.instructor}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-400" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{course.rating}</span>
            <span>({course.reviews?.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineClock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineUserGroup className="w-3.5 h-3.5" />
            <span>{course.enrolled?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Progress */}
        {enrolled && (
          <div className="mt-3">
            <ProgressBar value={progress} size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
}
