import { useState } from 'react';
import { useAssignments } from '../../context/AssignmentsContext';
import { useCourses } from '../../context/CoursesContext';
import {
  HiOutlineCheckCircle, HiOutlineClock, HiOutlinePlusCircle,
  HiX, HiOutlineTrash,
} from 'react-icons/hi';

export default function ManageAssignments() {
  const { assignmentsList, addAssignment, gradeAssignment, deleteAssignment } = useAssignments();
  const { courseList: courses } = useCourses();
  const [showCreate, setShowCreate] = useState(false);
  const [gradeModal, setGradeModal] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.courseId || !form.dueDate) return;
    addAssignment({ ...form, courseId: Number(form.courseId), maxMarks: Number(form.maxMarks) });
    setForm({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 });
    setShowCreate(false);
  };

  const handleGrade = () => {
    if (gradeModal && gradeInput !== '') {
      gradeAssignment(gradeModal.id, Number(gradeInput));
      setGradeModal(null);
      setGradeInput('');
    }
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: '⏳ Pending' },
    submitted: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: '📤 Submitted' },
    graded: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: '✅ Graded' },
  };

  const stats = [
    { label: 'Total', count: assignmentsList.length, color: 'text-gray-900 dark:text-white' },
    { label: 'Pending', count: assignmentsList.filter((a) => a.status === 'pending').length, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Submitted', count: assignmentsList.filter((a) => a.status === 'submitted').length, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Graded', count: assignmentsList.filter((a) => a.status === 'graded').length, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create, review, and grade student assignments.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold self-start"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          New Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignmentsList.map((a) => {
          const course = courses.find((c) => c.id === a.courseId);
          const status = statusConfig[a.status];
          return (
            <div key={a.id} className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{a.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  {a.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>📚 {course?.title?.split(' ').slice(0, 4).join(' ') || 'Unknown'}</span>
                    <span className="flex items-center gap-1">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>Max: {a.maxMarks} marks</span>
                    {a.submittedAt && (
                      <span className="text-blue-500">Submitted: {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    )}
                    {a.fileName && (
                      <span className="text-purple-500 font-medium">📎 {a.fileName}</span>
                    )}
                    {a.marks !== null && a.marks !== undefined && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Score: {a.marks}/{a.maxMarks}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {a.status === 'submitted' && (
                    <button
                      onClick={() => { setGradeModal(a); setGradeInput(''); }}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      Grade
                    </button>
                  )}
                  <button
                    onClick={() => deleteAssignment(a.id)}
                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {assignmentsList.length === 0 && (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-400 text-lg">No assignments yet.</p>
            <p className="text-gray-400 text-sm mt-1">Create your first assignment above.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">➕ New Assignment</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Build a Todo App"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Assignment description..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Course</label>
                <select
                  required
                  value={form.courseId}
                  onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Marks</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.maxMarks}
                    onChange={(e) => setForm((f) => ({ ...f, maxMarks: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-2.5 text-sm font-semibold">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setGradeModal(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-dark-900 rounded-2xl shadow-2xl animate-fade-in p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Grade Assignment</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{gradeModal.title}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Marks (out of {gradeModal.maxMarks})
              </label>
              <input
                type="number"
                min={0}
                max={gradeModal.maxMarks}
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                placeholder="Enter marks"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setGradeModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGrade}
                className="flex-1 btn-primary py-2.5 text-sm font-semibold"
              >
                Save Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
