import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RightPanel } from './components/layout/RightPanel';
import { HelpModal } from './components/layout/HelpModal';
import { ToastContainer } from './components/common/ToastContainer';

// Public pages
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Dashboards
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

// Courses
import { CourseList } from './components/courses/CourseList';
import { CourseDetails } from './components/courses/CourseDetails';
import { LessonPage } from './components/courses/LessonPage';
import { CourseForm } from './components/courses/CourseForm';

// Materials
import { LearningMaterials } from './components/materials/LearningMaterials';

// Assignments & Submissions
import { TodoList } from './components/assignments/TodoList';
import { AssignmentDetails } from './components/assignments/AssignmentDetails';
import { AssignmentForm } from './components/assignments/AssignmentForm';
import { AssignmentSubmit } from './components/assignments/AssignmentSubmit';
import { SubmissionReview } from './components/assignments/SubmissionReview';

// Progress & Grades
import { MyGrades } from './components/progress/MyGrades';
import { MyProgress } from './components/progress/MyProgress';

// Admin Pages
import { PendingApprovals } from './components/admin/PendingApprovals';
import { UserManagement } from './components/admin/UserManagement';

// Announcements, Profile & Schedule
import { Announcements } from './components/announcements/Announcements';
import { Profile } from './components/profile/Profile';
import { AccountSettings } from './components/profile/AccountSettings';
import { SchedulePage } from './components/schedule/SchedulePage';

/* ---------- Route guards ---------- */

const getHomePathForRole = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'teacher') return '/teacher';
  return '/dashboard';
};

// Login / Register: logged-in users go straight to their dashboard.
const PublicOnly = ({ children }) => {
  const { currentUser } = useLMS();
  return currentUser ? <Navigate to={getHomePathForRole(currentUser.role)} replace /> : children;
};

// Everything inside the app shell needs a logged-in user.
const AppLayout = () => {
  const { currentUser } = useLMS();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-body antialiased selection:bg-gold/30">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Center Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Right Sidebar (Profile, Calendar, Schedule, Reminders) */}
      <RightPanel />

      <HelpModal />
    </div>
  );
};

// Only the listed roles may open the page; everyone else goes to their role's dashboard.
const RequireRole = ({ roles, children }) => {
  const { currentUser } = useLMS();
  return roles.includes(currentUser.role) ? (
    children
  ) : (
    <Navigate to={getHomePathForRole(currentUser.role)} replace />
  );
};

const RoleDashboardRedirect = () => {
  const { currentUser } = useLMS();
  return <Navigate to={getHomePathForRole(currentUser?.role)} replace />;
};

/* ---------- Routes ---------- */

const AppRoutes = () => (
  <>
    <Routes>
      {/* Public */}
      {/* CHANGED: the home page now goes straight to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      {/* Logged-in app */}
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={<RequireRole roles={['student']}><StudentDashboard /></RequireRole>}
        />
        <Route
          path="/teacher"
          element={<RequireRole roles={['teacher']}><TeacherDashboard /></RequireRole>}
        />
        <Route
          path="/admin"
          element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>}
        />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/course-details" element={<CourseDetails />} />
        <Route path="/course-lesson" element={<LessonPage />} />
        <Route
          path="/courses/new"
          element={<RequireRole roles={['teacher', 'admin']}><CourseForm /></RequireRole>}
        />

        <Route path="/materials" element={<LearningMaterials />} />

        <Route path="/todo" element={<TodoList />} />
        <Route path="/assignments" element={<TodoList />} />
        <Route path="/assignments/details" element={<AssignmentDetails />} />
        <Route
          path="/assignments/new"
          element={<RequireRole roles={['teacher', 'admin']}><AssignmentForm /></RequireRole>}
        />
        <Route path="/assignments/submit" element={<AssignmentSubmit />} />
        <Route
          path="/submissions"
          element={<RequireRole roles={['teacher', 'admin']}><SubmissionReview /></RequireRole>}
        />

        <Route
          path="/grades"
          element={<RequireRole roles={['student']}><MyGrades /></RequireRole>}
        />
        <Route
          path="/progress"
          element={<RequireRole roles={['student']}><MyProgress /></RequireRole>}
        />

        <Route
          path="/admin/approvals"
          element={<RequireRole roles={['admin']}><PendingApprovals /></RequireRole>}
        />
        <Route
          path="/admin/users"
          element={<RequireRole roles={['admin']}><UserManagement /></RequireRole>}
        />

        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/settings" element={<AccountSettings />} />

        {/* Unknown URL */}
        <Route path="*" element={<RoleDashboardRedirect />} />
      </Route>
    </Routes>

    <ToastContainer />
  </>
);

export default function App() {
  return (
    <LMSProvider>
      <AppRoutes />
    </LMSProvider>
  );
}