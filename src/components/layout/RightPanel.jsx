import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  SCHEDULE_COLOR_PALETTE,
  getItemDays,
  getItemTimeRange,
} from '../schedule/WeeklyCalendarGrid';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Calendar as CalendarIcon,
  ShieldCheck,
  BookOpen,
  Users,
  Bell,
  ClipboardList,
} from 'lucide-react';

export const RightPanel = () => {
  const {
    currentUser,
    courses,
    schedule,
    assignments,
    submissions,
    pendingApprovalsCount,
    unreadAnnouncementsCount,
    setActiveTab,
    setSelectedAssignmentId,
    setSelectedSubmissionId,
    setAssignmentOrigin,
    isRightPanelOpen,
  } = useLMS();

  // Real-time current date
  const [realTimeNow, setRealTimeNow] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser || !isRightPanelOpen) return null;

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const fullWeekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const jumpToToday = () => {
    const now = new Date();
    setRealTimeNow(now);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  // Generate calendar days for active month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Which weekdays have scheduled classes? (Admins do not have personal class schedules)
  const scheduledWeekdays = new Set(
    currentUser.role === 'admin'
      ? []
      : (schedule || []).flatMap((item) => getItemDays(item))
  );

  // Selected day's weekday & schedule items
  const selectedWeekday = fullWeekdays[selectedDate.getDay()];
  const isSelectedToday =
    selectedDate.getFullYear() === realTimeNow.getFullYear() &&
    selectedDate.getMonth() === realTimeNow.getMonth() &&
    selectedDate.getDate() === realTimeNow.getDate();

  const shortMonth = monthNames[selectedDate.getMonth()].slice(0, 3);
  const selectedDateLabel = `${
    isSelectedToday ? 'Today, ' : ''
  }${selectedDate.getDate()} ${shortMonth} (${selectedWeekday.slice(0, 3)})`;

  const daySchedule =
    currentUser.role === 'admin'
      ? []
      : (schedule || [])
          .filter((item) => getItemDays(item).includes(selectedWeekday))
          .sort((a, b) => getItemTimeRange(a)[0] - getItemTimeRange(b)[0]);

  return (
    <aside className="sticky top-0 h-screen w-80 2xl:w-88 shrink-0 bg-cream/50 border-l border-charcoal/10 p-5 hidden xl:flex flex-col gap-6 overflow-y-auto">
      {/* Profile Card Widget */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs text-center relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal mb-2">
          <span>Profile</span>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-black/5 transition-colors cursor-pointer"
            title="Edit Settings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative inline-block mt-1">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-sage/30 shadow-sm"
          />
          <span className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        <h4 className="mt-3 text-base font-bold text-charcoal font-heading leading-tight">
          {currentUser.name}
        </h4>
        <p className="text-xs text-charcoal-muted mt-0.5 truncate px-2">
          {currentUser.email}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-5 py-1.5 rounded-full bg-forest text-cream text-xs font-semibold hover:bg-forest-light transition-all shadow-xs cursor-pointer"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Real-Time Interactive Mini Calendar Widget */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        {/* Calendar Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-cream text-charcoal transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-heading text-charcoal">
              {monthNames[month]} {year}
            </span>
            {!isSelectedToday && (
              <button
                onClick={jumpToToday}
                className="text-[10px] font-bold text-forest bg-forest-50 hover:bg-forest-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                Today
              </button>
            )}
          </div>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-cream text-charcoal transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center mb-2">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className="text-[10px] font-bold text-charcoal-muted uppercase"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-7 w-7 mx-auto" />;
            }
            const dateObj = new Date(year, month, day);
            const weekdayName = fullWeekdays[dateObj.getDay()];
            const hasClassOnDay = scheduledWeekdays.has(weekdayName);

            const isSelected =
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === month &&
              selectedDate.getDate() === day;

            const isTodayCell =
              realTimeNow.getFullYear() === year &&
              realTimeNow.getMonth() === month &&
              realTimeNow.getDate() === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(new Date(year, month, day))}
                className={`h-7 w-7 mx-auto text-xs font-medium rounded-full flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-forest text-cream font-bold shadow-xs'
                    : isTodayCell
                    ? 'ring-1.5 ring-forest text-forest font-bold bg-forest-50'
                    : hasClassOnDay
                    ? 'text-charcoal font-semibold hover:bg-cream'
                    : 'text-charcoal-muted hover:bg-cream/60'
                }`}
              >
                <span>{day}</span>
                {hasClassOnDay && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-gold absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Schedule Section (Real-Time Filtered for Selected Day) */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-sm font-bold font-heading text-charcoal shrink-0">
              Schedule
            </h4>
            {currentUser.role !== 'admin' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-50 text-forest border border-forest/15 truncate">
                {selectedDateLabel}
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('schedule')}
            className="text-[11px] font-semibold text-charcoal-muted hover:text-forest transition-colors shrink-0 cursor-pointer"
          >
            {currentUser.role === 'admin' ? 'Master Timetable' : 'See all'}
          </button>
        </div>

        {currentUser.role === 'admin' ? (
          <div className="p-4 rounded-2xl bg-cream/60 border border-charcoal/10 text-center">
            <div className="w-9 h-9 rounded-full bg-forest/10 text-forest mx-auto mb-2 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-charcoal font-heading">
              No Class Schedule Assigned
            </p>
            <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
              Platform administrators do not attend or instruct personal class blocks.
            </p>
            <button
              onClick={() => setActiveTab('schedule')}
              className="mt-3 px-3.5 py-1.5 rounded-full bg-forest/10 text-forest hover:bg-forest hover:text-cream text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Inspect Campus Timetables
            </button>
          </div>
        ) : daySchedule.length === 0 ? (
          <div className="p-4 rounded-2xl bg-cream/60 border border-charcoal/10 text-center">
            <p className="text-xs font-semibold text-charcoal">
              No classes on {selectedWeekday}
            </p>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Select another day on the calendar or click See all.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {daySchedule.map((item) => {
              const palette =
                SCHEDULE_COLOR_PALETTE[item.color] ||
                SCHEDULE_COLOR_PALETTE.sage;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab('schedule')}
                  style={{
                    backgroundColor: palette.bg,
                    color: palette.text,
                    borderColor: palette.border,
                  }}
                  className="p-3 rounded-2xl border-[1.5px] transition-all hover:scale-[1.01] hover:brightness-97 cursor-pointer shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-extrabold">
                      {item.time || `${item.startTime} - ${item.endTime}`}
                    </span>
                    <span className="text-[10px] font-semibold opacity-85 shrink-0">
                      {item.location}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold mt-1 line-clamp-1 font-heading">
                    {item.code ? `${item.code}: ${item.title}` : item.title}
                  </h5>
                  <p className="text-[11px] opacity-85 mt-0.5 truncate font-medium">
                    {selectedWeekday} • {item.instructor}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reminders Section (Aligned with To-Do List) */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-sm font-bold font-heading text-charcoal shrink-0">
              Reminders
            </h4>
            {currentUser.role === 'teacher' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark truncate">
                Submissions to Review
              </span>
            )}
          </div>
          {currentUser.role === 'teacher' ? (
            <button
              onClick={() => setActiveTab('submissions')}
              className="text-[11px] font-semibold text-charcoal-muted hover:text-forest transition-colors cursor-pointer"
            >
              Submission Review
            </button>
          ) : currentUser.role === 'admin' ? (
            <button
              onClick={() => setActiveTab('approvals')}
              className="text-[11px] font-semibold text-charcoal-muted hover:text-forest transition-colors cursor-pointer"
            >
              Action Items
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('todo')}
              className="text-[11px] font-semibold text-charcoal-muted hover:text-forest transition-colors cursor-pointer"
            >
              To-Do List
            </button>
          )}
        </div>

        {(() => {
          if (currentUser.role === 'admin') {
            const adminReminders = [];
            if (pendingApprovalsCount > 0) {
              adminReminders.push({
                id: 'adm-approvals',
                title: `${pendingApprovalsCount} Student Admission${pendingApprovalsCount > 1 ? 's' : ''} Pending`,
                subtitle: 'Review & approve new student registration requests',
                tab: 'approvals',
                icon: ShieldCheck,
                badge: 'High Priority',
              });
            }
            if (unreadAnnouncementsCount > 0) {
              adminReminders.push({
                id: 'adm-broadcasts',
                title: `${unreadAnnouncementsCount} Campus Broadcast${unreadAnnouncementsCount > 1 ? 's' : ''}`,
                subtitle: 'Review academy announcements and notices',
                tab: 'announcements',
                icon: Bell,
                badge: 'Notice',
              });
            }
            adminReminders.push({
              id: 'adm-courses',
              title: `${courses.length} Active Courses in Catalog`,
              subtitle: 'Audit course syllabi, teachers & enrollments',
              tab: 'courses',
              icon: BookOpen,
              badge: 'Catalog',
            });
            adminReminders.push({
              id: 'adm-users',
              title: 'User Governance & Roles',
              subtitle: 'Manage faculty, student, and admin permissions',
              tab: 'users',
              icon: Users,
              badge: 'Admin',
            });

            return (
              <div className="flex flex-col gap-2.5">
                {adminReminders.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab(item.tab)}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-cream/70 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-semibold text-charcoal truncate group-hover:text-forest transition-colors">
                            {item.title}
                          </h5>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-forest-50 text-forest shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-muted mt-0.5 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          if (currentUser.role === 'teacher') {
            const teacherCourses = courses.filter(
              (c) =>
                c.instructorId === currentUser.id ||
                (currentUser._id && c.instructorId === currentUser._id) ||
                currentUser.assignedCourseIds?.includes(c.id) ||
                (c._id && currentUser.assignedCourseIds?.includes(c._id)) ||
                (c.instructorName &&
                  currentUser.name &&
                  c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
            );
            const teacherCourseIds = new Set(teacherCourses.map((c) => c.id));
            const pendingTeacherSubmissions = (submissions || []).filter(
              (s) => s.status === 'Submitted' && teacherCourseIds.has(s.courseId)
            );

            if (pendingTeacherSubmissions.length === 0) {
              return (
                <div className="p-4 rounded-2xl bg-cream/60 border border-charcoal/10 text-center">
                  <p className="text-xs font-semibold text-charcoal">
                    All Submissions Reviewed!
                  </p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    No pending student submissions currently awaiting your evaluation.
                  </p>
                </div>
              );
            }

            return (
              <div className="flex flex-col gap-2.5">
                {pendingTeacherSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      setActiveTab('submissions');
                    }}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-cream/70 transition-colors cursor-pointer group"
                  >
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-8 h-8 rounded-xl object-cover border border-charcoal/10 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-semibold text-charcoal truncate group-hover:text-forest transition-colors">
                          {sub.studentName}
                        </h5>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold/15 text-gold-dark shrink-0">
                          Review
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal font-medium truncate">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[10px] text-charcoal-muted mt-0.5 truncate">
                        {sub.courseName} • Submitted {sub.submissionDate?.split(' ')[0] || sub.submittedDate || 'Recent'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // Student: Enrolled course assignments due
          const pendingTodoReminders = (assignments || [])
            .filter((asg) => {
              const inEnrolledCourse =
                !currentUser.enrolledCourseIds?.length ||
                currentUser.enrolledCourseIds.includes(asg.courseId);
              const alreadySubmitted = (submissions || []).some(
                (s) =>
                  s.assignmentId === asg.id && s.studentId === currentUser.id
              );
              return (
                inEnrolledCourse &&
                !alreadySubmitted &&
                asg.status !== 'Graded'
              );
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

          if (pendingTodoReminders.length === 0) {
            return (
              <p className="text-xs text-charcoal-muted text-center py-4">
                No pending To-Do assignments!
              </p>
            );
          }

          return (
            <div className="flex flex-col gap-2.5">
              {pendingTodoReminders.map((asg) => (
                <div
                  key={asg.id}
                  onClick={() => {
                    setAssignmentOrigin('todo');
                    setSelectedAssignmentId(asg.id);
                    setActiveTab('assignment-details');
                  }}
                  className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-cream/70 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-charcoal truncate group-hover:text-forest transition-colors">
                      {asg.title}
                    </h5>
                    <p className="text-[11px] text-charcoal-muted mt-0.5 truncate">
                      Due {asg.dueDate} • {asg.courseName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </aside>
  );
};
