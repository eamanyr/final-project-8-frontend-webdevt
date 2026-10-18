import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { buildCourseUnitsWithItems } from '../../data/courseCurriculum';
import {
  ArrowLeft,
  Users,
  FileText,
  Clock,
  Star,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  Edit,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Lock,
  Paperclip,
  Rocket,
  Circle,
} from 'lucide-react';

export const CourseDetails = () => {
  const {
    courses,
    selectedCourseId,
    currentUser,
    users,
    materials,
    assignments,
    submissions,
    viewedLessonIds,
    markLessonAsViewed,
    setSelectedLessonId,
    setActiveTab,
    toggleEnrollCourse,
    setSelectedAssignmentId,
    setAssignmentOrigin,
    addToast,
  } = useLMS();

  const [activeTab, setActiveSection] = useState('syllabus');
  const [openUnits, setOpenUnits] = useState({ 0: true, 1: true, 2: true });

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  if (!course) return null;

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);
  const isStudent = currentUser?.role === 'student';

  // Filter materials & assignments for this course
  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);

  const unitsWithItems = buildCourseUnitsWithItems(
    course,
    courseAssignments,
    courseMaterials
  );

  const toggleUnitDropdown = (unitIdx) => {
    setOpenUnits((prev) => ({ ...prev, [unitIdx]: !prev[unitIdx] }));
  };

  const isAssignmentDone = (asg) => {
    if (!asg) return true;
    const submitted = (submissions || []).some(
      (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
    );
    return submitted || asg.status === 'Graded';
  };

  const isUnitCompleted = (unit) => {
    const allLessonsViewed = unit.lessons.every((l) =>
      viewedLessonIds.includes(l.id)
    );
    const allTasksDone = unit.assignments.every((a) => isAssignmentDone(a));
    return allLessonsViewed && allTasksDone;
  };

  const isUnitUnlocked = (unitIdx) => {
    if (!isStudent || unitIdx === 0) return true;
    return isUnitCompleted(unitsWithItems[unitIdx - 1]);
  };

  // Enrolled students list
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && u.enrolledCourseIds?.includes(course.id)
  );

  return (
    <div className="space-y-6">
      {/* Return Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Directory</span>
        </button>

        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('create-course')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-charcoal/20 bg-white text-xs font-bold text-charcoal hover:bg-cream transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Course Details</span>
          </button>
        )}
      </div>

      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div className="h-48 sm:h-64 relative bg-gradient-to-r from-forest via-forest-light to-sage">
          <img
            src={course.thumbnail}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-charcoal shadow-sm">
              {course.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest text-cream shadow-sm">
              {course.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-gold">
              {course.code}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 mt-1 max-w-2xl hidden sm:block">
              {course.schedule} • Room: {course.room}
            </p>
          </div>
        </div>

        {/* Hero Footer Actions */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-4">
            <img
              src={course.instructorAvatar}
              alt=""
              className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10"
            />
            <div>
              <p className="text-[11px] font-bold uppercase text-charcoal-muted tracking-wider">
                Instructor
              </p>
              <h4 className="text-sm font-bold text-charcoal">
                {course.instructorName}
              </h4>
              <p className="text-xs text-charcoal-muted">
                Department of Applied Creative Arts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'student' && (
              <button
                onClick={() => toggleEnrollCourse(course.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isEnrolled
                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    : 'bg-forest text-cream hover:bg-forest-light shadow-forest/20'
                }`}
              >
                {isEnrolled ? 'Drop Course' : 'Enroll in Course'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'syllabus'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Syllabus & Units
        </button>
        <button
          onClick={() => setActiveSection('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'materials'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Learning Materials ({courseMaterials.length})
        </button>
        <button
          onClick={() => setActiveSection('assignments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assignments'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Assignments ({courseAssignments.length})
        </button>
        <button
          onClick={() => setActiveSection('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-forest text-cream shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          Class List ({enrolledStudents.length})
        </button>
      </div>

      {/* Tab 1: Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <h3 className="text-base font-bold font-heading text-charcoal mb-2">
              Course Description & Objectives
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-charcoal">
                  Curriculum Units &amp; Lessons
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Click a unit to expand its lessons and required tasks. Complete all items in a unit to unlock the next unit.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {unitsWithItems.map((unit, idx) => {
                const isOpen = !!openUnits[idx];
                const unitUnlocked = isUnitUnlocked(idx);
                const unitDone = isUnitCompleted(unit);
                const allLessonsInUnitViewed = unit.lessons.every((l) =>
                  viewedLessonIds.includes(l.id)
                );

                return (
                  <div
                    key={unit.unitIdx}
                    className="rounded-2xl border border-charcoal/10 overflow-hidden bg-white shadow-2xs transition-all"
                  >
                    {/* CacheUp-Styled Unit Dropdown Header Bar */}
                    <button
                      type="button"
                      onClick={() => toggleUnitDropdown(idx)}
                      className={`w-full p-4 bg-cream/45 hover:bg-cream/80 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                        isOpen ? 'border-b border-charcoal/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">
                            {unit.unitLabel} • {unit.lessons.length} Lessons
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-charcoal font-heading break-words leading-snug">
                            {unit.unitTitle}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                            unitDone
                              ? 'bg-forest-50 text-forest border-forest/20'
                              : unitUnlocked
                              ? 'bg-white text-charcoal-muted border-charcoal/10'
                              : 'bg-cream text-charcoal-muted border-charcoal/10'
                          }`}
                        >
                          {unitDone
                            ? 'Completed'
                            : unitUnlocked
                            ? 'Complete All Items'
                            : 'Prerequisites Required'}
                        </span>
                        {unitDone ? (
                          <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                        ) : !unitUnlocked ? (
                          <Lock className="w-4 h-4 text-charcoal-muted" />
                        ) : (
                          <Circle className="w-4 h-4 text-charcoal/25" />
                        )}
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-charcoal-muted shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-charcoal-muted shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Dropdown Items (Lessons, Materials & Unit Tasks) */}
                    {isOpen && (
                      <div className="divide-y divide-charcoal/10 bg-white">
                        {/* 1. Lesson Pages */}
                        {unit.lessons.map((lesson, lIdx) => {
                          const isViewed = viewedLessonIds.includes(lesson.id);
                          const prevLessonViewed =
                            lIdx === 0 ||
                            viewedLessonIds.includes(unit.lessons[lIdx - 1].id);
                          const lessonUnlocked =
                            !isStudent || (unitUnlocked && prevLessonViewed);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                if (!lessonUnlocked) {
                                  addToast(
                                    'Please view the previous lesson/unit items first to unlock this lesson.',
                                    'info'
                                  );
                                  return;
                                }
                                markLessonAsViewed(lesson.id);
                                setSelectedLessonId(lesson.id);
                                setActiveTab('course-lesson');
                              }}
                              className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                                lessonUnlocked
                                  ? 'hover:bg-cream/40 cursor-pointer group'
                                  : 'opacity-55 bg-cream/20 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug">
                                    {unit.unitLabel}: {lesson.title}
                                  </h4>
                                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                                    {isViewed
                                      ? 'Viewed'
                                      : lessonUnlocked
                                      ? 'View Lesson Page'
                                      : 'Must view preceding item first'}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {isViewed ? (
                                  <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                                ) : !lessonUnlocked ? (
                                  <Lock className="w-3.5 h-3.5 text-charcoal-muted" />
                                ) : (
                                  <Circle className="w-4 h-4 text-charcoal/25" />
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* 2. Unit Attachments / PDFs */}
                        {unit.materials.map((mat) => (
                          <div
                            key={mat.id}
                            onClick={() => setActiveSection('materials')}
                            className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-cream/40 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0">
                                <Paperclip className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug block">
                                  {mat.title}.{mat.type}
                                </span>
                                <span className="text-[11px] text-charcoal-muted">
                                  Study Resource • {mat.size}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold text-forest shrink-0">
                              View
                            </span>
                          </div>
                        ))}

                        {/* 3. Unit Assignments / Graded Tasks needed before next unit */}
                        {unit.assignments.map((asg) => {
                          const done = isAssignmentDone(asg);
                          const taskUnlocked =
                            !isStudent ||
                            done ||
                            (unitUnlocked && allLessonsInUnitViewed);

                          return (
                            <div
                              key={asg.id}
                              onClick={() => {
                                if (!taskUnlocked) {
                                  addToast(
                                    'Please view all lessons in this unit before starting the unit task.',
                                    'info'
                                  );
                                  return;
                                }
                                setAssignmentOrigin('course-details');
                                setSelectedAssignmentId(asg.id);
                                setActiveTab('assignment-details');
                              }}
                              className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                                taskUnlocked
                                  ? 'hover:bg-cream/40 cursor-pointer group'
                                  : 'opacity-55 bg-cream/20 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0">
                                  <Rocket className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors break-words leading-snug">
                                    Graded Task: {asg.title}
                                  </h4>
                                  <p className="text-[11px] text-charcoal-muted mt-0.5">
                                    Due {asg.dueDate} • {asg.maxScore || 100} pts
                                    {done ? ' • Submitted' : ' • Required to complete unit'}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0">
                                {done ? (
                                  <Check className="w-4 h-4 text-forest stroke-[2.5]" />
                                ) : !taskUnlocked ? (
                                  <Lock className="w-3.5 h-3.5 text-charcoal-muted" />
                                ) : (
                                  <Circle className="w-4 h-4 text-charcoal/25" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Materials */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <h3 className="text-base font-bold font-heading text-charcoal mb-4">
            Course Learning Materials
          </h3>
          {courseMaterials.length === 0 ? (
            <p className="text-xs text-charcoal-muted py-6 text-center">
              No materials uploaded for this course yet.
            </p>
          ) : (
            <div className="space-y-3">
              {courseMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage/20 text-forest flex items-center justify-center font-bold text-xs">
                      {mat.type.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-charcoal">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        Uploaded by {mat.uploadedBy} • {mat.size} • {mat.uploadDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Simulating download of ${mat.title}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <h3 className="text-base font-bold font-heading text-charcoal mb-4">
            Assignments for {course.title}
          </h3>
          {courseAssignments.length === 0 ? (
            <p className="text-xs text-charcoal-muted py-6 text-center">
              No active assignments currently scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {courseAssignments.map((asg) => (
                <div
                  key={asg.id}
                  onClick={() => {
                    setSelectedAssignmentId(asg.id);
                    setActiveTab('assignment-details');
                  }}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 hover:border-forest/30 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-charcoal font-heading">
                        {asg.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold-dark">
                        {asg.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted mt-1 max-w-xl">
                      {asg.description}
                    </p>
                    <p className="text-[11px] font-semibold text-forest mt-1.5 flex items-center gap-2">
                      <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                      <span>•</span>
                      <span>Max Points: {asg.maxScore}</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignmentId(asg.id);
                      setActiveTab('assignment-details');
                    }}
                    className="px-4 py-2 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-colors self-start sm:self-center"
                  >
                    View Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Students / Class List */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
          <h3 className="text-base font-bold font-heading text-charcoal mb-4">
            Enrolled Students in this Course
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {enrolledStudents.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 flex items-center gap-3"
              >
                <img
                  src={st.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-charcoal/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-charcoal">{st.name}</h4>
                  <p className="text-[11px] text-charcoal-muted">{st.email}</p>
                  <span className="text-[10px] font-mono font-bold text-forest mt-0.5 block">
                    {st.studentId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
