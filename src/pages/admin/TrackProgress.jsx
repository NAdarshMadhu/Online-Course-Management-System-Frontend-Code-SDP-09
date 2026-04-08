import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { getCourseProgress, getModuleCompletion } from '../../utils/progressUtils';

export default function TrackProgress() {
  const { courseList: courses } = useCourses();
  const { studentsList: students } = useStudents();
  const { assignmentsList } = useAssignments();

  // Compute real progress per student based on their module completion
  const getStudentProgress = (student) => {
    const enrolledCourses = courses.filter((c) => student.enrolledCourses?.includes(c.id));
    if (enrolledCourses.length === 0) return 0;
    const total = enrolledCourses.reduce((sum, c) => {
      return sum + getCourseProgress(c.id, c.curriculum?.length || 0);
    }, 0);
    return Math.round(total / enrolledCourses.length);
  };

  // Get assignment stats for a student
  const getStudentAssignmentStats = (student) => {
    const enrolledIds = student.enrolledCourses || [];
    const studentAssignments = assignmentsList.filter((a) => enrolledIds.includes(a.courseId));
    return {
      total: studentAssignments.length,
      submitted: studentAssignments.filter((a) => a.status === 'submitted').length,
      graded: studentAssignments.filter((a) => a.status === 'graded').length,
      pending: studentAssignments.filter((a) => a.status === 'pending').length,
    };
  };

  // Get module completion details for a student
  const getStudentModuleStats = (student) => {
    const enrolledCourses = courses.filter((c) => student.enrolledCourses?.includes(c.id));
    let totalModules = 0;
    let completedModules = 0;
    enrolledCourses.forEach((c) => {
      const len = c.curriculum?.length || 0;
      totalModules += len;
      completedModules += getModuleCompletion(c.id, len).filter(Boolean).length;
    });
    return { totalModules, completedModules };
  };

  // Summary stats
  const totalEnrollments = students.reduce((sum, s) => sum + (s.enrolledCourses?.length || 0), 0);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Track Student Progress</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">Comprehensive view of student enrollment, module completion, and assignments.</p>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-gray-900 dark:text-white">{students.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Students</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-primary-600 dark:text-primary-400">{totalEnrollments}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Enrollments</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{assignmentsList.filter((a) => a.status === 'submitted').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting Review</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{assignmentsList.filter((a) => a.status === 'graded').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Graded</p>
        </div>
      </div>

      {/* Student Details */}
      {students.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-4">👥</span>
          <p className="text-gray-400 text-lg">No students registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {students.map((student) => {
            const progress = getStudentProgress(student);
            const aStats = getStudentAssignmentStats(student);
            const mStats = getStudentModuleStats(student);
            const enrolledCourses = courses.filter((c) => student.enrolledCourses?.includes(c.id));

            return (
              <div key={student.id} className="glass-card overflow-hidden">
                {/* Student Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-gray-900 dark:text-white truncate">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3 sm:w-48">
                    <div className="flex-1 h-2.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 70 ? 'bg-emerald-500' : progress >= 40 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">{progress}%</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Enrolled Courses */}
                  <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Enrolled Courses ({enrolledCourses.length})</p>
                    {enrolledCourses.length === 0 ? (
                      <p className="text-xs text-gray-400">No courses</p>
                    ) : (
                      <div className="space-y-1.5">
                        {enrolledCourses.map((c) => {
                          const cp = getCourseProgress(c.id, c.curriculum?.length || 0);
                          return (
                            <div key={c.id} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{(c.title || c.name || '').split(' ').slice(0, 3).join(' ')}</span>
                              <span className={`text-xs font-bold ${cp >= 70 ? 'text-emerald-600' : cp >= 40 ? 'text-blue-600' : 'text-orange-500'}`}>{cp}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Module Progress */}
                  <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Modules</p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{mStats.completedModules}<span className="text-sm font-normal text-gray-400">/{mStats.totalModules}</span></p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">modules completed</p>
                  </div>

                  {/* Assignment Status */}
                  <div className="bg-gray-50 dark:bg-dark-800 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assignments ({aStats.total})</p>
                    {aStats.total === 0 ? (
                      <p className="text-xs text-gray-400">No assignments</p>
                    ) : (
                      <div className="flex gap-2">
                        {aStats.pending > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            {aStats.pending} pending
                          </span>
                        )}
                        {aStats.submitted > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {aStats.submitted} submitted
                          </span>
                        )}
                        {aStats.graded > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {aStats.graded} graded
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
