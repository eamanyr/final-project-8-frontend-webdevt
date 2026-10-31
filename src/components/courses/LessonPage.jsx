import React from 'react';
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
  Award,
  MessageSquare,
  Edit3,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { handleCoverError, resolveCourseCover } from '../../data/coverImages';

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
    quizzes,
    quizSubmissions,
    viewedMaterialIds,
    currentUser,
    markLessonAsViewed,
    setActiveTab,
    setSelectedAssignmentId,
    setAssignmentOrigin,
    markCourseComplete,
    addToast,
  } = useLMS();

  const isTeacher = currentUser?.role === 'teacher';

  const course =
    courses.find((c) => c.id === selectedCourseId || c._id === selectedCourseId) ||
    courses[0];

  if (!course) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-charcoal/10 shadow-xs text-center space-y-4 my-8 max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-forest/40 mx-auto" />
        <h3 className="text-lg font-bold text-charcoal">Lesson Not Found</h3>
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
          The requested course or lesson could not be loaded.
        </p>
        <button
          onClick={() => setActiveTab('courses')}
          className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all cursor-pointer"
        >
          Back to All Courses
        </button>
      </div>
    );
  }

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

  // Check if current unit has assignments, materials, or quizzes to accomplish before moving to next unit
  const unitAssignment = currentUnit.assignments?.[0] || null;
  const isUnitAssignmentCompleted = unitAssignment
    ? submissions.some(
        (s) =>
          (s.assignmentId === unitAssignment.id || s.assignmentId === unitAssignment._id) &&
          (s.studentId === currentUser?.id || s.studentId === currentUser?._id)
      )
    : true;

  const unitMaterials = currentUnit.materials || [];
  const areUnitMaterialsCompleted = unitMaterials.every((m) =>
    (viewedMaterialIds || []).includes(m.id)
  );

  const unitQuizzes = (quizzes || []).filter(
    (q) =>
      q.courseId === course.id &&
      (q.unitIdx !== undefined
        ? Number(q.unitIdx) === Number(currentUnit.unitIdx)
        : Number(currentUnit.unitIdx) === 0)
  );
  const areUnitQuizzesCompleted = unitQuizzes.every((q) =>
    (quizSubmissions || []).some(
      (s) =>
        (s.quizId === q.id || s.quizId === q._id) &&
        (s.studentId === currentUser?.id || s.studentId === currentUser?._id)
    )
  );

  const nextUnitFirstLesson =
    currentUnit.unitIdx < units.length - 1
      ? units[currentUnit.unitIdx + 1]?.lessons?.[0] || null
      : null;

  // Course completion parameters
  const isLastLesson = globalLessonIdx === allLessons.length - 1;
  const isCourseCompleted =
    course.progress === 100 || course.completedLessons >= course.totalLessons;
  const shouldShowCompletion = !isTeacher && (isLastLesson || isCourseCompleted);

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
                src={resolveCourseCover(course.thumbnail)}
                alt=""
                onError={handleCoverError}
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

        {/* Course Completion Section (Rendered in the last part of the lessons when course is completed or on the final lesson) */}
        {shouldShowCompletion && (
          <div className="pt-6 border-t border-charcoal/10">
            <div className="bg-gradient-to-br from-cream/40 via-white to-cream/70 rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                      Course Completion
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
          ) : unitQuizzes.length > 0 && !areUnitQuizzesCompleted ? (
            <button
              onClick={() => {
                setActiveTab('course-details');
                addToast('Please complete the unit quiz to unlock the next unit.', 'info');
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-end gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-[10px] text-white/80 uppercase">
                  Required Unit Quiz to Unlock Next Unit
                </span>
                <span className="line-clamp-1">
                  Take Quiz: {unitQuizzes[0].title}
                </span>
              </div>
              <HelpCircle className="w-4 h-4 shrink-0" />
            </button>
          ) : unitMaterials.length > 0 && !areUnitMaterialsCompleted ? (
            <button
              onClick={() => {
                setActiveTab('course-details');
                addToast('Please review the unit study materials to unlock the next unit.', 'info');
              }}
              className="px-5 py-2.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold flex items-center justify-end gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-[10px] text-cream/75 uppercase">
                  Required Unit Learning Material
                </span>
                <span className="line-clamp-1">
                  Review Unit Study Resources
                </span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
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
