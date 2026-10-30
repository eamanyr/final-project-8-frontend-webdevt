import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Star,
  PlusCircle,
  FileCheck2,
  FolderPlus,
  Bell,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react';

export const TeacherDashboard = () => {
  const {
    currentUser,
    users,
    courses,
    submissions,
    assignments,
    setActiveTab,
    setSelectedCourseId,
    setSelectedSubmissionId,
  } = useLMS();

  // Filter courses taught by this teacher
  const myCourses = courses.filter(
    (c) =>
      c.instructorId === currentUser?.id ||
      (currentUser?._id && c.instructorId === currentUser?._id) ||
      currentUser?.assignedCourseIds?.includes(c.id) ||
      (c._id && currentUser?.assignedCourseIds?.includes(c._id)) ||
      (c.instructorName &&
        currentUser?.name &&
        c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
  );

  // Filter pending submissions strictly for courses taught by this teacher
  const myCourseIds = new Set(myCourses.map((c) => c.id));
  const pendingSubmissions = submissions.filter(
    (s) => s.status === 'Submitted' && myCourseIds.has(s.courseId)
  );

  const totalStudents = myCourses.reduce(
    (acc, c) =>
      acc +
      (users || []).filter(
        (u) => u.role === 'student' && u.enrolledCourseIds?.includes(c.id)
      ).length,
    0
  );

  const teacherFirstName = (currentUser?.name || '')
    .replace(/^Prof\.\s*/i, '')
    .trim()
    .split(' ')[0] || 'Faculty';

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Instructor Portal
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Hello Prof. {teacherFirstName}!
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {currentUser?.title || 'Course Instructor'} • {currentUser?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('create-course')}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Course</span>
          </button>
          <button
            onClick={() => setActiveTab('create-assignment')}
            className="px-4 py-2 rounded-xl bg-gold text-charcoal text-xs font-bold hover:bg-gold-hover transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* Teacher Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={myCourses.length}
          subtitle="Currently published"
          icon={BookOpen}
          colorScheme="forest"
          onClick={() => setActiveTab('courses')}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across your classes"
          icon={Users}
          trend="+18"
          trendPositive={true}
          colorScheme="sage"
        />
        <StatCard
          title="Pending Submissions"
          value={pendingSubmissions.length}
          subtitle="Awaiting your grading"
          icon={ClipboardCheck}
          trend={pendingSubmissions.length > 0 ? 'Urgent' : 'All clear'}
          trendPositive={pendingSubmissions.length === 0}
          colorScheme="gold"
          onClick={() => setActiveTab('submissions')}
        />
        <StatCard
          title="Instructor Rating"
          value="4.95"
          subtitle="Based on 112 student reviews"
          icon={Star}
          trend="Top Tier"
          trendPositive={true}
          colorScheme="charcoal"
        />
      </div>

      {/* Urgent Grading Queue */}
      <div className="@container bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold font-heading text-charcoal">
              Submissions Awaiting Grading
            </h3>
            {pendingSubmissions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                {pendingSubmissions.length} pending
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('submissions')}
            className="text-xs font-bold text-forest hover:text-gold transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All Submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="text-center py-8 text-charcoal-muted text-xs">
            🎉 All caught up! No student submissions currently require grading.
          </div>
        ) : (
          <>
            {/* Narrow space: one card per submission */}
            <ul className="@3xl:hidden space-y-3">
              {pendingSubmissions.map((sub) => (
                <li
                  key={sub.id}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.studentAvatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-charcoal/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-charcoal truncate">
                        {sub.studentName}
                      </p>
                      <p className="text-[11px] text-charcoal-muted">
                        Submitted {sub.submissionDate}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs font-medium text-charcoal">
                    {sub.assignmentTitle}
                  </p>
                  <span className="mt-2 inline-block max-w-full truncate align-middle text-[11px] font-mono text-forest bg-sage/20 px-2 py-0.5 rounded-md">
                    {sub.fileName}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedSubmissionId(sub.id);
                      setActiveTab('submissions');
                    }}
                    className="mt-3 w-full px-3 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-xs"
                  >
                    Grade Work
                  </button>
                </li>
              ))}
            </ul>

            {/* Wide space: the normal table */}
            <div className="hidden @3xl:block overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4 font-bold">Student</th>
                    <th className="pb-3 pr-4 font-bold">Assignment</th>
                    <th className="pb-3 pr-4 font-bold">Submitted Date</th>
                    <th className="pb-3 pr-4 font-bold">Attachment</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-charcoal/10"
                          />
                          <span className="font-semibold text-charcoal">
                            {sub.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-charcoal max-w-xs truncate">
                        {sub.assignmentTitle}
                      </td>
                      <td className="py-3 pr-4 text-charcoal-muted whitespace-nowrap">
                        {sub.submissionDate}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-[11px] font-mono text-forest bg-sage/20 px-2 py-0.5 rounded-md">
                          {sub.fileName}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedSubmissionId(sub.id);
                            setActiveTab('submissions');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-forest text-cream text-[11px] font-bold hover:bg-forest-light transition-all shadow-xs whitespace-nowrap"
                        >
                          Grade Work
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Courses Taught by Teacher */}
      <div className="@container bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold font-heading text-charcoal">
            My Courses & Class Lists
          </h3>
          <button
            onClick={() => setActiveTab('create-course')}
            className="text-xs font-bold text-forest hover:underline"
          >
            + Create another course
          </button>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-2xl border border-charcoal/10 bg-cream/30 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={course.thumbnail}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-charcoal/10 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-forest">
                    {course.code}
                  </span>
                  <h4 className="text-xs font-bold text-charcoal line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    {(() => {
                      const count = (users || []).filter(
                        (u) => u.role === 'student' && u.enrolledCourseIds?.includes(course.id)
                      ).length;
                      return `${count} ${count === 1 ? 'student' : 'students'} enrolled`;
                    })()} • {course.syllabus?.reduce((acc, u) => acc + (u.lessons || 0), 0) || course.totalLessons || 6} lessons
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setActiveTab('course-details');
                  }}
                  className="px-3 py-1 rounded-xl bg-charcoal text-cream text-[11px] font-bold hover:bg-charcoal-light transition-colors whitespace-nowrap"
                >
                  View Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};