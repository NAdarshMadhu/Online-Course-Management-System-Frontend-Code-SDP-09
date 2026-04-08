import StatsCard from '../../components/StatsCard';
import CourseCard from '../../components/CourseCard';
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineClipboardList, HiOutlineChartBar } from 'react-icons/hi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CoursesContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { useStudents } from '../../context/StudentsContext';
import { getCourseProgress, getAverageProgress } from '../../utils/progressUtils';

const BATCH_OPTIONS = ['All', 'Y24', 'Y25', 'Y26'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courseList: courses } = useCourses();
  const { assignmentsList: assignments } = useAssignments();
  const { studentsList } = useStudents();
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Find the logged-in student from StudentsContext
  const currentStudent = studentsList.find(
    (s) => s.email === user?.email
  );
  const enrolledIds = currentStudent?.enrolledCourses || [];
  const allEnrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));
  const enrolledCourses = selectedBatch === 'All'
    ? allEnrolledCourses
    : allEnrolledCourses.filter((c) => c.batch === selectedBatch);

  // Real stats from assignments
  const enrolledAssignments = assignments.filter((a) => enrolledIds.includes(a.courseId));
  const pendingAssignments = enrolledAssignments.filter((a) => a.status === 'pending').length;

  // Real progress from module completion
  const avgProgress = getAverageProgress(enrolledCourses);
  const completedCourses = enrolledCourses.filter((c) => getCourseProgress(c.id, c.curriculum?.length || 0) === 100).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Student Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}! Keep up the great work. 🚀</p>
      </div>

      {/* Batch Year Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-800 rounded-xl mb-6 w-fit">
        {BATCH_OPTIONS.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBatch(b)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${selectedBatch === b
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {b === 'All' ? '📋 All' : `📅 ${b}`}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HiOutlineAcademicCap} title="Enrolled Courses" value={enrolledCourses.length} trend={`${completedCourses} completed`} trendUp color="primary" />
        <StatsCard icon={HiOutlineClock} title="In Progress" value={enrolledCourses.length - completedCourses} trend={`of ${enrolledCourses.length} courses`} trendUp color="blue" />
        <StatsCard icon={HiOutlineClipboardList} title="Pending Assignments" value={pendingAssignments} trend="Due soon" color="orange" />
        <StatsCard icon={HiOutlineChartBar} title="Avg Progress" value={`${avgProgress}%`} trend="Based on modules completed" trendUp color="green" />
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
        {enrolledCourses.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <span className="text-4xl block mb-4">📚</span>
            <p className="text-gray-400 font-medium">You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} enrolled progress={getCourseProgress(course.id, course.curriculum?.length || 0)} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Assignments */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Assignments</h2>
        <div className="space-y-3">
          {enrolledAssignments.filter((a) => a.status === 'pending').map((a) => {
            const course = courses.find((c) => c.id === a.courseId);
            return (
              <div key={a.id} className="glass-card p-4 flex items-center gap-4 card-hover">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{course?.title || course?.name} · Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Pending
                </span>
              </div>
            );
          })}
          {enrolledAssignments.filter((a) => a.status === 'pending').length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-400">No pending assignments. You're all caught up! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
