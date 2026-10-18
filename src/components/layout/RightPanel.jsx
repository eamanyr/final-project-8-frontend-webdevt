import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Clock,
  Calendar as CalendarIcon,
  BellRing,
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const RightPanel = () => {
  const {
    currentUser,
    schedule,
    reminders,
    setActiveTab,
    isRightPanelOpen,
  } = useLMS();

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDay, setSelectedDay] = useState(15);

  if (!currentUser || !isRightPanelOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days for October 2026 (or active month)
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Days with scheduled classes/deadlines
  const activeEventDays = [5, 12, 15, 18, 22, 24, 28];

  return (
    <aside className="w-80 2xl:w-88 shrink-0 bg-cream/50 border-l border-charcoal/10 p-5 hidden xl:flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-65px)]">
      {/* Profile Card Widget */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs text-center relative group">
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal mb-2">
          <span>Profile</span>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-black/5 transition-colors"
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
            className="px-5 py-1.5 rounded-full bg-forest text-cream text-xs font-semibold hover:bg-forest-light transition-all shadow-xs"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Interactive Mini Calendar Widget (direct UI inspiration) */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        {/* Calendar Header with Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-full hover:bg-cream text-charcoal transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold font-heading text-charcoal">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-full hover:bg-cream text-charcoal transition-colors"
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
            const isSelected = day === selectedDay;
            const hasEvent = activeEventDays.includes(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-7 w-7 mx-auto text-xs font-medium rounded-full flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-charcoal text-cream font-bold shadow-xs'
                    : hasEvent
                    ? 'text-charcoal font-semibold hover:bg-cream'
                    : 'text-charcoal-muted hover:bg-cream/60'
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-gold absolute bottom-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Section (direct UI inspiration) */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold font-heading text-charcoal">Schedule</h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sage/20 text-forest">
              {selectedDay} Oct
            </span>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-[11px] font-semibold text-charcoal-muted hover:text-forest transition-colors"
          >
            See all
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {schedule.map((item) => {
            const bgClass =
              item.color === 'gold'
                ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-200'
                : item.color === 'sage'
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 border-emerald-200'
                : 'bg-gradient-to-r from-stone-50 to-stone-100 border-charcoal/10';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all hover:scale-[1.01] ${bgClass}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-charcoal">
                    {item.time.split(' - ')[0]}
                  </span>
                  <span className="text-[10px] font-medium text-charcoal-muted">
                    {item.location}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-charcoal mt-1 line-clamp-1">
                  {item.title}
                </h5>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  {item.course} • {item.instructor}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminders Section (direct UI inspiration) */}
      <div className="bg-white rounded-3xl p-5 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold font-heading text-charcoal">Reminders</h4>
          <BellRing className="w-4 h-4 text-gold-dark" />
        </div>

        <div className="flex flex-col gap-2.5">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              onClick={() => setActiveTab('assignments')}
              className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-cream/70 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-charcoal truncate">
                  {rem.title}
                </h5>
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  {rem.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
