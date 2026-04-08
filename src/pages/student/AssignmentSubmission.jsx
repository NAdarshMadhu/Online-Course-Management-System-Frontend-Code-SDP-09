import { useState } from 'react';
import { useAssignments } from '../../context/AssignmentsContext';
import { useCourses } from '../../context/CoursesContext';
import { useStudents } from '../../context/StudentsContext';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUpload, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

export default function AssignmentSubmission() {
  const { courseList: courses } = useCourses();
  const { assignmentsList, submitAssignment } = useAssignments();
  const { studentsList } = useStudents();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Only show assignments for courses this student is enrolled in
  const currentStudent = studentsList.find((s) => s.email === user?.email);
  const enrolledIds = currentStudent?.enrolledCourses || [];
  const myAssignments = assignmentsList.filter((a) => enrolledIds.includes(a.courseId));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = (id) => {
    if (!selectedFile) return;
    setUploading(true);
    setTimeout(() => {
      submitAssignment(id, selectedFile.name);
      setUploading(false);
      setSelectedId(null);
      setSelectedFile(null);
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedId(null);
    setSelectedFile(null);
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: '⏳', label: 'Pending' },
    submitted: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '📤', label: 'Submitted' },
    graded: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '✅', label: 'Graded' },
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Assignments</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8">Submit your assignments and track grades.</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', count: myAssignments.filter((a) => a.status === 'pending').length, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Submitted', count: myAssignments.filter((a) => a.status === 'submitted').length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Graded', count: myAssignments.filter((a) => a.status === 'graded').length, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Assignment List */}
      {myAssignments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-4">📋</span>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No assignments yet.</p>
          <p className="text-gray-400 text-sm mt-1">Your educator hasn't created any assignments for your courses.</p>
        </div>
      ) : (
      <div className="space-y-4">
        {myAssignments.map((a) => {
          const course = courses.find((c) => c.id === a.courseId);
          const status = statusConfig[a.status];

          return (
            <div key={a.id} className="glass-card overflow-hidden card-hover">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{a.title}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">📚 {course?.title?.split(' ').slice(0, 4).join(' ')}</span>
                      <span className="flex items-center gap-1"><HiOutlineClock className="w-3.5 h-3.5" /> Due: {new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span>Max: {a.maxMarks} marks</span>
                      {a.marks !== null && a.marks !== undefined && (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Score: {a.marks}/{a.maxMarks}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                {a.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                    {selectedId === a.id ? (
                      <div className="space-y-3 animate-slide-up">
                        {/* File Input Zone */}
                        <label className="block border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.zip,.rar,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          {selectedFile ? (
                            <div>
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedFile.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB · Click to change file</p>
                            </div>
                          ) : (
                            <div>
                              <HiOutlineUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 dark:text-gray-400">Click to select your file</p>
                              <p className="text-xs text-gray-400 mt-1">PDF, DOC, ZIP, PPT, Images up to 25MB</p>
                            </div>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSubmit(a.id)}
                            disabled={uploading || !selectedFile}
                            className="btn-primary text-sm !py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploading ? (
                              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                            ) : (
                              'Submit Assignment'
                            )}
                          </button>
                          <button onClick={handleCancel} className="btn-ghost text-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedId(a.id)} className="btn-primary text-sm !py-2">
                        Upload & Submit
                      </button>
                    )}
                  </div>
                )}

                {a.status === 'submitted' && a.submittedAt && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <HiOutlineCheckCircle className="w-4 h-4" />
                    Submitted on {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {a.fileName && <span className="text-gray-400">· 📎 {a.fileName}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
