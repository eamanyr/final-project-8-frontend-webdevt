import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
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
  ChevronRight
} from 'lucide-react';

export const CourseDetails = () => {
  const {
    courses,
    selectedCourseId,
    currentUser,
    users,
    materials,
    assignments,
    setActiveTab,
    toggleEnrollCourse,
    setSelectedAssignmentId,
  } = useLMS();

  const [activeTab, setActiveSection] = useState('syllabus');

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  if (!course) return null;

  const isEnrolled = currentUser?.enrolledCourseIds?.includes(course.id);

  // Filter materials & assignments for this course
  const courseMaterials = materials.filter((m) => m.courseId === course.id);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);

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
        <div className="h-48 sm:h-64 relative">
          <img
            src={course.thumbnail}
            alt={course.title}
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
            <h3 className="text-base font-bold font-heading text-charcoal mb-4">
              Curriculum Units & Lessons
            </h3>
            <div className="space-y-3">
              {course.syllabus?.map((unit, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-forest uppercase tracking-wider">
                        {unit.unit}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-charcoal">
                        {unit.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-charcoal-muted px-2.5 py-1 rounded-lg bg-white border border-charcoal/5">
                    {unit.lessons} Lessons
                  </span>
                </div>
              ))}
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
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                    onClick={() => {
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
