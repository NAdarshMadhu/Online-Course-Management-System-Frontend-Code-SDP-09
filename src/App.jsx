import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateCourse from './pages/admin/CreateCourse';
import ManageCourses from './pages/admin/ManageCourses';
import UploadContent from './pages/admin/UploadContent';
import TrackProgress from './pages/admin/TrackProgress';
import StudentsList from './pages/admin/StudentsList';
import ManageAssignments from './pages/admin/ManageAssignments';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import EnrolledCourses from './pages/student/EnrolledCourses';
import CourseViewer from './pages/student/CourseViewer';
import AssignmentSubmission from './pages/student/AssignmentSubmission';


function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="manage-courses" element={<ManageCourses />} />
        <Route path="upload-content" element={<UploadContent />} />
        <Route path="track-progress" element={<TrackProgress />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="assignments" element={<ManageAssignments />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<EnrolledCourses />} />
        <Route path="viewer" element={<CourseViewer />} />
        <Route path="assignments" element={<AssignmentSubmission />} />

      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
