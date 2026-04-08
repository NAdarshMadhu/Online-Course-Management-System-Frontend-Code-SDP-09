import ProgressBar from '../../components/ProgressBar';
import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAuth } from '../../context/AuthContext';
import { getCourseProgress, getModuleCompletion, getAverageProgress } from '../../utils/progressUtils';

const achievements = [
  { id: 1, emoji: '🔥', title: 'Week Streak', desc: '7 day learning streak', unlocked: true },
  { id: 2, emoji: '📚', title: 'Bookworm', desc: 'Completed 10 lessons', unlocked: true },
  { id: 3, emoji: '⭐', title: 'First Course', desc: 'Enrolled in first course', unlocked: true },
  { id: 4, emoji: '🏆', title: 'Top Scorer', desc: 'Scored 90%+ in assignment', unlocked: false },
  { id: 5, emoji: '🎓', title: 'Graduate', desc: 'Complete a full course', unlocked: false },
  { id: 6, emoji: '💎', title: 'Diamond', desc: '100% in all assignments', unlocked: false },
];

export default function StudentProgress() {
  const { courseList: courses } = useCourses();
  const { studentsList } = useStudents();
  const { user } = useAuth();

  // Find logged-in student
  const currentStudent = studentsList.find((s) => s.email === user?.email);
  const enrolledIds = currentStudent?.enrolledCourses || [];
  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  // Compute per-course progress from actual module completion
  const courseProgressData = enrolledCourses.map((course) => {
    const currLen = course.curriculum?.length || 0;
    const progress = getCourseProgress(course.id, currLen);
    const completed = getModuleCompletion(course.id, currLen);
    const doneCount = completed.filter(Boolean).length;
    return {
      courseId: course.id,
      courseName: course.title || course.name || 'Unknown',
      progress,
      totalModules: currLen,
      completedModules: doneCount,
    };
  });

  const avgProgress = getAverageProgress(enrolledCourses);
  const totalCompleted = courseProgressData.reduce((a, p) => a + p.completedModules, 0);
  const totalModules = courseProgressData.reduce((a, p) => a + p.totalModules, 0);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">My Progress</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8">Track your learning journey and achievements.</p>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6 text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-gray-200 dark:text-dark-700" strokeWidth="8" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                strokeDasharray={`${avgProgress * 2.51} 251`} />
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#6366f1" />
                  
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-gray-900 dark:text-white">{avgProgress}%</span>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</p>
        </div>
        <div className="glass-card p-6 text-center flex flex-col items-center justify-center">
          <p className="text-4xl font-black gradient-text">{totalCompleted}/{totalModules}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Modules Completed</p>
        </div>
        <div className="glass-card p-6 text-center flex flex-col items-center justify-center">
          <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{courseProgressData.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Courses in Progress</p>
        </div>
      </div>

      {/* Per-course Progress */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Course Progress</h2>
        {courseProgressData.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No enrolled courses yet.</p>
        ) : (
          <div className="space-y-6">
            {courseProgressData.map((sp) => (
              <div key={sp.courseId}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{sp.courseName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sp.completedModules} of {sp.totalModules} modules completed</p>
                  </div>
                </div>
                <ProgressBar value={sp.progress} size="md" color={sp.progress >= 70 ? 'green' : sp.progress >= 40 ? 'blue' : 'orange'} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Achievements & Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                badge.unlocked
                  ? 'glass-card card-hover'
                  : 'bg-gray-100 dark:bg-dark-800 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl block mb-2">{badge.emoji}</span>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{badge.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
              {!badge.unlocked && <span className="text-xs text-gray-400 mt-1 block">🔒 Locked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
