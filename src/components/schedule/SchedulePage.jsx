import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  WeeklyCalendarGrid,
  WEEK_DAYS,
  SCHEDULE_COLOR_PALETTE,
  getItemDays,
  getItemTimeRange,
  formatMinutesToAmPm,
} from './WeeklyCalendarGrid';
import {
  Calendar,
  PlusCircle,
  Trash2,
  ArrowLeft,
  Save,
  Edit3,
  X,
  ShieldCheck,
} from 'lucide-react';

const minutesToTimeInput = (totalMins) => {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const EMPTY_FORM = {
  code: 'ART-201',
  title: 'Studio Session',
  course: 'Modern Art & Contemporary Expression',
  days: ['Monday', 'Wednesday'],
  startTime: '09:00',
  endTime: '10:30',
  location: 'Studio 4B',
  instructor: 'Prof. Alicia Mayer',
  color: 'sage',
};

export const SchedulePage = () => {
  const {
    schedule,
    scheduleTitle,
    setScheduleTitle,
    courses,
    currentUser,
    users,
    switchUserById,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    setActiveTab,
    isScheduleEditMode,
    setIsScheduleEditMode,
    addToast,
  } = useLMS();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isTeacher = currentUser?.role === 'teacher';
  const teacherCourses = isTeacher
    ? courses.filter(
        (c) =>
          c.instructorId === currentUser?.id ||
          (currentUser?._id && c.instructorId === currentUser?._id) ||
          currentUser?.assignedCourseIds?.includes(c.id) ||
          (c._id && currentUser?.assignedCourseIds?.includes(c._id)) ||
          (c.instructorName &&
            currentUser?.name &&
            c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
      )
    : courses;
  const availableCourses = isTeacher && teacherCourses.length > 0 ? teacherCourses : courses;

  const handleOpenAdd = (defaultDay = 'Monday', defaultStart = '09:00') => {
    if (currentUser?.role === 'admin') return;
    setEditingId(null);
    const [sh, sm] = defaultStart.split(':').map(Number);
    const startMins = sh * 60 + (sm || 0);
    const endMins = Math.min(20 * 60, startMins + 90);
    const defaultCourse = availableCourses[0] || courses[0];

    setFormData({
      ...EMPTY_FORM,
      code: defaultCourse?.code || 'ART-201',
      title: defaultCourse?.title || 'Studio Session',
      course: defaultCourse?.title || 'Modern Art & Contemporary Expression',
      instructor: isTeacher ? currentUser?.name : defaultCourse?.instructorName || 'Prof. Alicia Mayer',
      days: [defaultDay],
      startTime: minutesToTimeInput(startMins),
      endTime: minutesToTimeInput(endMins),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    if (currentUser?.role === 'admin') return;
    setEditingId(item.id);
    const [startMins, endMins] = getItemTimeRange(item);
    setFormData({
      code: item.code || item.title?.slice(0, 8) || 'CRS-101',
      title: item.title || '',
      course: item.course || item.title || '',
      days: getItemDays(item),
      startTime: item.startTime || minutesToTimeInput(startMins),
      endTime: item.endTime || minutesToTimeInput(endMins),
      location: item.location || '',
      instructor: item.instructor || '',
      color: item.color || 'sage',
    });
    setIsModalOpen(true);
  };

  const toggleDaySelection = (day) => {
    setFormData((prev) => {
      const exists = prev.days.includes(day);
      if (exists && prev.days.length === 1) return prev; // Keep at least 1 day selected
      const nextDays = exists
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days: nextDays };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() && !formData.code.trim()) return;

    const [sh, sm] = formData.startTime.split(':').map(Number);
    const [eh, em] = formData.endTime.split(':').map(Number);
    const startMins = sh * 60 + (sm || 0);
    const endMins = eh * 60 + (em || 0);

    if (endMins <= startMins) {
      alert('End time must be later than start time.');
      return;
    }

    const formattedTime = `${formatMinutesToAmPm(startMins)} - ${formatMinutesToAmPm(endMins)}`;
    const payload = {
      ...formData,
      time: formattedTime,
    };

    if (editingId) {
      updateScheduleItem(editingId, payload);
    } else {
      addScheduleItem(payload);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDeleteCurrent = () => {
    if (!editingId) return;
    deleteScheduleItem(editingId);
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSaveSchedule = () => {
    setIsScheduleEditMode(false);
    addToast('Schedule saved!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser?.role === 'admin' ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest/10 border border-forest/20 text-forest text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Master Overview (Administrators do not hold personal class schedules)</span>
            </div>
          ) : isScheduleEditMode ? (
            <>
              <span className="text-xs text-charcoal-muted hidden md:inline">
                Edit Mode: Click any class block to edit or click an empty time slot to add a session.
              </span>
              <button
                onClick={() => handleOpenAdd('Monday', '09:00')}
                className="px-4 py-2 rounded-xl bg-white border border-forest/30 text-forest text-xs font-bold hover:bg-forest/5 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Class Block</span>
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsScheduleEditMode(true)}
              className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit &amp; Modify Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Active User Personalized Schedule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10 shadow-2xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                {currentUser?.name}'s Timetable
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest/10 text-forest">
                {currentUser?.role === 'teacher' ? 'Faculty Instructor' : currentUser?.role === 'admin' ? 'Academy Admin' : 'Active Student'}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              {currentUser?.role === 'teacher'
                ? 'Your studio lectures, masterclasses, and office hours for courses led by you.'
                : currentUser?.role === 'admin'
                ? 'Administrators do not hold personal class schedules. Use the switcher to inspect timetables for faculty instructors or students.'
                : 'Your personalized timetable aligned with your enrolled courses and studio sessions.'}
            </p>
          </div>
        </div>

        {/* Quick User Schedule Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-charcoal-muted shrink-0 mr-1 hidden lg:inline">
            Switch Schedule:
          </span>
          {users
            .filter((u) => u.status === 'approved')
            .map((u) => {
              const isActive = u.id === currentUser?.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => switchUserById(u.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-forest text-cream shadow-xs font-bold ring-2 ring-forest/30'
                      : 'bg-cream/60 hover:bg-cream border border-charcoal/10 text-charcoal'
                  }`}
                  title={`View schedule for ${u.name} (${u.role})`}
                >
                  <img src={u.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                  <span>{u.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-70">
                    {u.role === 'teacher' ? '(Prof)' : u.role === 'admin' ? '(Admin)' : ''}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Admin Advisory Banner */}
      {currentUser?.role === 'admin' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                Administrative Registry: No Personal Class Schedules
              </h4>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Super-administrators manage platform registry, student admissions, and curriculum oversight rather than attending or instructing class sessions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('approvals')}
            className="px-3.5 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Review Admissions
          </button>
        </div>
      )}

      {/* Interactive Gizmoa-Style Week Calendar */}
      <WeeklyCalendarGrid
        schedule={schedule}
        scheduleTitle={scheduleTitle}
        onTitleChange={isScheduleEditMode ? setScheduleTitle : undefined}
        onSelectBlock={isScheduleEditMode ? handleOpenEdit : undefined}
        onSelectSlot={
          isScheduleEditMode ? (day, time24) => handleOpenAdd(day, time24) : undefined
        }
      />

      {/* Add / Edit Class Block Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-charcoal/15 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest" />
                <h3 className="text-base font-bold font-heading text-charcoal">
                  {editingId ? 'Edit Schedule Block' : 'Add Schedule Block'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ART-201"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Class / Session Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Art & Expression"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                  />
                </div>
              </div>

              {/* Days of Week Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Days of the Week
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEK_DAYS.map((day) => {
                    const selected = formData.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDaySelection(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selected
                            ? 'bg-forest text-cream shadow-xs'
                            : 'bg-cream/60 border border-charcoal/15 text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    min="07:00"
                    max="19:30"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    min="07:30"
                    max="20:00"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                  />
                </div>
              </div>

              {/* Room & Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Room / Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JRF 303 / Studio 4B"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Alicia Mayer"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
              </div>

              {/* Block Color Swatches */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Block Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SCHEDULE_COLOR_PALETTE).map(([key, swatch]) => {
                    const isSelected = formData.color === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: key })}
                        title={swatch.label}
                        style={{
                          backgroundColor: swatch.bg,
                          borderColor: isSelected ? '#232724' : swatch.border,
                        }}
                        className={`w-8 h-8 rounded-xl border-2 transition-transform cursor-pointer ${
                          isSelected ? 'scale-110 ring-2 ring-charcoal/40' : 'hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between gap-2">
                {editingId ? (
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Block</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Save Changes' : 'Add to Timetable'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
