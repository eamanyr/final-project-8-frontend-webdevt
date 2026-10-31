import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  BookOpen,
  Search,
  Filter,
  PlusCircle,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { handleCoverError, resolveCourseCover } from '../../data/coverImages';

export const CourseList = () => {
  const {
    courses,
    currentUser,
    users,
    setActiveTab,
    setSelectedCourseId,
    toggleEnrollCourse,
    searchQuery,
    setSearchQuery,
  } = useLMS();

  const [activeTabFilter, setActiveTabFilter] = useState('all');

  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  // If teacher, they can ONLY see courses assigned / led by them
  const baseCourses = isTeacher
    ? courses.filter(
        (c) => c.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(c.id)
      )
    : courses;

  const filteredCourses = baseCourses.filter((course) => {
    // Tab filter (only applies to student role)
    if (isStudent) {
      const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);
      if (activeTabFilter === 'enrolled' && !isEnrolled) return false;
      if (activeTabFilter === 'completed' && (course.progress || 0) < 100) return false;
    }

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            {isTeacher ? 'Instructor Portal' : 'Curriculum Directory'}
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            {isTeacher
              ? 'Courses Led by You'
              : isAdmin
              ? 'All Courses'
              : 'Browse & Enrolled Courses'}
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isTeacher
              ? 'Manage curriculum units, class rosters, submissions, and Google Meet online classes for your assigned studio courses'
              : 'Discover accredited studio disciplines, modern frameworks, and craft workshops'}
          </p>
        </div>

        {/* Action Button for Teachers / Admins */}
        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('create-course')}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        )}
      </div>

      {/* Tabs & Search Bar Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center bg-white rounded-full p-1 border border-charcoal/10 shadow-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTabFilter === 'all' || !isStudent
                ? 'bg-charcoal text-cream shadow-xs font-bold'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {isTeacher
              ? `My Assigned Courses (${baseCourses.length})`
              : isAdmin
              ? `All Courses (${courses.length})`
              : `Explore All (${courses.length})`}
          </button>
          {isStudent && (
            <>
              <button
                onClick={() => setActiveTabFilter('enrolled')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTabFilter === 'enrolled'
                    ? 'bg-charcoal text-cream shadow-xs font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                My Enrolled ({currentUser?.enrolledCourseIds?.length || 0})
              </button>
              <button
                onClick={() => setActiveTabFilter('completed')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTabFilter === 'completed'
                    ? 'bg-charcoal text-cream shadow-xs font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Completed
              </button>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-88">
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-charcoal-muted hover:text-charcoal"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Course Grid */}
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
                    src={resolveCourseCover(course.thumbnail)}
                    alt={course.title}
                    onError={handleCoverError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Level Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-charcoal shadow-sm backdrop-blur-xs">
                      {course.level}
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
                  className="flex-1 py-2 px-3 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors text-center"
                >
                  Course Details
                </button>

                {currentUser?.role === 'student' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEnrollCourse(course.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isEnrolled
                        ? 'bg-sage/30 text-forest hover:bg-red-50 hover:text-red-700'
                        : 'bg-forest text-cream hover:bg-forest-light'
                    }`}
                  >
                    {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
