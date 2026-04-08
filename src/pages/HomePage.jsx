import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineGlobeAlt, HiOutlineShieldCheck, HiStar, HiArrowRight } from 'react-icons/hi';
import CourseCard from '../components/CourseCard';
import { testimonials } from '../data/dummyData';
import { useCourses } from '../context/CoursesContext';

const features = [
  { icon: HiOutlineAcademicCap, title: 'Expert Instructors', desc: 'Learn from industry professionals with years of real-world experience in top Indian tech companies.' },
  { icon: HiOutlineLightningBolt, title: 'Learn at Your Pace', desc: 'Self-paced courses with lifetime access. Study anytime, anywhere — on your phone or laptop.' },
  { icon: HiOutlineGlobeAlt, title: 'Hindi & English', desc: 'Courses available in Hindi and English to make learning accessible for every Indian student.' },
  { icon: HiOutlineShieldCheck, title: 'Certified Courses', desc: 'Get industry-recognised certificates upon completion to boost your resume and career prospects.' },
];


export default function HomePage() {
  const { courseList: courses } = useCourses();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJIMjR2LTJoMTJ6bTAtNHYySDI0di0yaDEyem0wLTR2Mkg0di0yaDMyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20">
              🎓 India's #1 Online Learning Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
              Learn Skills That
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                Shape Your Future
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Master in-demand tech skills with expert-led courses. From MERN Stack to Data Science — start your journey to a successful career today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-lg hover:bg-gray-100 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 shadow-xl"
              >
                Start Learning Free
              </Link>
              <Link
                to="/courses"
                className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 backdrop-blur-sm"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Why EduFlow?</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-3">
              Everything you need to <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">
              Our platform is designed to provide the best learning experience for students across India.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 text-center card-hover group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 bg-gray-50/50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div>
              <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Top Courses</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-2">
                Popular Courses
              </h2>
            </div>
            <Link to="/courses" className="mt-4 sm:mt-0 flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all">
              View All Courses <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-3">
              What Our Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id} className="glass-card p-6 card-hover" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <HiStar key={j} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-10 sm:p-16 text-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Transform Your Career?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Join 50,000+ students who are building their dream careers with EduFlow. Your first course is on us!
              </p>
              <Link
                to="/signup"
                className="inline-block px-10 py-4 rounded-2xl bg-white text-primary-700 font-bold text-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 shadow-xl"
              >
                Get Started for Free →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
