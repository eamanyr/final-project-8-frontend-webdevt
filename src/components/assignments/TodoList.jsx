import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ListTodo,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  FileCheck2,
  ArrowUpDown,
  PlusCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';

const DEFAULT_PUBLISHED_DATES = {
  'asg-4': '2026-09-25',
  'asg-3': '2026-10-01',
  'asg-1': '2026-10-08',
  'asg-2': '2026-10-10',
};

const PRIORITY_WEIGHT = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export const TodoList = () => {
  const {
    assignments,
    courses,
    submissions,
    currentUser,
    setActiveTab,
    setSelectedAssignmentId,
  } = useLMS();

  // Default sort: what was published first
  const [sortBy, setSortBy] = useState('published'); // 'published' | 'dueDate' | 'priority'
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('todo'); // 'todo' | 'completed'

  const isStudent = currentUser?.role === 'student';
  const isTeacherOrAdmin =
    currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // Courses relevant to the current user
  const relevantCourses = isStudent
    ? courses.filter((c) => currentUser?.enrolledCourseIds?.includes(c.id))
    : courses;

  const relevantCourseIds = new Set(relevantCourses.map((c) => c.id));

  const getPublishedDate = (asg) =>
    asg.publishedAt || DEFAULT_PUBLISHED_DATES[asg.id] || '2026-10-12';

  const isAssignmentSubmitted = (asg) => {
    if (isStudent) {
      const hasSubmission = submissions.some(
        (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
      );
      return hasSubmission || asg.status === 'Graded';
    }
    return asg.status === 'Graded';
  };

  // Filter assignments for the user's courses
  const userCourseAssignments = assignments.filter((asg) =>
    isStudent && relevantCourseIds.size > 0
      ? relevantCourseIds.has(asg.courseId)
      : true
  );

  const todoAssignmentsCount = userCourseAssignments.filter(
    (asg) => !isAssignmentSubmitted(asg)
  ).length;

  const completedAssignmentsCount = userCourseAssignments.filter((asg) =>
    isAssignmentSubmitted(asg)
  ).length;

  // Apply status and course filters
  const filteredAssignments = userCourseAssignments.filter((asg) => {
    const submitted = isAssignmentSubmitted(asg);
    if (statusFilter === 'todo' && submitted) return false;
    if (statusFilter === 'completed' && !submitted) return false;
    if (selectedCourseFilter !== 'all' && asg.courseId !== selectedCourseFilter) {
      return false;
    }
    return true;
  });

  // Sort assignments:
  // 1. 'published' -> Published First (earliest published date first)
  // 2. 'dueDate'   -> Due Date (earliest due date first)
  // 3. 'priority'  -> Priority (High -> Medium -> Low)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateCompare = (a.dueDate || '').localeCompare(b.dueDate || '');
      if (dateCompare !== 0) return dateCompare;
    } else if (sortBy === 'priority') {
      const weightA = PRIORITY_WEIGHT[a.priority] ?? 99;
      const weightB = PRIORITY_WEIGHT[b.priority] ?? 99;
      if (weightA !== weightB) return weightA - weightB;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    }

    // Default / fallback: Published First
    const pubA = getPublishedDate(a);
    const pubB = getPublishedDate(b);
    const pubCompare = pubA.localeCompare(pubB);
    if (pubCompare !== 0) return pubCompare;
    return (a.id || '').localeCompare(b.id || '');
  });

  // Group by course or show course sections when viewing all courses
  const coursesToRender =
    selectedCourseFilter === 'all'
      ? relevantCourses.filter((course) =>
          sortedAssignments.some((a) => a.courseId === course.id)
        )
      : relevantCourses.filter((course) => course.id === selectedCourseFilter);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-flex items-center gap-1.5 mb-1">
            <ListTodo className="w-3.5 h-3.5" />
            <span>Coursework Tracker</span>
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            To-Do List
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Assignments you need to submit across your courses
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setActiveTab('create-assignment')}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter & Sort Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-xs">
        {/* Left: Status Tabs (To Submit vs Completed) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10">
            <button
              onClick={() => setStatusFilter('todo')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === 'todo'
                  ? 'bg-charcoal text-cream shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              To Submit ({todoAssignmentsCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-charcoal text-cream shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Completed ({completedAssignmentsCount})
            </button>
          </div>
        </div>

        {/* Right: Sort By Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-charcoal-muted flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-forest" />
            <span>Sort by:</span>
          </span>
          <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10">
            <button
              onClick={() => setSortBy('published')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === 'published'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Published First
            </button>
            <button
              onClick={() => setSortBy('dueDate')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === 'dueDate'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Due Date
            </button>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === 'priority'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Priority
            </button>
          </div>
        </div>
      </div>

      {/* Course Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCourseFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCourseFilter === 'all'
              ? 'bg-gold text-charcoal font-bold shadow-xs'
              : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal'
          }`}
        >
          All Courses ({filteredAssignments.length})
        </button>
        {relevantCourses.map((course) => {
          const countForCourse = userCourseAssignments.filter((asg) => {
            const submitted = isAssignmentSubmitted(asg);
            const matchesStatus =
              statusFilter === 'todo' ? !submitted : submitted;
            return asg.courseId === course.id && matchesStatus;
          }).length;

          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourseFilter(course.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCourseFilter === course.id
                  ? 'bg-gold text-charcoal font-bold shadow-xs'
                  : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <span>{course.title}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedCourseFilter === course.id
                    ? 'bg-charcoal text-cream'
                    : 'bg-cream text-charcoal-muted'
                }`}
              >
                {countForCourse}
              </span>
            </button>
          );
        })}
      </div>

      {/* To-Do Assignments List */}
      {sortedAssignments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-charcoal/10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-sage/20 text-forest flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-charcoal font-heading">
            {statusFilter === 'todo'
              ? "You're all caught up!"
              : 'No completed assignments found'}
          </h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
            {statusFilter === 'todo'
              ? 'There are no pending assignments to submit for the selected course filter.'
              : 'Submit assignments from your To-Do list to see them here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAssignments.map((asg) => {
            const course = courses.find((c) => c.id === asg.courseId);
            const publishedDate = getPublishedDate(asg);
            const submitted = isAssignmentSubmitted(asg);
            const mySubmission = submissions.find(
              (s) =>
                s.assignmentId === asg.id && s.studentId === currentUser?.id
            );

            return (
              <div
                key={asg.id}
                onClick={() => {
                  setSelectedAssignmentId(asg.id);
                  setActiveTab('assignment-details');
                }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-charcoal/10 shadow-xs hover:shadow-md hover:border-forest/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Course & Priority Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest/10 text-forest flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>
                        {course ? `${course.code} • ${course.title}` : asg.courseName}
                      </span>
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        asg.priority === 'High'
                          ? 'bg-gold/25 text-gold-dark'
                          : asg.priority === 'Medium'
                          ? 'bg-forest/15 text-forest'
                          : 'bg-sage/25 text-charcoal'
                      }`}
                    >
                      {asg.priority} Priority
                    </span>

                    <span className="text-[10px] font-semibold text-charcoal-muted bg-cream px-2.5 py-0.5 rounded-full border border-charcoal/10">
                      Published: {publishedDate}
                    </span>
                  </div>

                  {/* Assignment Title */}
                  <h3 className="text-base font-bold text-charcoal font-heading group-hover:text-forest transition-colors">
                    {asg.title}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  {/* Meta Info: Due Date, Duration, Points */}
                  <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-charcoal-muted">
                    <span className="flex items-center gap-1.5 font-semibold text-charcoal">
                      <Calendar className="w-3.5 h-3.5 text-forest" />
                      <span>
                        Due: {asg.dueDate} ({asg.dueTime})
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-forest" />
                      <span>Estimated: {asg.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-charcoal">
                      <Award className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{asg.maxScore} pts</span>
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-charcoal/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignmentId(asg.id);
                      setActiveTab('assignment-details');
                    }}
                    className="px-4 py-2 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors"
                  >
                    Details
                  </button>

                  {isStudent && !submitted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssignmentId(asg.id);
                        setActiveTab('assignment-submit');
                      }}
                      className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Submit Work</span>
                    </button>
                  )}

                  {submitted && (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {mySubmission?.score !== null && mySubmission?.score !== undefined
                          ? `Graded (${mySubmission.score}/${asg.maxScore})`
                          : 'Submitted'}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
