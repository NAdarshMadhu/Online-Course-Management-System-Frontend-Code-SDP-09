/**
 * Shared utility to compute course progress from module completion
 * stored in localStorage by the CourseViewer.
 */

/**
 * Get the completion array for a given course from localStorage.
 * Returns an array of booleans, one per curriculum module.
 */
export function getModuleCompletion(courseId, curriculumLength) {
  try {
    const stored = localStorage.getItem(`ocms_completed_${courseId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === curriculumLength) return parsed;
    }
  } catch (e) { /* ignore */ }
  return new Array(curriculumLength).fill(false);
}

/**
 * Compute progress percentage (0–100) for a single course.
 */
export function getCourseProgress(courseId, curriculumLength) {
  if (!curriculumLength || curriculumLength === 0) return 0;
  const completed = getModuleCompletion(courseId, curriculumLength);
  const done = completed.filter(Boolean).length;
  return Math.round((done / curriculumLength) * 100);
}

/**
 * Compute average progress across multiple courses.
 */
export function getAverageProgress(courses) {
  if (!courses || courses.length === 0) return 0;
  const total = courses.reduce((sum, c) => {
    return sum + getCourseProgress(c.id, c.curriculum?.length || 0);
  }, 0);
  return Math.round(total / courses.length);
}
