import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';

export const AssignmentDetails = () => {
  const {
    assignments,
    selectedAssignmentId,
    currentUser,
    submissions,
    setActiveTab,
    deleteAssignment,
    assignmentOrigin,
  } = useLMS();

  const assignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  if (!assignment) return null;

  // Check if current user already submitted
  const mySubmission = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser?.id
  );

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const backTarget = assignmentOrigin === 'course-details' ? 'course-details' : 'todo';
  const backLabel =
    assignmentOrigin === 'course-details' ? 'Back to Course Details' : 'Back to To-Do';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Return Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab(backTarget)}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </button>

        {isTeacherOrAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Delete this assignment?')) {
                  deleteAssignment(assignment.id);
                  setActiveTab(backTarget);
                }
              }}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              title="Delete Assignment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-charcoal/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest/10 text-forest">
                {assignment.courseName}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  assignment.priority === 'High'
                    ? 'bg-gold/20 text-gold-dark'
                    : 'bg-sage/20 text-forest'
                }`}
              >
                {assignment.priority} Priority
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-heading">
              {assignment.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-forest" />
                <span>Due: {assignment.dueDate} ({assignment.dueTime})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest" />
                <span>Estimated: {assignment.duration}</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-charcoal">
                <Award className="w-4 h-4 text-gold-dark" />
                <span>Max Points: {assignment.maxScore} pts</span>
              </span>
            </div>
          </div>

          {/* Submission Status Badge */}
          <div className="shrink-0">
            {mySubmission ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                  Status
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" /> {mySubmission.status}
                </span>
                {mySubmission.score !== null && (
                  <span className="text-sm font-extrabold text-emerald-800 mt-1 block">
                    {mySubmission.score} / {mySubmission.maxScore} pts
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                  Status
                </span>
                <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4" /> Awaiting Submission
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Body */}
        <div className="py-6 border-b border-charcoal/10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-muted mb-3">
            Assignment Instructions & Goals
          </h3>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Rubric Breakdown */}
        {assignment.rubric && (
          <div className="py-6 border-b border-charcoal/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-muted mb-4">
              Evaluation Rubric
            </h3>
            <div className="space-y-2">
              {assignment.rubric.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-cream/40 border border-charcoal/10 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-charcoal">{r.criteria}</span>
                  <span className="font-bold text-forest">{r.points} Points</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-charcoal-muted">
            Allowed Formats: PDF, Image scans, or Figma / GitHub repository links.
          </p>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'student' && (
              <button
                onClick={() => setActiveTab('assignment-submit')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{mySubmission ? 'Resubmit Work' : 'Submit Assignment'}</span>
              </button>
            )}

            {isTeacherOrAdmin && (
              <button
                onClick={() => setActiveTab('submissions')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold text-charcoal text-xs font-bold hover:bg-gold-hover transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View & Grade Student Submissions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
