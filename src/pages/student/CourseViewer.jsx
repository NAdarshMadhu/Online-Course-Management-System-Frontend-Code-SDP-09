import { useState, useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAuth } from '../../context/AuthContext';

// Helper to load/save completed modules per course
function loadCompleted(courseId, length) {
  try {
    const stored = localStorage.getItem(`ocms_completed_${courseId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === length) return parsed;
    }
  } catch (e) { /* ignore */ }
  return new Array(length).fill(false);
}

function saveCompleted(courseId, completed) {
  localStorage.setItem(`ocms_completed_${courseId}`, JSON.stringify(completed));
}

export default function CourseViewer() {
  const { courseList: courses } = useCourses();
  const { studentsList } = useStudents();
  const { user } = useAuth();

  // Get enrolled courses for this student
  const currentStudent = studentsList.find((s) => s.email === user?.email);
  const enrolledIds = currentStudent?.enrolledCourses || [];
  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));

  // Fall back to first course if no enrolled courses
  const availableCourses = enrolledCourses.length > 0 ? enrolledCourses : courses.slice(0, 1);

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const course = availableCourses[selectedCourseIndex] || availableCourses[0];

  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(
    loadCompleted(course?.id, course?.curriculum?.length || 0)
  );

  // When switching courses, load that course's saved completion state
  const handleCourseChange = (index) => {
    setSelectedCourseIndex(index);
    const newCourse = availableCourses[index];
    setActiveModule(0);
    setCompletedModules(loadCompleted(newCourse?.id, newCourse?.curriculum?.length || 0));
  };

  const toggleComplete = (index) => {
    setCompletedModules((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      saveCompleted(course?.id, next);
      return next;
    });
  };

  if (!course || !course.curriculum || course.curriculum.length === 0) {
    return (
      <div className="animate-fade-in text-center py-20">
        <span className="text-5xl block mb-4">📺</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Course Content</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Enroll in a course to start watching lessons.</p>
      </div>
    );
  }

  const currentModule = course.curriculum[activeModule];
  const progress = Math.round((completedModules.filter(Boolean).length / completedModules.length) * 100);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Course Viewer</h1>

        {/* Course Selector */}
        {availableCourses.length > 1 && (
          <select
            value={selectedCourseIndex}
            onChange={(e) => handleCourseChange(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition max-w-xs"
          >
            {availableCourses.map((c, i) => (
              <option key={c.id} value={i}>{c.title || c.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card overflow-hidden">
            {/* YouTube Embed */}
            <div className="aspect-video bg-black relative">
              {currentModule?.videoId ? (
                <iframe
                  key={currentModule.videoId}
                  src={`https://www.youtube.com/embed/${currentModule.videoId}?rel=0`}
                  title={currentModule.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-950">
                  <p className="text-white/60 text-sm">No video available for this module</p>
                </div>
              )}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentModule?.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentModule?.lessons} lessons · {currentModule?.duration}</p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                  disabled={activeModule === 0}
                  className="btn-ghost disabled:opacity-30 flex items-center gap-1"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button
                  onClick={() => toggleComplete(activeModule)}
                  className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${completedModules[activeModule]
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'btn-primary'
                  }`}
                >
                  {completedModules[activeModule] ? '✅ Completed' : 'Mark as Complete'}
                </button>
                <button
                  onClick={() => setActiveModule(Math.min(course.curriculum.length - 1, activeModule + 1))}
                  disabled={activeModule === course.curriculum.length - 1}
                  className="btn-ghost disabled:opacity-30 flex items-center gap-1"
                >
                  Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Module Sidebar */}
        <div className="glass-card p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Modules</h3>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full mb-4">
            <div className="h-full gradient-bg rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-1">
            {course.curriculum.map((module, i) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 text-sm
                  ${i === activeModule
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-400'
                  }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  completedModules[i]
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : i === activeModule
                      ? 'gradient-bg text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-400'
                }`}>
                  {completedModules[i] ? <HiOutlineCheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${i === activeModule ? 'text-primary-700 dark:text-primary-300' : ''}`}>{module.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{module.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
