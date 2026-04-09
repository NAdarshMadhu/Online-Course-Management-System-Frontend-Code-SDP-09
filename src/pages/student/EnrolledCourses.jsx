import { useState } from 'react';
import CourseCard from '../../components/CourseCard';
import SearchBar from '../../components/SearchBar';
import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAuth } from '../../context/AuthContext';
import { getCourseProgress } from '../../utils/progressUtils';

const BATCH_OPTIONS = ['All', 'Y24', 'Y25', 'Y26'];

export default function EnrolledCourses() {
  const { courseList: courses } = useCourses();
  const { studentsList } = useStudents();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  

  // Find logged-in student and their enrolled courses
  const currentStudent = studentsList.find((s) => s.email === user?.email);
  const enrolledIds = currentStudent?.enrolledCourses || [];
  const enrolled = courses.filter((c) => enrolledIds.includes(c.id));
  const batchFiltered = selectedBatch === 'All'
    ? enrolled
    : enrolled.filter((c) => c.batch === selectedBatch);

  const filtered = batchFiltered.filter((c) => {
    const matchesSearch = (c.title || c.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">My Courses</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">{filtered.length} courses enrolled</p>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((course, i) => (
          <CourseCard key={course.id} course={course} enrolled progress={getCourseProgress(course.id, course.curriculum?.length || 0)} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <span className="text-4xl block mb-4">📚</span>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {enrolled.length === 0 ? "You haven't enrolled in any courses yet." : 'No courses match your search.'}
          </p>
        </div>
      )}
    </div>
  );
}
