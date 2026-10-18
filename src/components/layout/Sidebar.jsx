import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  ListTodo,
  GraduationCap,
  TrendingUp,
  Bell,
  Users,
  ShieldCheck,
  Settings,
  User,
  LogOut,
  HelpCircle,
  PlusCircle,
  ClipboardList,
  Sparkles,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const {
    currentUser,
    assignments,
    submissions,
    activeTab,
    setActiveTab,
    logout,
    pendingApprovalsCount,
    pendingGradingCount,
    unreadAnnouncementsCount,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setHelpModalOpen,
  } = useLMS();

  if (!currentUser) return null;

  const role = currentUser.role;

  const studentTodoCount =
    role === 'student'
      ? assignments.filter((asg) => {
          const inEnrolledCourse =
            !currentUser.enrolledCourseIds?.length ||
            currentUser.enrolledCourseIds.includes(asg.courseId);
          const alreadySubmitted = submissions.some(
            (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
          );
          return inEnrolledCourse && !alreadySubmitted && asg.status !== 'Graded';
        }).length
      : null;

  // Define navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'courses', label: role === 'admin' ? 'All Courses' : 'My Courses', icon: BookOpen },
      {
        id: 'announcements',
        label: 'Announcements',
        icon: Bell,
        badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : null,
        badgeVariant: 'forest',
      },
      {
        id: 'assignments',
        label: 'To-Do',
        icon: ListTodo,
        badge: role === 'student' && studentTodoCount > 0 ? studentTodoCount : null,
      },
    ];

    if (role === 'student') {
      baseItems.push(
        { id: 'grades', label: 'My Grades', icon: GraduationCap },
        { id: 'progress', label: 'My Progress', icon: TrendingUp }
      );
    }

    if (role === 'teacher') {
      baseItems.push(
        { id: 'create-course', label: 'Create Course', icon: PlusCircle },
        { id: 'create-assignment', label: 'Create Assignment', icon: PlusCircle },
        {
          id: 'submissions',
          label: 'Submission Review',
          icon: ClipboardList,
          badge: pendingGradingCount > 0 ? pendingGradingCount : null,
          badgeVariant: 'gold',
        }
      );
    }

    if (role === 'admin') {
      baseItems.push(
        {
          id: 'approvals',
          label: 'Registration Approvals',
          icon: ShieldCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
          badgeVariant: 'gold',
        },
        { id: 'users', label: 'User Management', icon: Users }
      );
    }

    baseItems.push(
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'settings', label: 'Settings', icon: Settings }
    );

    return baseItems;
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-cream border-r border-charcoal/10 flex flex-col justify-between p-5 z-40 transition-transform duration-300 ease-in-out shrink-0 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-charcoal/10">
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-gold shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 fill-gold" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-forest font-heading">
                  Cache<span className="text-gold">Up</span>
                </span>
                <span className="block text-[10px] font-semibold text-charcoal-muted uppercase tracking-wider">
                  Academy LMS
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Indicator */}
          <div className="mt-4 px-3 py-2 rounded-xl bg-sage/15 border border-sage/30 flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-muted">Active Role</span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-forest text-cream">
              {role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gold text-charcoal shadow-sm shadow-gold/20 font-bold'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-charcoal' : 'text-charcoal-muted'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-charcoal text-cream'
                          : item.badgeVariant === 'gold'
                          ? 'bg-gold text-charcoal'
                          : 'bg-forest text-cream'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Help Center Card & Logout */}
        <div className="mt-8 pt-4 border-t border-charcoal/10 flex flex-col gap-3">
          {/* Help Center Dark Card (Inspiration UI replica) */}
          <div className="relative overflow-hidden rounded-2xl bg-charcoal p-4 text-cream text-center shadow-lg">
            <div className="w-8 h-8 mx-auto rounded-full bg-gold text-charcoal font-black flex items-center justify-center text-sm shadow mb-2">
              ?
            </div>
            <h5 className="text-xs font-bold font-heading text-cream">Help center</h5>
            <p className="text-[11px] text-cream/70 mt-1 leading-snug">
              Have a problem? Send us a message!
            </p>
            <button
              onClick={() => setHelpModalOpen(true)}
              className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white text-charcoal text-[11px] font-bold hover:bg-gold transition-colors shadow-sm"
            >
              Go to help center
            </button>
          </div>

          {/* Secure Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-red-700 hover:bg-red-50/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
