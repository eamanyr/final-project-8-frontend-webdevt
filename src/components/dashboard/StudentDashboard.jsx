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
  FileText,
  Star,
  Search
} from 'lucide-react';

export const StudentDashboard = () => {
  const {
    currentUser,
    users,
    courses,
    assignments,
    submissions,
    quizSubmissions,
    setActiveTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setAssignmentOrigin,
    toggleEnrollCourse,
  } = useLMS();

  const [courseFilter, setCourseFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const enrolledCourses = courses.filter((c) =>
    currentUser?.enrolledCourseIds?.includes(c.id)
  );

  const completedCourses = enrolledCourses.filter(
    (c) => (c.progress || 0) === 100
  );

  const filteredCourses = courses.filter((course) => {
    const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);
    if (courseFilter === 'enrolled' && !isEnrolled) return false;
    if (courseFilter === 'completed' && (!isEnrolled || (course.progress || 0) < 100)) return false;

    // Search query filter
    const query = searchQuery.toLowerCase().trim();
    if (
      query &&
      !course.title.toLowerCase().includes(query) &&
      !course.description.toLowerCase().includes(query) &&
      !course.instructorName.toLowerCase().includes(query) &&
      !course.code.toLowerCase().includes(query) &&
      !course.category.toLowerCase().includes(query)
    ) {
      return false;
    }

    return true;
  });

  const overallProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) /
            enrolledCourses.length
        )
      : 0;

  const pendingAssignments = assignments
    .filter((asg) => {
      const inEnrolledCourse =
        !currentUser?.enrolledCourseIds?.length ||
        currentUser.enrolledCourseIds.includes(asg.courseId);
      const alreadySubmitted = submissions.some(
        (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
      );
      return inEnrolledCourse && !alreadySubmitted;
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
      {(() => {
        const currentUserId = currentUser?.id || currentUser?._id;
        const isStella = currentUser?.id === 'usr-1';

        const myGradedSubs = (submissions || []).filter(
          (s) =>
            (s.studentId === currentUserId ||
              s.studentId === currentUser?.id ||
              s.studentId === currentUser?._id) &&
            s.status === 'Graded'
        );

        const myQuizSubs = (quizSubmissions || []).filter(
          (s) =>
            s.studentId === currentUserId ||
            s.studentId === currentUser?.id ||
            s.studentId === currentUser?._id
        );

        const totalEarnedPoints =
          myGradedSubs.reduce((acc, s) => acc + (Number(s.score) || 0), 0) +
          myQuizSubs.reduce((acc, q) => acc + (Number(q.score) || 0), 0);

        const totalMaxPoints =
          myGradedSubs.reduce((acc, s) => acc + (Number(s.maxScore) || 100), 0) +
          myQuizSubs.reduce((acc, q) => acc + (Number(q.maxScore) || 100), 0);

        const hasEvaluatedItems =
          (myGradedSubs.length + myQuizSubs.length) > 0 && totalMaxPoints > 0;
        const avgScorePercentage = hasEvaluatedItems
          ? (totalEarnedPoints / totalMaxPoints) * 100
          : null;

        const calculateGPA = (pct) => {
          if (pct === null || pct === undefined || isNaN(pct)) return 'N/A';
          const p = Number(pct);
          if (p >= 94) return '4.00';
          if (p >= 90) return '3.70';
          if (p >= 87) return '3.30';
          if (p >= 83) return '3.00';
          if (p >= 80) return '2.70';
          if (p >= 75) return '2.30';
          if (p >= 70) return '2.00';
          if (p >= 60) return '1.00';
          return '0.00';
        };

        const displayGPA = hasEvaluatedItems
          ? calculateGPA(avgScorePercentage)
          : isStella
          ? (currentUser?.gpa || '3.80')
          : (currentUser?.gpa && currentUser.gpa !== '3.80' && currentUser.gpa !== '3.88' ? currentUser.gpa : 'N/A');

        const userPoints = isStella
          ? (currentUser?.points || 1450)
          : (currentUser?.points && currentUser.points !== 1000 ? currentUser.points : (hasEvaluatedItems ? totalEarnedPoints : 0));

        const getLevelInfo = (pts) => {
          if (pts >= 1200) return { level: 'Level 4', rank: 'Top 5% in cohort' };
          if (pts >= 700) return { level: 'Level 3', rank: 'Top 20% in cohort' };
          if (pts >= 300) return { level: 'Level 2', rank: 'Active Scholar' };
          if (pts > 0) return { level: 'Level 1', rank: 'Getting Started' };
          return { level: 'Level 1', rank: '0 points earned' };
        };
        const { level: userLevel, rank: userRank } = getLevelInfo(userPoints);

        const userStreakDays = isStella
          ? (currentUser?.streakDays || 14)
          : (currentUser?.streakDays && currentUser.streakDays !== 1 ? currentUser.streakDays : 0);

        const userStudyHours = isStella
          ? (currentUser?.studyHours || 42.5)
          : (currentUser?.studyHours && currentUser.studyHours !== 10 ? currentUser.studyHours : 0);

        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overall Progress"
              value={`${overallProgress}%`}
              subtitle={
                enrolledCourses.length > 0
                  ? `${overallProgress}% Across ${enrolledCourses.length} enrolled ${enrolledCourses.length === 1 ? 'track' : 'tracks'}`
                  : 'No enrolled tracks'
              }
              icon={TrendingUp}
              trend={overallProgress > 0 ? `+${overallProgress}%` : '0%'}
              trendPositive={overallProgress > 0}
              colorScheme="forest"
              onClick={() => setActiveTab('progress')}
            />
            <StatCard
              title="Academy Points"
              value={`${userPoints}`}
              subtitle={userRank}
              icon={Award}
              trend={userLevel}
              trendPositive={userPoints > 0}
              colorScheme="gold"
              onClick={() => setActiveTab('progress')}
            />
            <StatCard
              title="Average Score"
              value={displayGPA === 'N/A' ? 'No Grades' : `${displayGPA} GPA`}
              subtitle={
                hasEvaluatedItems
                  ? `${avgScorePercentage.toFixed(1)}% evaluation average`
                  : isStella
                  ? '92.4% exam average'
                  : 'No graded submissions yet'
              }
              icon={BookOpen}
              trend={hasEvaluatedItems ? (avgScorePercentage >= 70 ? 'In Good Standing' : 'Needs Review') : isStella ? '+0.2' : 'Pending'}
              trendPositive={hasEvaluatedItems ? avgScorePercentage >= 70 : isStella}
              colorScheme="sage"
              onClick={() => setActiveTab('grades')}
            />
            <StatCard
              title="Study Streak"
              value={`${userStreakDays} ${userStreakDays === 1 ? 'Day' : 'Days'}`}
              subtitle={`${userStudyHours} total study hours`}
              icon={Flame}
              trend={userStreakDays > 0 ? 'Active' : 'Inactive'}
              trendPositive={userStreakDays > 0}
              colorScheme="gold"
            />
          </div>
        );
      })()}

      {/* Course Catalog & Enrolled Tracks (Matching Course List Layout in Image 2) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Pills matching Image 2 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setCourseFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                courseFilter === 'all'
                  ? 'bg-charcoal text-cream shadow-xs font-bold'
                  : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
              }`}
            >
              Explore All ({courses.length})
            </button>
            <button
              onClick={() => setCourseFilter('enrolled')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                courseFilter === 'enrolled'
                  ? 'bg-charcoal text-cream shadow-xs font-bold'
                  : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
              }`}
            >
              My Enrolled ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setCourseFilter('completed')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                courseFilter === 'completed'
                  ? 'bg-charcoal text-cream shadow-xs font-bold'
                  : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
              }`}
            >
              Completed ({completedCourses.length})
            </button>
          </div>

          {/* Search bar matching Image 2 */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, instructors, codes, disciplines..."
              className="w-full bg-white border border-charcoal/15 rounded-full pl-10 pr-14 py-2 text-xs text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid matching Image 2 */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-charcoal/10 shadow-xs">
            <BookOpen className="w-10 h-10 text-charcoal/30 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-charcoal">No courses found</h4>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No courses matching "${searchQuery}". Try a different search term or clear the filter.`
                : courseFilter === 'enrolled'
                ? "You haven't enrolled in any courses yet. Switch to 'Explore All' to start learning!"
                : "No completed courses found yet. Keep progressing through your enrolled curriculum!"}
            </p>
            {(searchQuery || courseFilter !== 'all') && (
              <button
                onClick={() => {
                  setCourseFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all cursor-pointer"
              >
                Browse All Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setActiveTab('course-details');
                  }}
                  className="bg-white rounded-3xl border border-charcoal/10 overflow-hidden shadow-xs hover:shadow-lg hover:border-forest/30 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Course Image Header */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-charcoal shadow-sm backdrop-blur-xs">
                          {course.level}
                        </span>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-charcoal/80 text-gold flex items-center gap-1 backdrop-blur-xs shadow-sm">
                          <Star className="w-3 h-3 fill-gold" />
                          <span>{course.rating}</span>
                        </span>
                      </div>

                      {/* Code & Category Tag */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-forest/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {course.code}
                        </span>
                        <span className="text-xs font-medium ml-2 text-cream/90">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Body */}
                    <div className="p-5">
                      <h3 className="text-base font-bold font-heading text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                        {course.title}
                      </h3>

                      <p className="text-xs text-charcoal-muted mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Instructor snippet */}
                      <div className="mt-4 flex items-center gap-2.5">
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructorName}
                          className="w-7 h-7 rounded-full object-cover border border-charcoal/10"
                        />
                        <span className="text-xs font-semibold text-charcoal">
                          {course.instructorName}
                        </span>
                      </div>

                      {/* Course stats */}
                      <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs text-charcoal-muted">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-forest" />
                          {(() => {
                            const totalLessons =
                              course.syllabus?.reduce((acc, u) => acc + (u.lessons || 0), 0) ||
                              course.totalLessons ||
                              6;
                            return `${totalLessons} Lessons`;
                          })()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-forest" />
                          {(() => {
                            const count = (users || []).filter(
                              (u) => u.role === 'student' && u.enrolledCourseIds?.includes(course.id)
                            ).length;
                            return `${count} ${count === 1 ? 'Learner' : 'Learners'}`;
                          })()}
                        </span>
                        <span className="font-medium text-charcoal">
                          {course.duration}
                        </span>
                      </div>

                      {/* Progress Bar (if enrolled) */}
                      {isEnrolled && (
                        <div className="mt-4 p-2.5 rounded-xl bg-cream/70 border border-charcoal/5">
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="text-charcoal-muted">Course Completion</span>
                            <span className="text-forest">{course.progress || 0}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-charcoal/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-forest transition-all duration-500"
                              style={{ width: `${course.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourseId(course.id);
                        setActiveTab('course-details');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors text-center cursor-pointer"
                    >
                      Course Details
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEnrollCourse(course.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isEnrolled
                          ? 'bg-sage/30 text-forest hover:bg-red-50 hover:text-red-700'
                          : 'bg-forest text-cream hover:bg-forest-light'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
