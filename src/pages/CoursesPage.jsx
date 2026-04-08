import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useStudents } from '../context/StudentsContext';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';

const BATCH_OPTIONS = ['All', 'Y24', 'Y25', 'Y26'];

export default function CoursesPage() {
  const { courseList: courses } = useCourses();
  const { studentsList, updateStudent, addStudent } = useStudents();
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');

  // Find current student
  const currentStudent = isAuthenticated && user?.role === 'student'
    ? studentsList.find((s) => s.email === user.email)
    : null;

  const batchFiltered = selectedBatch === 'All'
    ? courses
    : courses.filter((c) => c.batch === selectedBatch);

  const filtered = batchFiltered.filter((c) => {
    const matchesSearch = (c.title || c.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  const isEnrolled = (courseId) => currentStudent?.enrolledCourses?.includes(courseId);

  const handleEnroll = (e, courseId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || user?.role !== 'student') return;
    if (isEnrolled(courseId)) return;

    if (currentStudent) {
      updateStudent(currentStudent.id, {
        enrolledCourses: [...(currentStudent.enrolledCourses || []), courseId],
      });
    } else {
      addStudent({ name: user.name || user.email.split('@')[0], email: user.email, enrolledCourses: [courseId] });
    }

    alert('✅ Successfully enrolled!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">📚 All Courses</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">{filtered.length} courses available</p>

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

      <SearchBar onSearch={setSearch} onFilter={setFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((course, i) => (
          <div key={course.id} className="relative">
            <CourseCard course={course} index={i} />

            {/* Enroll button for logged-in students */}
            {isAuthenticated && user?.role === 'student' && (
              <div className="px-4 pb-4 -mt-1">
                {isEnrolled(course.id) ? (
                  <span className="block w-full text-center py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                    ✅ Enrolled
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleEnroll(e, course.id)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-600 text-white text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            )}

            {/* Show sign-up prompt for non-logged-in users */}
            {!isAuthenticated && (
              <div className="px-4 pb-4 -mt-1">
                <Link
                  to="/signup"
                  className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-600 text-white text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up to Enroll
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl block mb-4">🔍</span>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No courses found.</p>
        </div>
      )}
    </div>
  );
}