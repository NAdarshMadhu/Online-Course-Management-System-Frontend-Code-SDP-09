import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const CoursesContext = createContext();
const STORAGE_KEY = "ocms_courses";

export const useCourses = () => useContext(CoursesContext);

export const CoursesProvider = ({ children }) => {
  // ✅ Initialize from localStorage so courses survive refresh
  const [courseList, setCourseList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const initialLoadDone = useRef(false);

  // ✅ Normalize data from backend to frontend format
  const normalizeCourse = (course) => ({
    id: course.courseId || course.id,
    title: course.courseName || course.name || course.title,
    instructor: course.instructor,
    batch: course.batchYear || course.batch
  });

  // ✅ Fetch courses from MySQL backend on load
  useEffect(() => {
    axios.get("http://localhost:8080/courses")
      .then(res => {
        const normalized = res.data.map(normalizeCourse);
        setCourseList(normalized);
        initialLoadDone.current = true;
      })
      .catch(err => {
        console.error("Error fetching courses from backend, using cached data:", err);
        initialLoadDone.current = true;
        // courseList already has localStorage data, so courses remain visible
      });
  }, []);

  // ✅ Persist to localStorage whenever courseList changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courseList));
  }, [courseList]);

  const addCourse = (course) => {
    setCourseList(prev => [...prev, normalizeCourse(course)]);
  };

  const updateCourse = (id, updatedData) => {
    setCourseList(prev =>
      prev.map(c =>
        c.id === id ? { ...c, ...updatedData } : c
      )
    );
  };

  const deleteCourse = (id) => {
    setCourseList(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CoursesContext.Provider value={{ courseList, addCourse, updateCourse, deleteCourse }}>
      {children}
    </CoursesContext.Provider>
  );
};