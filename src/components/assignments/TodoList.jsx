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
  ShieldCheck,
  UserCheck,
  Users,
  ClipboardList,
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
    users,
    pendingApprovalsCount,
    setActiveTab,
    setSelectedAssignmentId,
    setSelectedSubmissionId,
  } = useLMS();

  // Default sort: what was published first
  const [sortBy, setSortBy] = useState('published'); // 'published' | 'dueDate' | 'priority'
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('todo'); // 'todo' | 'completed'

  // If user is Teacher, teachers do not have a To-Do list. Render instructor submissions queue.
  if (currentUser?.role === 'teacher') {
    const teacherCourses = courses.filter(
      (c) =>
        c.instructorId === currentUser?.id ||
        (currentUser?._id && c.instructorId === currentUser?._id) ||
        currentUser?.assignedCourseIds?.includes(c.id) ||
        (c._id && currentUser?.assignedCourseIds?.includes(c._id)) ||
        (c.instructorName &&
          currentUser?.name &&
          c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    );
    const teacherCourseIds = new Set(teacherCourses.map((c) => c.id));
    const pendingTeacherSubmissions = (submissions || []).filter(
      (s) => s.status === 'Submitted' && teacherCourseIds.has(s.courseId)
    );

    return (
      <div className="space-y-6">
        {/* Top Header Banner for Teacher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-flex items-center gap-1.5 mb-1">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Faculty Portal</span>
            </span>
            <h2 className="text-2xl font-bold text-charcoal font-heading">
              Instructor Submissions Queue
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Faculty instructors do not have personal homework assignments or a student To-Do list. Manage your course curriculum and student grading queue below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('submissions')}
              className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-gold" />
              <span>Submission Review ({pendingTeacherSubmissions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('create-assignment')}
              className="px-4 py-2 rounded-xl bg-gold text-charcoal text-xs font-bold hover:bg-gold-hover transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Role Scoping Notice */}
        <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-forest shrink-0 mt-0.5" />
          <div className="text-xs text-charcoal leading-relaxed">
            <span className="font-bold text-forest">Role-Based Workflow:</span> As a course instructor ({currentUser?.name}), you assign coursework and grade learner submissions. Student homework To-Do lists are exclusively scoped to enrolled learners.
          </div>
        </div>

        {/* Submissions Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold font-heading text-charcoal">
              Submissions Awaiting Grading ({pendingTeacherSubmissions.length})
            </h3>
            <button
              onClick={() => setActiveTab('submissions')}
              className="text-xs font-bold text-forest hover:underline cursor-pointer"
            >
              Open Full Review Panel →
            </button>
          </div>

          {pendingTeacherSubmissions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-charcoal/10 text-center text-charcoal-muted text-xs">
              🎉 No submissions currently awaiting your review! All submitted coursework has been evaluated.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTeacherSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubmissionId(sub.id);
                    setActiveTab('submissions');
                  }}
                  className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-2xs hover:border-forest/30 transition-all cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={sub.studentAvatar}
                      alt={sub.studentName}
                      className="w-10 h-10 rounded-2xl object-cover border border-charcoal/10 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15">
                        Awaiting Grade
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-charcoal mt-1 group-hover:text-forest transition-colors">
                        {sub.assignmentTitle}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        {sub.studentName} • {sub.courseName}
                      </p>
                      <p className="text-[10px] text-charcoal-muted mt-1 font-mono">
                        Submitted: {sub.submittedDate}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal-muted group-hover:text-forest group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If user is Admin, render Administrative Action Items instead of course homework assignments
  if (currentUser?.role === 'admin') {
    const pendingApplicants = (users || []).filter((u) => u.status === 'pending');
    return (
      <div className="space-y-6">
        {/* Top Header Banner for Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Registry</span>
            </span>
            <h2 className="text-2xl font-bold text-charcoal font-heading">
              Admin Action Items
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Super-administrator pending tasks, admissions reviews, and platform governance. Administrators do not have course homework assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('approvals')}
              className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-gold" />
              <span>Pending Admissions ({pendingApprovalsCount})</span>
            </button>
          </div>
        </div>

        {/* Notice Card: Clear Role-Based Scoping Explanation */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Role-Based Scoping:</span> As a platform administrator ({currentUser?.name}), you do not have academic homework assignments or submission tasks. Your To-Do list consists of institutional applicant reviews, accreditation management, and course audits.
          </div>
        </div>

        {/* Administrative Task Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold font-heading text-charcoal px-1">
            Pending Institutional Action Items ({pendingApplicants.length + 2})
          </h3>

          {/* 1. Pending Applicant Review Items */}
          {pendingApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-2xs hover:border-forest/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center font-bold text-xs shrink-0 border border-gold/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      Admission Review Needed
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream text-charcoal-muted">
                      ID: {applicant.studentId || 'New Applicant'}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-charcoal mt-1">
                    Review Application: {applicant.name}
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Target Department: {applicant.department} • Applied: {applicant.joinedDate}
                  </p>
                  {applicant.registrationNotes && (
                    <p className="text-xs text-charcoal bg-cream/40 p-2.5 rounded-xl border border-charcoal/10 mt-2 italic">
                      "{applicant.registrationNotes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  onClick={() => setActiveTab('approvals')}
                  className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Review Application</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* 2. Course & Curriculum Audit Item */}
          <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-2xs hover:border-forest/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0 border border-forest/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest-50 text-forest border border-forest/20">
                    Curriculum Governance
                  </span>
                  <span className="text-xs font-semibold text-charcoal-muted">
                    Academic Directory
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-charcoal mt-1">
                  Faculty Assignment &amp; Course Capacities Audit
                </h4>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Verify teacher allocations and minimum student counts across {courses.length} active studio courses.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('courses')}
                className="px-4 py-2 rounded-xl border border-charcoal/20 bg-cream/50 hover:bg-cream text-xs font-bold text-charcoal transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Inspect All Courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. User Accreditation & Role Audit Item */}
          <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-2xs hover:border-forest/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sage/20 text-forest flex items-center justify-center font-bold text-xs shrink-0 border border-sage/30">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-50 text-forest border border-sage/20">
                    Platform Governance
                  </span>
                  <span className="text-xs font-semibold text-charcoal-muted">
                    Registry
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-charcoal mt-1">
                  User Accreditation &amp; Security Verification
                </h4>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Manage active student and faculty accounts, edit credentials, and oversee permissions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 rounded-xl border border-charcoal/20 bg-cream/50 hover:bg-cream text-xs font-bold text-charcoal transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Manage Users</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      const currentUserId = currentUser?.id || currentUser?._id;
      const asgId = asg?.id || asg?._id;
      const hasSubmission = (submissions || []).some((s) => {
        const subAsgId = s?.assignmentId?._id || s?.assignmentId?.id || s?.assignmentId;
        const subStudentId = s?.studentId?._id || s?.studentId?.id || s?.studentId;
        return (
          (String(subAsgId) === String(asgId) || String(subAsgId) === String(asg?.id) || String(subAsgId) === String(asg?._id)) &&
          (String(subStudentId) === String(currentUserId))
        );
      });
      return hasSubmission;
    }
    return false;
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
            const asgId = asg?.id || asg?._id;
            const currentUserId = currentUser?.id || currentUser?._id;
            const mySubmission = (submissions || []).find((s) => {
              const subAsgId = s?.assignmentId?._id || s?.assignmentId?.id || s?.assignmentId;
              const subStudentId = s?.studentId?._id || s?.studentId?.id || s?.studentId;
              return (
                (String(subAsgId) === String(asgId) || String(subAsgId) === String(asg?.id) || String(subAsgId) === String(asg?._id)) &&
                (String(subStudentId) === String(currentUserId))
              );
            });

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
