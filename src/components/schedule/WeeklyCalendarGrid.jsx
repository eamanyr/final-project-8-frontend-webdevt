import React from 'react';

export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SCHEDULE_COLOR_PALETTE = {
  sage: {
    label: 'Sage Green',
    bg: '#dce9db',
    text: '#1e3f33',
    border: '#9cb49a',
  },
  mint: {
    label: 'Forest Mist',
    bg: '#dbe8e1',
    text: '#142a22',
    border: '#7fa896',
  },
  teal: {
    label: 'Slate Teal',
    bg: '#d9ecec',
    text: '#183a3a',
    border: '#8ab8b8',
  },
  coral: {
    label: 'Terracotta Clay',
    bg: '#f5deda',
    text: '#5c231c',
    border: '#d6978e',
  },
  lavender: {
    label: 'Muted Mauve',
    bg: '#ebe0ed',
    text: '#3b2340',
    border: '#bca1c2',
  },
  peach: {
    label: 'Warm Ochre Peach',
    bg: '#faeadb',
    text: '#593315',
    border: '#deb087',
  },
  lime: {
    label: 'Olive Leaf',
    bg: '#e6edd1',
    text: '#2e3814',
    border: '#b2c282',
  },
  pink: {
    label: 'Blush Quartz',
    bg: '#f7e4ec',
    text: '#4f2035',
    border: '#d4a3b8',
  },
  stone: {
    label: 'Warm Linen Stone',
    bg: '#eee8d5',
    text: '#232724',
    border: '#c7bfa6',
  },
  gold: {
    label: 'Academy Gold',
    bg: '#fef5e0',
    text: '#6e460a',
    border: '#de9e36',
  },
  forest: {
    label: 'Deep Forest',
    bg: '#1e3f33',
    text: '#faf7ef',
    border: '#142a22',
  },
};

const START_HOUR = 7; // 7:00 AM
const END_HOUR = 20; // 8:00 PM
const START_MINUTES = START_HOUR * 60; // 420
const END_MINUTES = END_HOUR * 60; // 1200
const SLOT_HEIGHT = 28; // px per 30 minutes
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 26 half-hour intervals

// Generate 30-min time labels from 7:00AM to 8:00PM
export const TIME_LABELS = Array.from({ length: TOTAL_SLOTS + 1 }, (_, idx) => {
  const totalMins = START_MINUTES + idx * 30;
  const hours24 = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return {
    label: `${hours12}:${mins === 0 ? '00' : '30'}${period}`,
    minutes: totalMins,
    time24: `${String(hours24).padStart(2, '0')}:${mins === 0 ? '00' : '30'}`,
  };
});

// Parse "07:30", "14:10", "7:30AM", "2:10PM" -> minutes from midnight
export const parseTimeToMinutes = (str) => {
  if (!str) return null;
  const clean = str.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
};

