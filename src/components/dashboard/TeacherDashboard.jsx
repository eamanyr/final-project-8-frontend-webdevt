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
    courses,
    submissions,
    assignments,
    setActiveTab,
    setSelectedCourseId,
    setSelectedSubmissionId,
  } = useLMS();

  // Filter courses taught by this teacher
  const myCourses = courses.filter(
    (c) => c.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(c.id)
  );

  // Filter pending submissions
  const pendingSubmissions = submissions.filter((s) => s.status === 'Submitted');

  const totalStudents = myCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Instructor Portal
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Welcome back, {currentUser?.name}!
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
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-heading text-charcoal">
              Submissions Awaiting Grading
            </h3>
            {pendingSubmissions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {pendingSubmissions.length} pending
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('submissions')}
            className="text-xs font-bold text-forest hover:text-gold transition-colors flex items-center gap-1"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Student</th>
                  <th className="pb-3 font-bold">Assignment</th>
                  <th className="pb-3 font-bold">Submitted Date</th>
                  <th className="pb-3 font-bold">Attachment</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {pendingSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3">
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
                    <td className="py-3 font-medium text-charcoal max-w-xs truncate">
                      {sub.assignmentTitle}
                    </td>
                    <td className="py-3 text-charcoal-muted">
                      {sub.submissionDate}
                    </td>
                    <td className="py-3">
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
                        className="px-3 py-1.5 rounded-xl bg-forest text-cream text-[11px] font-bold hover:bg-forest-light transition-all shadow-xs"
                      >
                        Grade Work
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Courses Taught by Teacher */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-2xl border border-charcoal/10 bg-cream/30 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={course.thumbnail}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-charcoal/10 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-forest">
                    {course.code}
                  </span>
                  <h4 className="text-xs font-bold text-charcoal line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    {course.studentsCount} enrolled • {course.totalLessons} lessons
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setActiveTab('course-details');
                  }}
                  className="px-3 py-1 rounded-xl bg-charcoal text-cream text-[11px] font-bold hover:bg-charcoal-light transition-colors"
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
