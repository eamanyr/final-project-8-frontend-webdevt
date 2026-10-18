import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { buildCourseUnitsWithItems } from '../../data/courseCurriculum';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ClipboardCheck,
  ArrowDown,
  Star,
  Award,
  MessageSquare,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LessonPage = () => {
  const {
    courses,
    customLessons,
    selectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    assignments,
    materials,
    submissions,
    currentUser,
    markLessonAsViewed,
    setActiveTab,
    setSelectedAssignmentId,
    setAssignmentOrigin,
    courseRatings,
    rateCourse,
    markCourseComplete,
  } = useLMS();

  const isTeacher = currentUser?.role === 'teacher';
  const availableCourses = isTeacher
    ? courses.filter(
        (c) => c.instructorId === currentUser?.id || currentUser?.assignedCourseIds?.includes(c.id)
      )
    : courses;

  const course =
    (isTeacher ? availableCourses : courses).find((c) => c.id === selectedCourseId) ||
    (isTeacher ? availableCourses[0] : courses[0]);
  if (!course) return null;

  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const units = buildCourseUnitsWithItems(
    course,
    courseAssignments,
    courseMaterials,
    customLessons
  );

  const allLessons = units.flatMap((u) => u.lessons);
  const currentLesson =
    allLessons.find((l) => l.id === selectedLessonId) || allLessons[0];

  if (!currentLesson) return null;

  const currentUnit =
    units.find((u) => u.unitIdx === currentLesson.unitIdx) || units[0];
  const lessonIdxInUnit = currentUnit.lessons.findIndex(
    (l) => l.id === currentLesson.id
  );
  const globalLessonIdx = allLessons.findIndex((l) => l.id === currentLesson.id);

  const prevLesson =
    globalLessonIdx > 0 ? allLessons[globalLessonIdx - 1] : null;
  const nextLessonInUnit =
    lessonIdxInUnit < currentUnit.lessons.length - 1
      ? currentUnit.lessons[lessonIdxInUnit + 1]
      : null;

  // Check if current unit has an assignment/task to accomplish before moving to next unit
  const unitAssignment = currentUnit.assignments?.[0] || null;
  const isUnitAssignmentCompleted = unitAssignment
    ? submissions.some(
        (s) =>
          s.assignmentId === unitAssignment.id &&
          s.studentId === currentUser?.id
      ) || unitAssignment.status === 'Graded'
    : true;

  const nextUnitFirstLesson =
    currentUnit.unitIdx < units.length - 1
      ? units[currentUnit.unitIdx + 1]?.lessons?.[0] || null
      : null;

  // Course completion & rating parameters
  const isLastLesson = globalLessonIdx === allLessons.length - 1;
  const isCourseCompleted =
    course.progress === 100 || course.completedLessons >= course.totalLessons;
  const shouldShowRating = isLastLesson || isCourseCompleted;

  const courseReviews = courseRatings?.[course.id] || [];
  const userExistingReview = courseReviews.find(
    (r) => r.studentId === currentUser?.id
  );

  const [ratingScore, setRatingScore] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCommunityReviews, setShowCommunityReviews] = useState(false);

  useEffect(() => {
    if (userExistingReview) {
      setRatingScore(userExistingReview.rating || 5);
      setSelectedTags(userExistingReview.tags || []);
      setReviewText(userExistingReview.review || '');
    } else {
      setRatingScore(5);
      setSelectedTags([]);
      setReviewText('');
    }
  }, [userExistingReview?.id, course.id]);

  const RATING_TAG_OPTIONS = [
    'Inspiring Instructor',
    'Clear & Structured Syllabus',
    'Practical Studio Exercises',
    'Constructive Critique',
    'Portfolio-Ready Outcomes',
    'Challenging & Rewarding',
  ];

  const STAR_DESCRIPTIONS = {
    1: '⭐ 1.0 — Needs Improvement',
    2: '⭐⭐ 2.0 — Fair / Average',
    3: '⭐⭐⭐ 3.0 — Good Studio Experience',
    4: '⭐⭐⭐⭐ 4.0 — Very Good & Informative',
    5: '⭐⭐⭐⭐⭐ 5.0 — Exceptional Masterclass!',
  };

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    rateCourse(course.id, {
      rating: ratingScore,
      review: reviewText,
      tags: selectedTags,
    });
    setIsEditing(false);
  };

  const handleGoToLesson = (lesson) => {
    if (!lesson) return;
    markLessonAsViewed(lesson.id);
    setSelectedLessonId(lesson.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToUnitTask = (asg) => {
    if (!asg) return;
    setAssignmentOrigin('course-details');
    setSelectedAssignmentId(asg.id);
    setActiveTab('assignment-details');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('course-details')}
            className="font-bold text-forest hover:underline cursor-pointer"
          >
            {course.code}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted" />
          <button
            onClick={() => setActiveTab('course-details')}
            className="font-semibold text-charcoal-muted hover:text-forest transition-colors cursor-pointer"
          >
            {currentLesson.unitLabel}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted" />
          <span className="font-bold text-charcoal truncate max-w-xs sm:max-w-md">
            {currentLesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 text-forest border border-forest/20 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Viewed</span>
          </span>
          <button
            onClick={() => setActiveTab('course-details')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-charcoal/15 bg-cream/60 hover:bg-cream text-xs font-bold text-charcoal transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course Units</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Content Card (CacheUp Studio Theme) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs space-y-6">
        {/* Page Heading */}
        <div className="border-b border-charcoal/10 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1.5">
            {currentLesson.unitLabel} • Lesson {currentLesson.lessonNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal font-heading tracking-tight">
            {currentLesson.unitLabel}: {currentLesson.title}
          </h1>
        </div>

        {/* Course & Unit Banner (Matching CacheUp Forest / Sage / Gold Design) */}
        <div className="relative rounded-3xl overflow-hidden border border-charcoal/10 shadow-md bg-gradient-to-r from-forest via-forest-light to-sage min-h-[180px] sm:min-h-[200px] flex flex-col md:flex-row items-stretch">
          {/* Left Emblem & Unit Info */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 z-10 text-cream">
            {/* Academy Emblem */}
            <div className="w-18 h-18 rounded-2xl bg-cream text-forest flex flex-col items-center justify-center shadow-md shrink-0 border-2 border-gold/40">
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-forest-light">
                {course.code}
              </span>
              <BookOpen className="w-7 h-7 my-0.5 text-forest stroke-[2.2]" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">
                CacheUp
              </span>
            </div>

            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cream/15 text-gold-light text-[11px] font-semibold backdrop-blur-xs mb-1.5">
                <Sparkles className="w-3 h-3 fill-gold-light" />
                <span>
                  {course.code} • {currentLesson.unitLabel}
                </span>
              </div>
              <div className="text-lg sm:text-2xl font-extrabold font-heading text-cream leading-snug">
                {currentLesson.unitTitle}
              </div>
              <p className="text-xs text-cream/80 mt-1 font-medium">
                {course.title} • Instructor: {course.instructorName}
              </p>
            </div>
          </div>

          {/* Right Studio Thumbnail / Decorative Visual */}
          <div className="md:w-72 lg:w-80 relative overflow-hidden shrink-0 h-40 md:h-auto bg-forest-dark/30 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-8 border-cream/15 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full border-4 border-gold/25" />
            </div>
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-forest-light/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Centered Topic Title */}
        <div className="text-center pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted block">
            Core Topic Breakdown
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-forest mt-1 font-heading">
            {currentLesson.topicHeading}
          </h2>
        </div>

        {/* Layered Topic Callout Sections (CacheUp Forest / Sage / Cream Palette) */}
        <div className="space-y-3">
          {/* Section 1: Primary Definition */}
          <div className="bg-forest-100/80 border border-forest/15 rounded-2xl p-5 sm:p-6 text-charcoal">
            <div className="flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-lg bg-forest text-cream text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs select-none">
                ➤
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-charcoal">
                {currentLesson.definition}
              </p>
            </div>
          </div>

          {/* Section 2: Major Functions / Key Principles */}
          <div className="bg-sage-light/65 border border-sage-dark/20 rounded-2xl p-5 sm:p-6 text-charcoal">
            <div className="flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-lg bg-forest text-gold-light text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs select-none">
                ➤
              </span>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold font-heading text-forest">
                  {currentLesson.majorFunctionsTitle}
                </h3>
                <ul className="mt-2.5 space-y-2 list-disc list-inside text-xs sm:text-sm text-charcoal font-medium pl-1">
                  {currentLesson.majorFunctions?.map((fn, i) => (
                    <li key={i} className="leading-relaxed">
                      {fn}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Core Parts / Terminology + Concept Flow Diagram */}
          <div className="bg-cream/90 border border-charcoal/10 rounded-2xl p-5 sm:p-6 text-charcoal">
            <div className="flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-lg bg-gold text-charcoal text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs select-none">
                ➤
              </span>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold font-heading text-charcoal">
                  {currentLesson.partsTitle}
                </h3>
                <ul className="mt-2.5 space-y-2.5 text-xs sm:text-sm text-charcoal pl-1">
                  {currentLesson.parts?.map((part, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="font-bold text-forest">
                        • {part.term}
                      </span>{' '}
                      – {part.desc}
                    </li>
                  ))}
                </ul>

                {/* Embedded Visual Architecture / Concept Diagram */}
                {currentLesson.diagram && (
                  <div className="mt-6 bg-white rounded-2xl p-6 max-w-md mx-auto shadow-xs border border-charcoal/10 flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted mb-3">
                      Conceptual Workflow Diagram
                    </span>
                    <div className="px-4 py-2.5 rounded-xl border border-charcoal/20 bg-cream text-xs font-bold text-charcoal w-64 shadow-2xs">
                      {currentLesson.diagram.top}
                    </div>
                    <ArrowDown className="w-4 h-4 text-forest my-1.5" />
                    <div className="px-4 py-2.5 rounded-xl border border-forest/30 bg-forest-50 text-xs font-bold text-forest w-64 shadow-2xs">
                      {currentLesson.diagram.middle1}
                    </div>
                    <ArrowDown className="w-4 h-4 text-forest my-1.5" />
                    <div className="px-4 py-2.5 rounded-xl border border-gold-dark/30 bg-gold-light text-xs font-bold text-charcoal w-64 shadow-2xs">
                      {currentLesson.diagram.middle2}
                    </div>
                    <ArrowDown className="w-4 h-4 text-forest my-1.5" />
                    <div className="px-4 py-2.5 rounded-xl border border-forest bg-forest text-xs font-bold text-cream w-64 shadow-xs">
                      {currentLesson.diagram.bottom}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Completion & Rating Section (Rendered in the last part of the lessons when course is completed or on the final lesson) */}
        {shouldShowRating && (
          <div className="pt-6 border-t border-charcoal/10">
            <div className="bg-gradient-to-br from-cream/40 via-white to-cream/70 rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-charcoal flex items-center justify-center shadow-xs shrink-0">
                    <Award className="w-6 h-6 text-charcoal stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest text-cream">
                        {isCourseCompleted ? 'Course Completed' : 'Final Lesson Reached'}
                      </span>
                      <span className="text-xs font-semibold text-charcoal-muted">
                        {course.code} • {course.title}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black font-heading text-charcoal mt-0.5">
                      Course Evaluation &amp; Rating
                    </h3>
                  </div>
                </div>

                {!isCourseCompleted && !isTeacher && (
                  <button
                    type="button"
                    onClick={() => markCourseComplete(course.id)}
                    className="px-4 py-2 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold" />
                    <span>Mark as Completed</span>
                  </button>
                )}
              </div>

              {/* Content depending on role and rating state */}
              {isTeacher ? (
                /* Faculty Overview */
                <div className="bg-white/85 rounded-2xl p-5 border border-charcoal/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                        Faculty Overview
                      </span>
                      <h4 className="text-sm font-bold text-charcoal">
                        Student Reviews &amp; Evaluations
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 bg-cream px-3 py-1.5 rounded-xl border border-charcoal/10 self-start sm:self-auto">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-xs font-bold text-charcoal">
                        {course.rating} / 5.0
                      </span>
                      <span className="text-[11px] text-charcoal-muted">
                        ({courseReviews.length} reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-muted">
                    Below are studio critiques and ratings submitted by enrolled students for {course.title}.
                  </p>
                </div>
              ) : userExistingReview && !isEditing ? (
                /* Already Reviewed by Current Student */
                <div className="bg-white rounded-2xl p-5 border border-forest/20 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-forest" />
                        You have reviewed this course
                      </span>
                      <span className="text-[11px] text-charcoal-muted">
                        • {userExistingReview.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline cursor-pointer self-start sm:self-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Your Review</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= userExistingReview.rating
                              ? 'text-gold fill-gold'
                              : 'text-charcoal/15'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-charcoal">
                      {userExistingReview.rating}.0 / 5.0
                    </span>
                  </div>

                  {userExistingReview.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {userExistingReview.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-forest-50 text-forest text-[11px] font-bold border border-forest/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {userExistingReview.review && (
                    <blockquote className="text-xs sm:text-sm text-charcoal bg-cream/40 p-3.5 rounded-xl border border-charcoal/10 italic">
                      "{userExistingReview.review}"
                    </blockquote>
                  )}
                </div>
              ) : (
                /* Interactive Rating Form */
                <form
                  onSubmit={handleSubmitRating}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-charcoal/10 shadow-2xs space-y-4"
                >
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-2">
                      Your Rating (1 to 5 Stars):
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div
                        className="flex items-center gap-1.5"
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled =
                            (hoverRating || ratingScore) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingScore(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                              aria-label={`Rate ${star} star`}
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  isFilled
                                    ? 'text-gold fill-gold drop-shadow-xs'
                                    : 'text-charcoal/20 fill-charcoal/5'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-forest bg-forest-50 px-3 py-1 rounded-xl border border-forest/15 self-start">
                        {STAR_DESCRIPTIONS[hoverRating || ratingScore]}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Tags */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-2">
                      What made this course stand out? (Select tags)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {RATING_TAG_OPTIONS.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-forest text-cream border-forest shadow-2xs'
                                : 'bg-cream/40 text-charcoal-muted border-charcoal/15 hover:border-forest/40 hover:text-charcoal'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5">
                      Written Review / Studio Feedback (Optional):
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      placeholder="Share your experience with the curriculum, weekly critiques, and studio assignments..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 bg-cream/30 text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span>
                        {userExistingReview ? 'Update Your Rating' : 'Submit Course Rating (+50 XP)'}
                      </span>
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Community Reviews Collapsible Drawer */}
              {courseReviews.length > 0 && (
                <div className="mt-5 pt-4 border-t border-charcoal/10">
                  <button
                    type="button"
                    onClick={() => setShowCommunityReviews((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-charcoal hover:text-forest transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-forest" />
                      <span>
                        Community Ratings &amp; Peer Reviews ({courseReviews.length})
                      </span>
                    </span>
                    {showCommunityReviews ? (
                      <ChevronUp className="w-4 h-4 text-charcoal-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-charcoal-muted" />
                    )}
                  </button>

                  {showCommunityReviews && (
                    <div className="mt-3.5 space-y-3">
                      {courseReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="bg-white p-4 rounded-2xl border border-charcoal/10 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={rev.studentAvatar}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover border border-charcoal/10"
                              />
                              <div>
                                <h5 className="text-xs font-bold text-charcoal">
                                  {rev.studentName}
                                </h5>
                                <span className="text-[10px] text-charcoal-muted">
                                  {rev.date}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= rev.rating
                                      ? 'text-gold fill-gold'
                                      : 'text-charcoal/15'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {rev.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {rev.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-full bg-cream text-[10px] font-bold text-charcoal border border-charcoal/10"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {rev.review && (
                            <p className="text-xs text-charcoal-muted leading-relaxed">
                              "{rev.review}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Module Progression Buttons (Previous / Next) */}
        <div className="pt-6 border-t border-charcoal/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {prevLesson ? (
            <button
              onClick={() => handleGoToLesson(prevLesson)}
              className="px-4 py-2.5 rounded-xl border border-charcoal/15 bg-cream/50 hover:bg-cream text-xs font-bold text-charcoal flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-forest shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] text-charcoal-muted uppercase">
                  Previous Lesson
                </span>
                <span className="line-clamp-1">{prevLesson.title}</span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextLessonInUnit ? (
            <button
              onClick={() => handleGoToLesson(nextLessonInUnit)}
              className="px-5 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold flex items-center justify-end gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-[10px] text-cream/75 uppercase">
                  Next in {currentUnit.unitLabel}
                </span>
                <span className="line-clamp-1">{nextLessonInUnit.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : unitAssignment && !isUnitAssignmentCompleted ? (
            <button
              onClick={() => handleGoToUnitTask(unitAssignment)}
              className="px-5 py-2.5 rounded-xl bg-gold text-charcoal hover:bg-gold-hover text-xs font-bold flex items-center justify-end gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-[10px] text-charcoal/75 uppercase">
                  Required Unit Task to Unlock Next Unit
                </span>
                <span className="line-clamp-1">
                  Complete: {unitAssignment.title}
                </span>
              </div>
              <ClipboardCheck className="w-4 h-4 shrink-0" />
            </button>
          ) : nextUnitFirstLesson ? (
            <button
              onClick={() => handleGoToLesson(nextUnitFirstLesson)}
              className="px-5 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold flex items-center justify-end gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-[10px] text-cream/75 uppercase">
                  Proceed to {nextUnitFirstLesson.unitLabel}
                </span>
                <span className="line-clamp-1">{nextUnitFirstLesson.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('course-details')}
              className="px-5 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish &amp; Return to Course Units</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