// Format minutes from midnight -> "7:30AM"
export const formatMinutesToAmPm = (totalMins) => {
  const hours24 = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, '0')}${period}`;
};

// Extract [startMinutes, endMinutes] from a schedule item
export const getItemTimeRange = (item) => {
  if (item.startTime && item.endTime) {
    const s = parseTimeToMinutes(item.startTime);
    const e = parseTimeToMinutes(item.endTime);
    if (s !== null && e !== null && e > s) return [s, e];
  }
  if (item.time) {
    const parts = item.time.split(/\s*-\s*/);
    if (parts.length === 2) {
      const s = parseTimeToMinutes(parts[0]);
      const e = parseTimeToMinutes(parts[1]);
      if (s !== null && e !== null && e > s) return [s, e];
    }
  }
  return [9 * 60, 10 * 60 + 30]; // Default 9:00AM - 10:30AM
};

// Extract array of weekday names from a schedule item
export const getItemDays = (item) => {
  if (Array.isArray(item.days) && item.days.length > 0) {
    return item.days;
  }
  if (typeof item.day === 'string') {
    if (item.day.toLowerCase() === 'today') return ['Monday', 'Wednesday'];
    if (item.day.toLowerCase() === 'tomorrow') return ['Thursday'];
    const abbrMap = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    };
    const split = item.day
      .split(/[,/&]+/)
      .map((d) => {
        const trimmed = d.trim();
        if (WEEK_DAYS.includes(trimmed)) return trimmed;
        const lower3 = trimmed.slice(0, 3).toLowerCase();
        return abbrMap[lower3] || trimmed;
      })
      .filter((d) => WEEK_DAYS.includes(d));
    if (split.length > 0) return split;
  }
  return ['Monday'];
};

export const WeeklyCalendarGrid = ({
  schedule = [],
  scheduleTitle = '1st Semester Studio & Lecture Schedule',
  onTitleChange,
  onSelectBlock,
  onSelectSlot,
}) => {
  const totalGridHeight = TOTAL_SLOTS * SLOT_HEIGHT;
  const todayWeekday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  });

  return (
    <div className="rounded-3xl overflow-hidden border border-charcoal/15 bg-white shadow-xs select-none">
      {/* CacheUp-Themed Top Header Bar */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-sage px-5 py-3 flex items-center justify-between gap-4">
        <span className="text-sm font-extrabold tracking-tight text-cream font-heading shrink-0">
          CacheUp
        </span>

        {onTitleChange ? (
          <input
            type="text"
            value={scheduleTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Schedule Title"
            className="flex-1 max-w-xl mx-auto bg-white/95 text-charcoal text-xs sm:text-sm font-bold text-center py-1.5 px-4 rounded-xl border border-charcoal/15 focus:outline-none focus:ring-2 focus:ring-gold shadow-2xs"
          />
        ) : (
          <div className="flex-1 max-w-xl mx-auto bg-cream/95 text-charcoal text-xs sm:text-sm font-bold text-center py-1.5 px-4 rounded-xl border border-charcoal/10 truncate shadow-2xs">
            {scheduleTitle}
          </div>
        )}

        <span className="text-[11px] font-bold text-gold-light px-2.5 py-1 rounded-full bg-cream/15 backdrop-blur-xs shrink-0 hidden sm:inline">
          Weekly View
        </span>
      </div>

      {/* Scrollable Horizontal Wrapper for smaller screens */}
      <div className="overflow-x-auto">
        <div className="min-w-[780px] p-3 sm:p-4 bg-white">
          {/* Day Headers Row */}
          <div className="flex">
            {/* Top-left corner spacer matching time column width */}
            <div className="w-18 shrink-0" />

            {/* 7 Day Columns Header */}
            <div className="flex-1 grid grid-cols-7 text-center pb-2">
              {WEEK_DAYS.map((day) => {
                const isToday = day === todayWeekday;
                return (
                  <div
                    key={day}
                    className="flex items-center justify-center gap-1"
                  >
                    <span
                      className={`text-xs sm:text-[13px] font-bold font-heading tracking-tight px-2.5 py-0.5 rounded-full ${
                        isToday
                          ? 'bg-forest text-cream shadow-2xs'
                          : 'text-charcoal'
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Timetable Body: Left Time Labels + 7-Column Grid */}
          <div className="flex relative">
            {/* Left Time Labels Column */}
            <div
              className="w-18 shrink-0 relative pr-2.5 text-right"
              style={{ height: `${totalGridHeight}px` }}
            >
              {TIME_LABELS.map((t, idx) => (
                <div
                  key={t.label}
                  className="absolute right-2.5 -translate-y-1/2 text-[11px] font-semibold text-charcoal-muted leading-none"
                  style={{ top: `${idx * SLOT_HEIGHT}px` }}
                >
                  {t.label}
                </div>
              ))}
            </div>

            {/* 7 Day Columns with 30-Min Grid Lines and Course Blocks */}
            <div
              className="flex-1 grid grid-cols-7 relative border-t border-b border-charcoal/25 rounded-xl overflow-hidden bg-cream/20"
              style={{ height: `${totalGridHeight}px` }}
            >
              {/* Horizontal 30-minute grid lines spanning all 7 columns */}
              {Array.from({ length: TOTAL_SLOTS - 1 }, (_, idx) => (
                <div
                  key={`hline-${idx}`}
                  className={`absolute left-0 right-0 pointer-events-none ${
                    (idx + 1) % 2 === 0
                      ? 'border-t border-charcoal/20'
                      : 'border-t border-charcoal/10 border-dashed'
                  }`}
                  style={{ top: `${(idx + 1) * SLOT_HEIGHT}px` }}
                />
              ))}

              {/* Day Columns */}
              {WEEK_DAYS.map((day) => {
                const dayItems = schedule.filter((item) =>
                  getItemDays(item).includes(day)
                );
                const isToday = day === todayWeekday;

                return (
                  <div
                    key={day}
                    className={`relative border-l last:border-r border-charcoal/20 h-full ${
                      isToday ? 'bg-forest-50/30' : ''
                    }`}
                  >
                    {/* Clickable 30-min background slots to add new event */}
                    {onSelectSlot &&
                      Array.from({ length: TOTAL_SLOTS }, (_, slotIdx) => {
                        const slotTime =
                          TIME_LABELS[slotIdx]?.time24 || '09:00';
                        return (
                          <div
                            key={`slot-${slotIdx}`}
                            onClick={() => onSelectSlot(day, slotTime)}
                            title={`Click to add session on ${day} at ${TIME_LABELS[slotIdx]?.label}`}
                            className="w-full hover:bg-forest/8 transition-colors cursor-pointer"
                            style={{ height: `${SLOT_HEIGHT}px` }}
                          />
                        );
                      })}

                    {/* Scheduled Class Blocks */}
                    {dayItems.map((item) => {
                      const [startMins, endMins] = getItemTimeRange(item);
                      const clampedStart = Math.max(
                        START_MINUTES,
                        Math.min(END_MINUTES - 30, startMins)
                      );
                      const clampedEnd = Math.max(
                        clampedStart + 30,
                        Math.min(END_MINUTES, endMins)
                      );

                      const topPx =
                        ((clampedStart - START_MINUTES) / 30) * SLOT_HEIGHT;
                      const heightPx =
                        ((clampedEnd - clampedStart) / 30) * SLOT_HEIGHT;

                      const palette =
                        SCHEDULE_COLOR_PALETTE[item.color] ||
                        SCHEDULE_COLOR_PALETTE.sage;

                      const timeDisplay = `${formatMinutesToAmPm(
                        startMins
                      )}-${formatMinutesToAmPm(endMins)}`;

                      return (
                        <div
                          key={`${item.id}-${day}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectBlock) onSelectBlock(item);
                          }}
                          style={{
                            top: `${topPx + 1}px`,
                            height: `${Math.max(heightPx - 2, 24)}px`,
                            backgroundColor: palette.bg,
                            color: palette.text,
                            borderColor: palette.border,
                          }}
                          className="absolute left-1 right-1 z-10 rounded-xl border-[1.5px] px-1.5 py-1 overflow-hidden cursor-pointer shadow-2xs hover:brightness-97 hover:shadow-md transition-all flex flex-col"
                        >
                          <div className="text-[11px] font-extrabold text-center leading-tight truncate font-heading">
                            {item.code || item.title}
                          </div>
                          {item.code && item.title && heightPx >= 50 && (
                            <div className="text-[10px] font-semibold leading-tight truncate mt-0.5">
                              {item.title}
                            </div>
                          )}
                          <div className="text-[10px] font-medium leading-tight mt-0.5 truncate opacity-90">
                            {timeDisplay}
                          </div>
                          {item.location && heightPx >= 42 && (
                            <div className="text-[10px] font-semibold leading-tight truncate opacity-85">
                              {item.location}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
