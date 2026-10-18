import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Search,
  Bell,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  UserCheck,
  CheckCircle,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Header = () => {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    switchDemoUser,
    announcements,
    unreadAnnouncementsCount,
    markAnnouncementAsRead,
    isRightPanelOpen,
    setIsRightPanelOpen,
    setIsMobileMenuOpen,
    resetDemoData,
    setActiveTab,
  } = useLMS();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const firstName = currentUser.name.split(' ')[0];

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-charcoal/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Hamburger + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white border border-charcoal/10 text-charcoal hover:bg-sage/10 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-charcoal font-heading tracking-tight flex items-center gap-1.5">
                Hello {firstName} <span className="inline-block animate-bounce">👋</span>
              </h1>
            </div>
            <p className="text-xs text-charcoal-muted font-normal mt-0.5">
              {currentUser.role === 'student'
                ? "Let's learn something new today!"
                : currentUser.role === 'teacher'
                ? 'Manage your academy courses and student feedback.'
                : 'Academy governance and administrative control.'}
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-0 md:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for classes, tasks, materials..."
              className="w-full bg-white border border-charcoal/15 rounded-full pl-10 pr-4 py-2 text-xs text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-muted hover:text-charcoal"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Demo Switcher + Notifications + Panel Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Demo Switcher Pills */}
          <div className="hidden sm:flex items-center bg-white border border-charcoal/10 rounded-full p-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-charcoal-muted px-2">
              Demo:
            </span>
            <button
              onClick={() => switchDemoUser('student')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                currentUser.role === 'student'
                  ? 'bg-forest text-cream shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchDemoUser('teacher')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                currentUser.role === 'teacher'
                  ? 'bg-forest text-cream shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => switchDemoUser('admin')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-forest text-cream shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="Reset to fresh demo data"
            className="p-2 rounded-full bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal hover:bg-gold/15 transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full bg-white border border-charcoal/10 text-charcoal hover:bg-sage/15 transition-all shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-charcoal text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-charcoal/15 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-charcoal/10">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-charcoal font-heading">
                      Announcements & Alerts
                    </h4>
                    {unreadAnnouncementsCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gold/30 text-gold-dark">
                        {unreadAnnouncementsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-forest hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-3 flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                  {announcements.slice(0, 4).map((anc) => (
                    <div
                      key={anc.id}
                      onClick={() => markAnnouncementAsRead(anc.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        anc.isRead
                          ? 'bg-cream/40 border-charcoal/10'
                          : 'bg-cream border-gold/40 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                          {anc.courseName}
                        </span>
                        <span className="text-[10px] text-charcoal-muted">
                          {anc.date}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-charcoal mt-1 line-clamp-1">
                        {anc.title}
                      </h5>
                      <p className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-2">
                        {anc.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Toggle Right Panel (calendar & reminders) */}
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-charcoal/10 text-xs font-semibold text-charcoal hover:bg-sage/10 transition-all shadow-xs"
            title={isRightPanelOpen ? 'Hide side panel' : 'Show side panel'}
          >
            {isRightPanelOpen ? (
              <>
                <PanelRightClose className="w-4 h-4 text-forest" />
                <span className="hidden 2xl:inline">Collapse</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4 text-forest" />
                <span className="hidden 2xl:inline">Widgets</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
