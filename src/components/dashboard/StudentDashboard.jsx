import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight,
  Users,
  FileText
} from 'lucide-react';

export const StudentDashboard = () => {
  const {
    currentUser,
    users,
    courses,
    assignments,
    submissions,
    setActiveTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setAssignmentOrigin,
  } = useLMS();

  const [courseFilter, setCourseFilter] = useState('all');

  const enrolledCourses = courses.filter((c) =>
    currentUser?.enrolledCourseIds?.includes(c.id)
  );

  const filteredCourses = enrolledCourses.filter((c) => {
    if (courseFilter === 'active') return c.progress < 100;
    if (courseFilter === 'completed') return c.progress === 100;
    return true;
  });

  const pendingAssignments = assignments
    .filter((asg) => {
      const inEnrolledCourse =
        !currentUser?.enrolledCourseIds?.length ||
        currentUser.enrolledCourseIds.includes(asg.courseId);
      const alreadySubmitted = submissions.some(
        (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
      );
      return inEnrolledCourse && !alreadySubmitted && asg.status !== 'Graded';
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const nextAssignment = pendingAssignments[0] || null;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner (Learnthru UI Inspiration) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest via-forest-light to-sage p-6 sm:p-8 text-cream shadow-xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 text-gold-light text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-gold-light" />
            <span>CacheUp Accelerated Studio Track</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-cream tracking-tight">
            Welcome back, {currentUser?.name}!
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-cream/80 leading-relaxed font-body">
            New masterclasses in Generative Design & Kinetic Letterforms are now available. Continue learning at your own pace.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('courses')}
              className="px-5 py-2.5 rounded-xl bg-gold text-charcoal text-xs font-bold hover:bg-gold-hover transition-all shadow-md shadow-gold/20 flex items-center gap-1.5"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream text-xs font-bold backdrop-blur-xs transition-all"
            >
              View Due Assignments ({pendingAssignments.length})
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-6 -bottom-6 opacity-20 lg:opacity-30 pointer-events-none hidden sm:block">
          <div className="w-64 h-64 rounded-full border-16 border-cream/20 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-gold/30" />
          </div>
        </div>
      </div>

      {/* Key Academic Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value="75%"
          subtitle="Across 3 enrolled tracks"
          icon={TrendingUp}
          trend="+12%"
          trendPositive={true}
          colorScheme="forest"
          onClick={() => setActiveTab('progress')}
        />
        <StatCard
          title="Academy Points"
          value={`${currentUser?.points || 1450}`}
          subtitle="Top 5% in cohort"
          icon={Award}
          trend="Level 4"
          trendPositive={true}
          colorScheme="gold"
          onClick={() => setActiveTab('progress')}
        />
        <StatCard
          title="Average Score"
          value={`${currentUser?.gpa || '3.88'} GPA`}
          subtitle="92.4% exam average"
          icon={BookOpen}
          trend="+0.2"
          trendPositive={true}
          colorScheme="sage"
          onClick={() => setActiveTab('grades')}
        />
        <StatCard
          title="Study Streak"
          value={`${currentUser?.streakDays || 14} Days`}
          subtitle="42.5 total study hours"
          icon={Flame}
          trend="Active"
          trendPositive={true}
          colorScheme="gold"
        />
      </div>

      {/* My Courses Section (Art Academy UI Inspiration) */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-charcoal">
              My Courses
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Pick up right where you left off
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10">
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  courseFilter === 'all'
                    ? 'bg-charcoal text-cream shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCourseFilter('active')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  courseFilter === 'active'
                    ? 'bg-charcoal text-cream shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setCourseFilter('completed')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  courseFilter === 'completed'
                    ? 'bg-charcoal text-cream shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Completed
              </button>
            </div>

            <button
              onClick={() => setActiveTab('courses')}
              className="text-xs font-bold text-forest hover:text-gold transition-colors"
            >
              See all
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setActiveTab('course-details');
              }}
              className="group rounded-2xl border border-charcoal/10 bg-cream/30 p-4 transition-all duration-200 hover:shadow-md hover:border-forest/30 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-charcoal backdrop-blur-xs shadow-xs">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-semibold text-charcoal-muted">
                    ★ {course.rating}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                  {course.title}
                </h4>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  {course.instructorName}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 mt-3 text-[11px] text-charcoal-muted">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-forest" />
                    {(() => {
                      const totalLessons =
                        course.syllabus?.reduce((acc, u) => acc + (u.lessons || 0), 0) ||
                        course.totalLessons ||
                        6;
                      return `${totalLessons} lessons`;
                    })()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-forest" />
                    {(() => {
                      const count = (users || []).filter(
                        (u) => u.role === 'student' && u.enrolledCourseIds?.includes(course.id)
                      ).length;
                      return `${count} ${count === 1 ? 'student' : 'students'}`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-charcoal/10">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-charcoal-muted">Progress</span>
                  <span className="text-forest">{course.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-forest transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
