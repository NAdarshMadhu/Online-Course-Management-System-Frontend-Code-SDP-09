import { useState } from 'react';
import { useStudents } from '../../context/StudentsContext';
import { useCourses } from '../../context/CoursesContext';
import {
  HiOutlineSearch, HiOutlineMail, HiOutlineAcademicCap,
  HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiX,
} from 'react-icons/hi';

const emptyForm = { name: '', email: '', enrolledCourses: [] };

export default function StudentsList() {
  const { studentsList, addStudent: addStudentToCtx, updateStudent: updateStudentInCtx, deleteStudent: deleteStudentFromCtx } = useStudents();
  const { courseList: courses } = useCourses();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getCourseName = (id) => courses.find((c) => c.id === id)?.title || 'Unknown';



  // Open modal for adding
  const handleAdd = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      enrolledCourses: [...student.enrolledCourses],
    });
    setShowModal(true);
  };

  // Save (add or edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingStudent) {
      updateStudentInCtx(editingStudent.id, {
        name: form.name,
        email: form.email,
        enrolledCourses: form.enrolledCourses,
      });
    } else {
      addStudentToCtx({
        name: form.name,
        email: form.email,
        enrolledCourses: form.enrolledCourses,
      });
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditingStudent(null);
  };

  // Delete student
  const handleDelete = (id) => {
    deleteStudentFromCtx(id);
    setDeleteConfirm(null);
  };

  // Toggle course enrollment in form
  const toggleCourse = (courseId) => {
    setForm((prev) => ({
      ...prev,
      enrolledCourses: prev.enrolledCourses.includes(courseId)
        ? prev.enrolledCourses.filter((id) => id !== courseId)
        : [...prev.enrolledCourses, courseId],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track all enrolled students on the platform.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-semibold self-start"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Stats Row */}
      <div className="glass-card p-4 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
          <HiOutlineAcademicCap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentsList.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Students Table / Cards */}
      <div className="glass-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Student</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Courses</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.enrolledCourses.map((cid) => (
                        <span
                          key={cid}
                          className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium"
                          title={getCourseName(cid)}
                        >
                          {getCourseName(cid).split(' ').slice(0, 2).join(' ')}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Edit student"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(student.id)}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete student"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-dark-800">
          {filtered.map((student) => (
            <div key={student.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <HiOutlineMail className="w-3 h-3" /> {student.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {student.enrolledCourses.map((cid) => (
                  <span
                    key={cid}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium"
                  >
                    {getCourseName(cid).split(' ').slice(0, 2).join(' ')}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleEdit(student)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(student.id)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-lg">No students found.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

      {/* ==================== ADD / EDIT MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kavya Nair"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. kavya@student.eduflow.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>



              {/* Enrolled Courses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enrolled Courses</label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.enrolledCourses.includes(course.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600'
                          : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.enrolledCourses.includes(course.id)}
                        onChange={() => toggleCourse(course.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{course.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 text-sm font-semibold"
                >
                  {editingStudent ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION ==================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-dark-900 rounded-2xl shadow-2xl animate-fade-in p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <HiOutlineTrash className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Student?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
              This action cannot be undone. The student will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
