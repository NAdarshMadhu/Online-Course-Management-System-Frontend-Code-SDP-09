import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'ocms_students';
const VERSION_KEY = 'ocms_students_v';
const CURRENT_VERSION = '2'; // Bump to clear old dummy data

const StudentsContext = createContext(null);

function loadStudents() {
  try {
    // If version mismatch, clear old data
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

export function StudentsProvider({ children }) {
  const [studentsList, setStudentsList] = useState(loadStudents);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsList));
  }, [studentsList]);

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      name: studentData.name,
      email: studentData.email,
      enrolledCourses: studentData.enrolledCourses || [],
      progress: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      avatar: null,
    };
    setStudentsList((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudentsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (id) => {
    setStudentsList((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudentsContext.Provider value={{ studentsList, addStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentsContext.Provider>
  );
}

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) throw new Error('useStudents must be used within StudentsProvider');
  return context;
};
