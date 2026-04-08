import { useParams, Link } from 'react-router-dom';
import { HiStar, HiOutlineClock, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineGlobeAlt, HiOutlineCheckCircle, HiOutlinePlay } from 'react-icons/hi';
import { useCourses } from '../context/CoursesContext';
import { useStudents } from '../context/StudentsContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { courseList: courses } = useCourses();
  const { studentsList, updateStudent, addStudent } = useStudents();
  const { user, isAuthenticated } = useAuth();
  const course = courses.find((c) => c.id === Number(id));
  const [activeModule, setActiveModule] = useState(null);

  // Find current student and check enrollment
  const currentStudent = isAuthenticated && user?.role === 'student'
    ? studentsList.find((s) => s.email === user.email)
    : null;
  const isEnrolled = currentStudent?.enrolledCourses?.includes(Number(id));

  const handleEnroll = () => {
    if (!isAuthenticated || user?.role !== 'student') return;
    if (isEnrolled) return;

    if (currentStudent) {
      updateStudent(currentStudent.id, {
        enrolledCourses: [...(currentStudent.enrolledCourses || []), Number(id)],
      });
    } else {
      addStudent({ name: user.name || user.email.split('@')[0], email: user.email, enrolledCourses: [Number(id)] });
    }
  };

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
          <Link to="/" className="btn-primary inline-block mt-4">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 text-white animate-fade-in">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">{course.category}</span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">{course.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">{course.title}</h1>
              <p className="text-white/80 text-lg mt-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-white/70">
                <span className="flex items-center gap-1"><HiStar className="w-5 h-5 text-yellow-400" /><strong className="text-white">{course.rating}</strong> ({course.reviews?.toLocaleString('en-IN')} reviews)</span>
                <span className="flex items-center gap-1"><HiOutlineUserGroup className="w-5 h-5" />{course.enrolled?.toLocaleString('en-IN')} students</span>
                <span className="flex items-center gap-1"><HiOutlineClock className="w-5 h-5" />{course.duration}</span>
                <span className="flex items-center gap-1"><HiOutlineGlobeAlt className="w-5 h-5" />{course.language}</span>
              </div>
              <p className="text-white/70 text-sm mt-4">Created by <strong className="text-white">{course.instructor}</strong></p>
            </div>

            {/* Enroll Card */}
            <div className="glass-card p-6 h-fit animate-slide-up bg-white dark:bg-dark-800">
              {isAuthenticated && user?.role === 'student' ? (
                isEnrolled ? (
                  <>
                    <span className="block w-full text-center py-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-base font-semibold">
                      ✅ Enrolled
                    </span>
                    <Link to="/student/courses" className="btn-secondary w-full text-center block mt-3 py-3">
                      Go to My Courses
                    </Link>
                  </>
                ) : (
                  <>
                    <button onClick={handleEnroll} className="btn-primary w-full text-center block py-3.5 text-base">
                      Enroll Now
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">Free · Instant access</p>
                  </>
                )
              ) : (
                <>
                  <Link to="/signup" className="btn-primary w-full text-center block py-3.5 text-base">
                    Sign Up to Enroll
                  </Link>
                  <Link to="/login" className="btn-secondary w-full text-center block mt-3 py-3">
                    Already have an account? Login
                  </Link>
                </>
              )}
              <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2"><HiOutlineClock className="w-4 h-4" />{course.duration} of content</div>
                <div className="flex items-center gap-2"><HiOutlineAcademicCap className="w-4 h-4" />{course.modules} modules</div>
                <div className="flex items-center gap-2"><HiOutlineCheckCircle className="w-4 h-4" />Certificate of completion</div>
                <div className="flex items-center gap-2"><HiOutlineGlobeAlt className="w-4 h-4" />Lifetime access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Course Curriculum</h2>
        <div className="space-y-3">
          {course.curriculum?.map((module) => (
            <div key={module.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${module.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-dark-700 text-gray-400'}`}>
                    {module.completed ? <HiOutlineCheckCircle className="w-5 h-5" /> : <HiOutlinePlay className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{module.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{module.lessons} lessons · {module.duration}</p>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${activeModule === module.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeModule === module.id && (
                <div className="px-4 pb-4 animate-slide-up">
                  <div className="pl-11 space-y-2">
                    {[...Array(module.lessons)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-1">
                        <HiOutlinePlay className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Lesson {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
