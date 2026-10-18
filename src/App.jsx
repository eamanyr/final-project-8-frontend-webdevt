import React from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { RightPanel } from './components/layout/RightPanel';
import { HelpModal } from './components/layout/HelpModal';
import { ToastContainer } from './components/common/ToastContainer';

// Auth Pages
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Dashboards
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

// Courses
import { CourseList } from './components/courses/CourseList';
import { CourseDetails } from './components/courses/CourseDetails';
import { CourseForm } from './components/courses/CourseForm';

// Materials
import { LearningMaterials } from './components/materials/LearningMaterials';

// Assignments & Submissions
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

// Announcements & Profile
import { Announcements } from './components/announcements/Announcements';
import { Profile } from './components/profile/Profile';
import { AccountSettings } from './components/profile/AccountSettings';

const MainAppContent = () => {
  const { currentUser, activeTab } = useLMS();

  // If unauthenticated
  if (!currentUser) {
    if (activeTab === 'register') {
      return (
        <>
          <Register />
          <ToastContainer />
        </>
      );
    }
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  // Render active main content view based on activeTab
  const renderContentView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'teacher') return <TeacherDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        return <StudentDashboard />;

      case 'courses':
        return <CourseList />;

      case 'course-details':
        return <CourseDetails />;

      case 'create-course':
        return <CourseForm />;

      case 'materials':
        return <LearningMaterials />;

      case 'assignments':
      case 'assignment-details':
        return <AssignmentDetails />;

      case 'create-assignment':
        return <AssignmentForm />;

      case 'assignment-submit':
        return <AssignmentSubmit />;

      case 'submissions':
        return <SubmissionReview />;

      case 'grades':
        return <MyGrades />;

      case 'progress':
        return <MyProgress />;

      case 'approvals':
        return <PendingApprovals />;

      case 'users':
        return <UserManagement />;

      case 'announcements':
        return <Announcements />;

      case 'profile':
        return <Profile />;

      case 'settings':
        return <AccountSettings />;

      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-body antialiased selection:bg-gold/30">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Center Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContentView()}
        </main>
      </div>

      {/* 3. Right Sidebar (Profile, Calendar, Schedule, Reminders) */}
      <RightPanel />

      {/* Reusable Modals & Global Toast feedback */}
      <HelpModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LMSProvider>
      <MainAppContent />
    </LMSProvider>
  );
}
