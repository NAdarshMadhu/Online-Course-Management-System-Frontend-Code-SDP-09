import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'ocms_assignments';
const VERSION_KEY = 'ocms_assignments_v';
const CURRENT_VERSION = '2'; // Bump to clear old dummy data

const AssignmentsContext = createContext(null);

function loadAssignments() {
  try {
    if (localStorage.getItem(VERSION_KEY) !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return [];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return [];
}

export function AssignmentsProvider({ children }) {
  const [assignmentsList, setAssignmentsList] = useState(loadAssignments);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignmentsList));
  }, [assignmentsList]);

  const addAssignment = (data) => {
    const newAssignment = {
      id: Date.now(),
      courseId: data.courseId,
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate,
      maxMarks: data.maxMarks || 100,
      status: 'pending',
      marks: null,
      submittedAt: null,
    };
    setAssignmentsList((prev) => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id, updates) => {
    setAssignmentsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id) => {
    setAssignmentsList((prev) => prev.filter((a) => a.id !== id));
  };

  const submitAssignment = (id, fileName) => {
    setAssignmentsList((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'submitted', submittedAt: new Date().toISOString().split('T')[0], fileName: fileName || null }
          : a
      )
    );
  };

  const gradeAssignment = (id, marks) => {
    setAssignmentsList((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'graded', marks } : a
      )
    );
  };

  return (
    <AssignmentsContext.Provider
      value={{ assignmentsList, addAssignment, updateAssignment, deleteAssignment, submitAssignment, gradeAssignment }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

export const useAssignments = () => {
  const context = useContext(AssignmentsContext);
  if (!context) throw new Error('useAssignments must be used within AssignmentsProvider');
  return context;
};
