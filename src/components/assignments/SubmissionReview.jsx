import React, { useState, useEffect, useMemo } from 'react';
import { useLMS } from '../../context/LMSContext';
import { GradingModal } from './GradingModal';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  FileText,
  User,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  FileCheck2,
  Download,
  Filter
} from 'lucide-react';

export const SubmissionReview = () => {
  const {
    submissions,
    assignments,
    courses,
    currentUser,
    selectedSubmissionId,
    setSelectedSubmissionId,
    addToast,
  } = useLMS();

  const isTeacher = currentUser?.role === 'teacher';
  const availableCourses = useMemo(() => {
    return isTeacher
      ? courses.filter(
          (c) => c.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(c.id)
        )
      : courses;
  }, [courses, currentUser, isTeacher]);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openCourses, setOpenCourses] = useState({});
  const [openAssignments, setOpenAssignments] = useState({});
  const [assignmentTabs, setAssignmentTabs] = useState({});
  const [activeGradingSub, setActiveGradingSub] = useState(null);

  // If selectedSubmissionId was passed from dashboard or reminders
  useEffect(() => {
    if (selectedSubmissionId) {
      const found = submissions.find((s) => s.id === selectedSubmissionId);
      if (found) {
        setActiveGradingSub(found);
        setOpenCourses((prev) => ({ ...prev, [found.courseId]: true }));
        setOpenAssignments((prev) => ({ ...prev, [found.assignmentId]: true }));
        setAssignmentTabs((prev) => ({
          ...prev,
          [found.assignmentId]: found.status === 'Submitted' ? 'awaiting' : 'all',
        }));
      }
      setSelectedSubmissionId(null);
    }
  }, [selectedSubmissionId, submissions, setSelectedSubmissionId]);

  const teacherCourseIds = useMemo(
    () => new Set(availableCourses.map((c) => c.id)),
    [availableCourses]
  );

  const scopedSubmissions = useMemo(
    () => submissions.filter((s) => teacherCourseIds.has(s.courseId)),
    [submissions, teacherCourseIds]
  );

  const totalAwaitingCount = useMemo(
    () => scopedSubmissions.filter((s) => s.status === 'Submitted').length,
    [scopedSubmissions]
  );

  const totalGradedCount = useMemo(
    () => scopedSubmissions.filter((s) => s.status === 'Graded').length,
    [scopedSubmissions]
  );

  // Filter courses based on top course selector and search
  const displayedCourses = useMemo(() => {
    return availableCourses.filter((course) => {
      if (selectedCourseFilter !== 'all' && course.id !== selectedCourseFilter) {
        return false;
      }
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const courseMatch =
        course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
      const hasMatchingSub = scopedSubmissions.some(
        (s) =>
          s.courseId === course.id &&
          (s.studentName.toLowerCase().includes(q) || s.assignmentTitle.toLowerCase().includes(q))
      );
      const hasMatchingAsg = assignments.some(
        (a) => a.courseId === course.id && a.title.toLowerCase().includes(q)
      );

      return courseMatch || hasMatchingSub || hasMatchingAsg;
    });
  }, [availableCourses, selectedCourseFilter, search, scopedSubmissions, assignments]);

  const toggleCourse = (courseId) => {
    setOpenCourses((prev) => ({
      ...prev,
      [courseId]: prev[courseId] === undefined ? false : !prev[courseId],
    }));
  };

  const isCourseOpen = (courseId) => {
    return openCourses[courseId] !== false; // Default open
  };

  const toggleAssignment = (asgId) => {
    setOpenAssignments((prev) => ({
      ...prev,
      [asgId]: prev[asgId] === undefined ? false : !prev[asgId],
    }));
  };

  const isAssignmentOpen = (asgId, defaultOpen = true) => {
    if (openAssignments[asgId] !== undefined) return openAssignments[asgId];
    return defaultOpen;
  };

  const setAsgTab = (asgId, tabName) => {
    setAssignmentTabs((prev) => ({
      ...prev,
      [asgId]: tabName,
    }));
  };

  const getAsgTab = (asgId, awaitingCount) => {
    if (assignmentTabs[asgId]) return assignmentTabs[asgId];
    return awaitingCount > 0 ? 'awaiting' : 'all';
  };

  const expandAll = () => {
    const courseState = {};
    const asgState = {};
    availableCourses.forEach((c) => {
      courseState[c.id] = true;
    });
    assignments.forEach((a) => {
      asgState[a.id] = true;
    });
    setOpenCourses(courseState);
    setOpenAssignments(asgState);
  };

  const collapseAll = () => {
    const courseState = {};
    const asgState = {};
    availableCourses.forEach((c) => {
      courseState[c.id] = false;
    });
    assignments.forEach((a) => {
      asgState[a.id] = false;
    });
    setOpenCourses(courseState);
    setOpenAssignments(asgState);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metrics */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-flex items-center gap-1.5 mb-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Faculty Evaluation Desk</span>
            </span>
            <h2 className="text-2xl font-bold text-charcoal font-heading">
              Student Submission Review &amp; Grading
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5 max-w-2xl leading-relaxed">
              Submissions are categorized by course and individual assignment. Review student project artifacts, inspect attachments, record marks, and attach qualitative feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl border border-charcoal/15 bg-cream/30 text-charcoal text-xs font-bold hover:bg-cream transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl border border-charcoal/15 bg-cream/30 text-charcoal text-xs font-bold hover:bg-cream transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-charcoal/10">
          <div className="p-3.5 rounded-2xl bg-cream/40 border border-charcoal/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
              Active Courses
            </span>
            <span className="text-lg font-bold font-heading text-charcoal mt-0.5 block">
              {availableCourses.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cream/40 border border-charcoal/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
              Total Assignments
            </span>
            <span className="text-lg font-bold font-heading text-charcoal mt-0.5 block">
              {assignments.filter((a) => teacherCourseIds.has(a.courseId)).length}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            totalAwaitingCount > 0
              ? 'bg-amber-50/70 border-amber-300/80'
              : 'bg-cream/40 border-charcoal/10'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center justify-between">
              <span>Awaiting Review</span>
              {totalAwaitingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </span>
            <span className="text-lg font-bold font-heading text-amber-900 mt-0.5 block">
              {totalAwaitingCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-forest-50/50 border border-forest/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
              Graded Submissions
            </span>
            <span className="text-lg font-bold font-heading text-forest mt-0.5 block">
              {totalGradedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Course Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, assignment, or course..."
            className="w-full bg-white border border-charcoal/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest font-medium"
          />
        </div>

        {/* Course Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCourseFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCourseFilter === 'all'
                ? 'bg-forest text-cream shadow-xs'
                : 'bg-white text-charcoal-muted hover:text-charcoal border border-charcoal/10'
            }`}
          >
            All Courses ({totalAwaitingCount} pending)
          </button>
          {availableCourses.map((c) => {
            const coursePending = scopedSubmissions.filter(
              (s) => s.courseId === c.id && s.status === 'Submitted'
            ).length;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCourseFilter(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCourseFilter === c.id
                    ? 'bg-forest text-cream shadow-xs'
                    : 'bg-white text-charcoal-muted hover:text-charcoal border border-charcoal/10'
                }`}
              >
                <span>{c.code}</span>
                {coursePending > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gold text-charcoal font-extrabold">
                    {coursePending}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Courses and Assignments */}
      {displayedCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-charcoal/10 space-y-2">
          <AlertCircle className="w-8 h-8 text-charcoal/30 mx-auto" />
          <h4 className="text-sm font-bold font-heading text-charcoal">
            No matching courses or submissions found
          </h4>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Try adjusting your search query or selecting a different course filter above.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedCourses.map((course) => {
            const isCourseExpanded = isCourseOpen(course.id);

            // Submissions belonging to this course
            const courseSubmissions = scopedSubmissions.filter(
              (s) => s.courseId === course.id
            );

            // Course Assignments (standard + any with submissions)
            const rawCourseAssignments = assignments.filter((a) => a.courseId === course.id);
            const extraSubmissionAsgIds = [
              ...new Set(courseSubmissions.map((s) => s.assignmentId)),
            ].filter((id) => !rawCourseAssignments.some((a) => a.id === id));

            const extraAssignments = extraSubmissionAsgIds.map((extraId) => {
              const matchedSub = courseSubmissions.find((s) => s.assignmentId === extraId);
              return {
                id: extraId,
                courseId: course.id,
                title: matchedSub?.assignmentTitle || 'Course Graded Task',
                dueDate: 'N/A',
                dueTime: '',
                maxScore: matchedSub?.maxScore || 100,
                priority: 'Medium',
                description: 'Course unit deliverable and student task.',
              };
            });

            const combinedAssignments = [...rawCourseAssignments, ...extraAssignments];

            // Apply search filter to assignments if needed
            const visibleAssignments = combinedAssignments.filter((asg) => {
              if (!search.trim()) return true;
              const q = search.toLowerCase();
              const asgMatch = asg.title.toLowerCase().includes(q);
              const subMatch = courseSubmissions.some(
                (s) => s.assignmentId === asg.id && s.studentName.toLowerCase().includes(q)
              );
              return asgMatch || subMatch;
            });

            const courseAwaitingCount = courseSubmissions.filter(
              (s) => s.status === 'Submitted'
            ).length;
            const courseGradedCount = courseSubmissions.filter(
              (s) => s.status === 'Graded'
            ).length;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-charcoal/10 shadow-xs overflow-hidden transition-all"
              >
                {/* 1. Category 1: COURSE Header Bar */}
                <div
                  onClick={() => toggleCourse(course.id)}
                  className={`p-5 sm:p-6 bg-cream/40 hover:bg-cream/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                    isCourseExpanded ? 'border-b border-charcoal/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-forest text-cream flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs font-mono">
                      {course.code?.slice(0, 7) || 'CRS'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-forest uppercase tracking-wider">
                          Course Category • {course.code}
                        </span>
                        {courseAwaitingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {courseAwaitingCount} Awaiting Review
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal break-words leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Led by {course.instructor || 'Faculty Lead'} • {visibleAssignments.length} Assignments • {courseSubmissions.length} Total Submissions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs font-semibold text-charcoal-muted">
                      {isCourseExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-xl bg-white border border-charcoal/10 flex items-center justify-center text-charcoal hover:text-forest transition-colors shadow-2xs"
                    >
                      {isCourseExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Course Content: Categorized by Assignment */}
                {isCourseExpanded && (
                  <div className="p-5 sm:p-6 bg-cream/15 space-y-5">
                    {visibleAssignments.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-2xl border border-charcoal/10">
                        <FileText className="w-7 h-7 text-charcoal/25 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-charcoal">
                          No assignments found for {course.title}
                        </p>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Create an assignment in the curriculum units to receive student submissions.
                        </p>
                      </div>
                    ) : (
                      visibleAssignments.map((asg) => {
                        const isAsgExpanded = isAssignmentOpen(
                          asg.id,
                          courseSubmissions.some((s) => s.assignmentId === asg.id)
                        );

                        // Submissions for this specific assignment
                        const asgSubmissions = courseSubmissions.filter(
                          (s) => s.assignmentId === asg.id
                        );
                        const asgAwaiting = asgSubmissions.filter(
                          (s) => s.status === 'Submitted'
                        );
                        const asgGraded = asgSubmissions.filter(
                          (s) => s.status === 'Graded'
                        );

                        const currentTab = getAsgTab(asg.id, asgAwaiting.length);
                        const assignedUnitLabel =
                          asg.unitIdx !== undefined && asg.unitIdx !== null
                            ? course.syllabus?.[asg.unitIdx]?.unit || `Unit ${asg.unitIdx + 1}`
                            : null;

                        return (
                          <div
                            key={asg.id}
                            className="bg-white rounded-2xl border border-charcoal/10 shadow-2xs overflow-hidden transition-all"
                          >
                            {/* 2. Category 2: ASSIGNMENT Header Bar */}
                            <div
                              onClick={() => toggleAssignment(asg.id)}
                              className={`p-4 sm:p-5 bg-white hover:bg-cream/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer ${
                                isAsgExpanded ? 'border-b border-charcoal/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  asgAwaiting.length > 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-forest/10 text-forest'
                                }`}>
                                  <FileCheck2 className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-bold font-heading text-charcoal break-words">
                                      {asg.title}
                                    </h4>
                                    {assignedUnitLabel && (
                                      <span className="px-2 py-0.5 rounded-md bg-forest/10 text-forest text-[10px] font-bold">
                                        {assignedUnitLabel}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                                    Due {asg.dueDate} {asg.dueTime ? `(${asg.dueTime})` : ''} • Max Points: {asg.maxScore || 100} pts
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                                <span
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                    asgAwaiting.length > 0
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  }`}
                                >
                                  {asgAwaiting.length > 0
                                    ? `${asgAwaiting.length} Awaiting Review`
                                    : 'All Reviews Completed'}
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cream text-charcoal-muted border border-charcoal/10">
                                  {asgSubmissions.length} Submissions
                                </span>
                                <div className="w-6 h-6 rounded-lg bg-cream/70 flex items-center justify-center text-charcoal-muted">
                                  {isAsgExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 3. INSIDE THE ASSIGNMENT: Tabs "Awaiting Review" & "All Submissions" */}
                            {isAsgExpanded && (
                              <div className="p-4 sm:p-5 space-y-4 bg-white">
                                {/* Submissions Filter Tabs */}
                                <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
                                  <button
                                    type="button"
                                    onClick={() => setAsgTab(asg.id, 'awaiting')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                      currentTab === 'awaiting'
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                                        : 'bg-cream/60 text-charcoal-muted hover:text-charcoal hover:bg-cream border border-transparent'
                                    }`}
                                  >
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Awaiting Review ({asgAwaiting.length})</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setAsgTab(asg.id, 'all')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                      currentTab === 'all'
                                        ? 'bg-charcoal text-cream shadow-2xs'
                                        : 'bg-cream/60 text-charcoal-muted hover:text-charcoal hover:bg-cream border border-transparent'
                                    }`}
                                  >
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    <span>All Submissions ({asgSubmissions.length})</span>
                                  </button>
                                </div>

                                {/* Tab Contents: Submissions List */}
                                {currentTab === 'awaiting' ? (
                                  asgAwaiting.length === 0 ? (
                                    <div className="py-8 px-4 text-center rounded-2xl bg-forest-50/40 border border-forest/15 space-y-2">
                                      <CheckCircle2 className="w-7 h-7 text-forest mx-auto" />
                                      <p className="text-xs font-bold text-forest">
                                        All caught up! No submissions awaiting review for this assignment.
                                      </p>
                                      {asgSubmissions.length > 0 ? (
                                        <button
                                          type="button"
                                          onClick={() => setAsgTab(asg.id, 'all')}
                                          className="mt-1 px-3.5 py-1.5 rounded-xl bg-white border border-forest/30 text-forest text-xs font-bold hover:bg-forest-50 transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                                        >
                                          <ClipboardList className="w-3.5 h-3.5" />
                                          <span>View All Submissions ({asgSubmissions.length})</span>
                                        </button>
                                      ) : (
                                        <p className="text-[11px] text-charcoal-muted">
                                          Students enrolled in this course haven't submitted any deliverables yet.
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="space-y-3.5">
                                      {asgAwaiting.map((sub) => (
                                        <SubmissionCard
                                          key={sub.id}
                                          submission={sub}
                                          onGrade={() => setActiveGradingSub(sub)}
                                          addToast={addToast}
                                        />
                                      ))}
                                    </div>
                                  )
                                ) : asgSubmissions.length === 0 ? (
                                  <div className="py-8 px-4 text-center rounded-2xl bg-cream/40 border border-charcoal/10 space-y-1">
                                    <User className="w-7 h-7 text-charcoal/25 mx-auto mb-1" />
                                    <p className="text-xs font-bold text-charcoal">
                                      No submissions recorded yet
                                    </p>
                                    <p className="text-[11px] text-charcoal-muted">
                                      Student deliverables will appear here once submitted.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-3.5">
                                    {asgSubmissions.map((sub) => (
                                      <SubmissionCard
                                        key={sub.id}
                                        submission={sub}
                                        onGrade={() => setActiveGradingSub(sub)}
                                        addToast={addToast}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grading Evaluation Modal */}
      {activeGradingSub && (
        <GradingModal
          submission={activeGradingSub}
          onClose={() => setActiveGradingSub(null)}
        />
      )}
    </div>
  );
};

// Sub-component for individual submission card
const SubmissionCard = ({ submission, onGrade, addToast }) => {
  const isGraded = submission.status === 'Graded';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isGraded
          ? 'border-charcoal/10 bg-white shadow-2xs'
          : 'border-amber-200 bg-amber-50/25 shadow-xs'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left: Student info, notes, and attachments */}
        <div className="flex items-start gap-4 min-w-0">
          <img
            src={submission.studentAvatar}
            alt={submission.studentName}
            className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10 shrink-0 shadow-2xs"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold font-heading text-charcoal break-words">
                {submission.studentName}
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isGraded
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isGraded ? 'Graded' : 'Awaiting Review'}
              </span>
            </div>

            <p className="text-[11px] text-charcoal-muted mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-forest" />
              <span>Submitted: {submission.submissionDate}</span>
            </p>

            {/* Student text commentary */}
            <div className="text-xs text-charcoal mt-3 max-w-xl leading-relaxed bg-cream/50 p-3 rounded-xl border border-charcoal/5">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                Student Commentary / Deliverable Notes:
              </span>
              <p className="italic">
                "{submission.content || 'Project deliverable files and links submitted for faculty review.'}"
              </p>
            </div>

            {/* Attached Deliverables & External Links */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {submission.fileName && (
                <button
                  type="button"
                  onClick={() => addToast(`Opening file: ${submission.fileName}`, 'info')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-charcoal text-[11px] font-mono border border-charcoal/10 hover:border-forest/40 transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-forest" />
                  <span>{submission.fileName}</span>
                  {submission.fileSize && (
                    <span className="text-charcoal-muted">({submission.fileSize})</span>
                  )}
                </button>
              )}

              {submission.linkUrl && (
                <a
                  href={submission.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-forest text-[11px] font-semibold border border-charcoal/10 hover:underline hover:border-forest/40 transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Project Artifact URL</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score or Evaluation Action Button */}
        <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 self-end md:self-auto">
          {isGraded ? (
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
                Recorded Score
              </span>
              <span className="text-2xl font-extrabold text-forest font-heading">
                {submission.score}{' '}
                <span className="text-xs text-charcoal-muted font-normal">
                  / {submission.maxScore}
                </span>
              </span>
              <p className="text-[10px] text-charcoal-muted mt-0.5">
                Evaluated by {submission.gradedBy || 'Faculty'}
              </p>
            </div>
          ) : (
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Pending Evaluation
            </span>
          )}

          <button
            type="button"
            onClick={onGrade}
            className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-cream text-xs font-bold transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4 text-gold" />
            <span>{isGraded ? 'Update Grade' : 'Grade Submission'}</span>
          </button>
        </div>
      </div>

      {/* Recorded Instructor Feedback quote */}
      {isGraded && submission.feedback && (
        <div className="mt-4 pt-3 border-t border-charcoal/10 text-xs bg-forest-50/30 p-3 rounded-xl border border-forest/10">
          <span className="font-bold text-forest uppercase text-[10px] tracking-wider block mb-0.5">
            Faculty Evaluation Feedback:
          </span>
          <p className="text-charcoal leading-relaxed">
            "{submission.feedback}"
          </p>
        </div>
      )}
    </div>
  );
};
