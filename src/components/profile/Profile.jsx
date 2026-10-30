import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  MapPin,
  Award,
  BookOpen,
  Edit3,
  Shield,
  Sparkles
} from 'lucide-react';

import { WeeklyCalendarGrid } from '../schedule/WeeklyCalendarGrid';

export const Profile = () => {
  const {
    currentUser,
    courses,
    schedule,
    scheduleTitle,
    setActiveTab,
    setSelectedCourseId,
    setIsScheduleEditMode,
  } = useLMS();

  if (!currentUser) return null;

  const myCourses = courses.filter((c) =>
    currentUser.enrolledCourseIds?.includes(c.id) ||
    currentUser.assignedCourseIds?.includes(c.id) ||
    c.instructorId === currentUser.id
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-charcoal/10 overflow-hidden shadow-xs">
        {/* Cover Graphic */}
        <div className="h-36 bg-gradient-to-r from-forest via-sage to-gold/40 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-1.5 rounded-full bg-white/90 text-charcoal text-xs font-bold hover:bg-white transition-all shadow-sm flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="relative inline-block">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-white"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white" />
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-forest text-cream">
                {currentUser.role}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cream border border-charcoal/10 text-charcoal">
                {currentUser.status === 'approved' ? 'Active Status' : currentUser.status}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-charcoal">
              {currentUser.name}
            </h2>
            <p className="text-xs sm:text-sm text-forest font-semibold mt-0.5">
              {currentUser.title || 'Academy Member'}
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-2xl leading-relaxed">
              {currentUser.bio || 'Exploring design concepts, modern typography, and web development.'}
            </p>
          </div>

          {/* Quick Contact & Info Grid */}
          <div className="mt-6 pt-6 border-t border-charcoal/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-charcoal">
              <Mail className="w-4 h-4 text-forest shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-charcoal">
              <Building className="w-4 h-4 text-forest shrink-0" />
              <span className="truncate">{currentUser.department || 'Creative Arts'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-charcoal">
              <Calendar className="w-4 h-4 text-forest shrink-0" />
              <span>Joined {currentUser.joinedDate || '2026'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Affiliations (Students & Teachers only) */}
      {currentUser.role !== 'admin' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <h3 className="text-base font-bold font-heading text-charcoal mb-4">
            {currentUser.role === 'teacher' ? 'Courses Instructed' : 'Enrolled Courses'}
          </h3>

          {myCourses.length === 0 ? (
            <p className="text-xs text-charcoal-muted text-center py-6">
              No courses currently affiliated.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setActiveTab('course-details');
                  }}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/30 hover:border-forest/30 hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                >
                  <img
                    src={c.thumbnail}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-14 h-14 rounded-xl object-cover border border-charcoal/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-forest uppercase tracking-wider">
                      {c.code}
                    </span>
                    <h4 className="text-xs font-bold text-charcoal truncate">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-charcoal-muted mt-0.5">
                      {c.duration} • {c.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly Schedule Section (Students & Faculty only) / Administrative Oversight (Admins) */}
      {currentUser.role === 'admin' ? (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-charcoal">
                  Super-Administrator Governance & Master Timetable
                </h3>
                <p className="text-xs text-charcoal-muted mt-1 max-w-xl leading-relaxed">
                  Administrators do not hold individual course schedules or student homework tasks. You oversee institution-wide operations, admissions approvals, and campus timetables across all departments.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Campus Timetables</span>
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-2 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Review Admissions</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal">
                My Schedule
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Weekly studio &amp; lecture timetable (click any block or button to customize)
              </p>
            </div>

            <button
              onClick={() => {
                setIsScheduleEditMode(true);
                setActiveTab('schedule');
              }}
              className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-center cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit &amp; Modify Schedule</span>
            </button>
          </div>

          <WeeklyCalendarGrid
            schedule={schedule}
            scheduleTitle={scheduleTitle}
            onSelectBlock={() => {
              setIsScheduleEditMode(true);
              setActiveTab('schedule');
            }}
          />
        </div>
      )}
    </div>
  );
};
