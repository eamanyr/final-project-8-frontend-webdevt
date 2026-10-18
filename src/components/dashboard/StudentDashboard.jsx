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
    courses,
    assignments,
    setActiveTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
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

  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');

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
                    {course.totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-forest" />
                    {course.studentsCount} students
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

      {/* Assignments & Home Tasks (Direct UI Inspiration Replica) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments Card (Left 1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-heading text-charcoal">
                Assignments
              </h3>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-charcoal-muted hover:text-forest"
              >
                Share / View
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cream border border-charcoal/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal">
                    Award Show Discussion
                  </h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                    28 June 2026, 12:50 AM
                  </p>
                  <p className="text-[11px] font-semibold text-forest mt-1">
                    Duration: 02 h 45 m
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-charcoal/10">
                <button
                  onClick={() => alert('Reschedule request sent to instructor.')}
                  className="flex-1 py-1.5 px-3 rounded-xl border border-charcoal/20 text-[11px] font-bold text-charcoal hover:bg-white transition-colors"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => {
                    setSelectedAssignmentId('asg-1');
                    setActiveTab('assignment-submit');
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-forest text-cream text-[11px] font-bold hover:bg-forest-light transition-colors shadow-xs"
                >
                  Submit Work
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Home Tasks Cards (Right 2 cols - exact UI match: Texture & Detail + Circles & Ovals) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-charcoal">
              Home Tasks
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-charcoal-muted">Today</span>
              <button
                onClick={() => setActiveTab('assignments')}
                className="font-bold text-forest hover:underline"
              >
                View all tasks →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Task Card: Texture & Detail */}
            <div
              onClick={() => {
                setSelectedAssignmentId('asg-1');
                setActiveTab('assignment-details');
              }}
              className="p-5 rounded-3xl bg-charcoal text-cream flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-transform shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-heading text-cream">
                    Texture & Detail
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-gold">
                    High ↗
                  </span>
                </div>
                <p className="text-[11px] text-cream/70 mt-2 leading-relaxed">
                  How to analyze and draw any subject by simplifying it into basic shapes.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-cream/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cream/60 block">Course</span>
                  <span className="text-xs font-bold text-cream">History Of Design</span>
                </div>
                <div className="flex -space-x-2">
                  <img
                    className="w-6 h-6 rounded-full border-2 border-charcoal"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt=""
                  />
                  <img
                    className="w-6 h-6 rounded-full border-2 border-charcoal"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt=""
                  />
                  <img
                    className="w-6 h-6 rounded-full border-2 border-charcoal"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* Gold Task Card: Circles & Ovals */}
            <div
              onClick={() => {
                setSelectedAssignmentId('asg-2');
                setActiveTab('assignment-details');
              }}
              className="p-5 rounded-3xl bg-gold text-charcoal flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition-transform shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-heading text-charcoal">
                    Circles & Ovals
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/15 text-charcoal">
                    Low ↘
                  </span>
                </div>
                <p className="text-[11px] text-charcoal/80 mt-2 leading-relaxed">
                  Your circles should vary in size and your ovals should vary in size, angle and openness.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal/70 block">Course</span>
                  <span className="text-xs font-bold text-charcoal">
                    Illustration Techniques
                  </span>
                </div>
                <div className="flex -space-x-2">
                  <img
                    className="w-6 h-6 rounded-full border-2 border-gold"
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                    alt=""
                  />
                  <img
                    className="w-6 h-6 rounded-full border-2 border-gold"
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
