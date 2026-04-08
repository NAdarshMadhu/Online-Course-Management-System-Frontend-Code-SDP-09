import StatsCard from '../../components/StatsCard';
import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineTrendingUp, HiOutlineClipboardCheck, HiOutlineClipboardList } from 'react-icons/hi';
import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseProgress } from '../../utils/progressUtils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { courseList: courses } = useCourses();
  const { studentsList } = useStudents();
  const { assignmentsList } = useAssignments();

  const totalStudents = studentsList.length;
  const activeCourses = courses.filter((c) => c.status === 'active').length;
  const draftCourses = courses.filter((c) => c.status === 'draft').length;
  const totalAssignments = assignmentsList.length;
  const submittedAssignments = assignmentsList.filter((a) => a.status === 'submitted').length;
  const gradedAssignments = assignmentsList.filter((a) => a.status === 'graded').length;
  const pendingAssignments = assignmentsList.filter((a) => a.status === 'pending').length;

  // Compute enrollments per course
  const courseEnrollments = courses.map((course) => {
    const count = studentsList.filter((s) => s.enrolledCourses?.includes(course.id)).length;
    return { ...course, realEnrolled: count };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Educator Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}! Here's your platform overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HiOutlineAcademicCap} title="Total Courses" value={courses.length} trend={`${activeCourses} active, ${draftCourses} draft`} trendUp color="primary" />
        <StatsCard icon={HiOutlineUserGroup} title="Total Students" value={totalStudents} trend={totalStudents > 0 ? 'Registered via signup' : 'No signups yet'} trendUp={totalStudents > 0} color="blue" />
        <StatsCard icon={HiOutlineClipboardList} title="Assignments" value={totalAssignments} trend={submittedAssignments > 0 ? `${submittedAssignments} awaiting review` : 'None submitted'} trendUp={submittedAssignments > 0} color="orange" />
        <StatsCard icon={HiOutlineClipboardCheck} title="Graded" value={gradedAssignments} trend={totalAssignments > 0 ? `${pendingAssignments} pending` : 'Create assignments'} trendUp={gradedAssignments > 0} color="green" />
      </div>

      {/* Quick Actions + Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Create Course', to: '/admin/create-course', emoji: '📝', color: 'from-primary-500 to-primary-600' },
              { label: 'Manage Courses', to: '/admin/manage-courses', emoji: '📚', color: 'from-emerald-500 to-emerald-600' },
              { label: 'Assignments', to: '/admin/assignments', emoji: '📋', color: 'from-orange-500 to-orange-600' },
              { label: 'Track Progress', to: '/admin/track-progress', emoji: '📊', color: 'from-blue-500 to-blue-600' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
              >
                <span className="text-2xl block mb-2">{action.emoji}</span>
                <span className="text-sm font-semibold">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Students</h2>
            <Link to="/admin/students" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {studentsList.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No students registered yet.</p>
            ) : (
              studentsList.slice(-5).reverse().map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{student.enrolledCourses?.length || 0} courses</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Course Enrollments + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Enrollments */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Enrollments</h2>
          {courseEnrollments.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No courses created yet.</p>
          ) : (
            <div className="space-y-3">
              {courseEnrollments.map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(course.title || 'C').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{course.title || course.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{course.realEnrolled} students enrolled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-bg rounded-full"
                        style={{ width: `${Math.min(100, course.realEnrolled * 10)}%` }}
                      />
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${course.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
            <Link to="/admin/assignments" className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">View All</Link>
          </div>
          {assignmentsList.filter((a) => a.status === 'submitted' || a.status === 'graded').length === 0 ? (
            <p className="text-center text-gray-400 py-6">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {assignmentsList
                .filter((a) => a.status === 'submitted' || a.status === 'graded')
                .slice(-5)
                .reverse()
                .map((a) => {
                  const course = courses.find((c) => c.id === a.courseId);
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${a.status === 'graded' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                        {a.status === 'graded' ? '✅' : '📤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{a.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course?.title?.split(' ').slice(0, 3).join(' ')}
                          {a.fileName && <span> · 📎 {a.fileName}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        {a.marks !== null && a.marks !== undefined ? (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{a.marks}/{a.maxMarks}</span>
                        ) : (
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Needs review</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
