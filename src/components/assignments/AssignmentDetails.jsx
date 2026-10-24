import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AssignmentSubmitModal } from './AssignmentSubmitModal';
import { GradingModal } from './GradingModal';
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
  Trash2,
  Plus,
  Save,
  X,
  FileText,
  User,
  Sliders
} from 'lucide-react';

export const AssignmentDetails = () => {
  const {
    assignments,
    selectedAssignmentId,
    currentUser,
    submissions,
    setActiveTab,
    deleteAssignment,
    updateAssignment,
    assignmentOrigin,
    addToast,
  } = useLMS();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeGradingSub, setActiveGradingSub] = useState(null);

  const targetId = selectedAssignmentId;
  const assignment =
    assignments.find(
      (a) =>
        (a?.id && a.id === targetId) ||
        (a?._id && a._id === targetId) ||
        String(a?.id) === String(targetId) ||
        String(a?._id) === String(targetId)
    ) || assignments[0];
  if (!assignment) return null;

  // Edit Assignment Form State
  const [editFormData, setEditFormData] = useState({
    title: assignment.title || '',
    description: assignment.description || '',
    dueDate: assignment.dueDate || '',
    dueTime: assignment.dueTime || '11:59 PM',
    duration: assignment.duration || '2 hours',
    maxScore: assignment.maxScore || 100,
    priority: assignment.priority || 'Medium',
    rubric: assignment.rubric && assignment.rubric.length
      ? assignment.rubric
      : [
          { criteria: 'Technical Execution & Precision', points: 40 },
          { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
          { criteria: 'Documentation & Presentation', points: 25 },
        ],
  });

  const handleOpenEditModal = () => {
    setEditFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate || '',
      dueTime: assignment.dueTime || '11:59 PM',
      duration: assignment.duration || '2 hours',
      maxScore: assignment.maxScore || 100,
      priority: assignment.priority || 'Medium',
      rubric: assignment.rubric && assignment.rubric.length
        ? assignment.rubric
        : [
            { criteria: 'Technical Execution & Precision', points: 40 },
            { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
            { criteria: 'Documentation & Presentation', points: 25 },
          ],
    });
    setIsEditModalOpen(true);
  };

  const handleAddCriteria = () => {
    setEditFormData((prev) => ({
      ...prev,
      rubric: [...prev.rubric, { criteria: 'New Evaluation Criterion', points: 10 }],
    }));
  };

  const handleUpdateCriteria = (idx, field, value) => {
    setEditFormData((prev) => {
      const updated = [...prev.rubric];
      updated[idx] = {
        ...updated[idx],
        [field]: field === 'points' ? Math.max(0, parseInt(value) || 0) : value,
      };
      return { ...prev, rubric: updated };
    });
  };

  const handleRemoveCriteria = (idx) => {
    setEditFormData((prev) => ({
      ...prev,
      rubric: prev.rubric.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveEditAssignment = (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      addToast('Please enter an assignment title.', 'warning');
      return;
    }

    // Auto sum criteria points if desired
    const totalRubricPts = editFormData.rubric.reduce((sum, r) => sum + (Number(r.points) || 0), 0);
    const updatedMaxScore = totalRubricPts > 0 ? totalRubricPts : parseInt(editFormData.maxScore) || 100;

    updateAssignment(assignment.id, {
      ...editFormData,
      maxScore: updatedMaxScore,
      rubric: editFormData.rubric,
    });

    setIsEditModalOpen(false);
  };

  // Check if current user already submitted
  const currentUserId = currentUser?.id || currentUser?._id;
  const assignmentId = assignment?.id || assignment?._id;

  const mySubmission = (submissions || []).find((s) => {
    if (!s) return false;
    const subAsgId = s.assignmentId?._id || s.assignmentId?.id || s.assignmentId;
    const subStudentId = s.studentId?._id || s.studentId?.id || s.studentId;

    const matchesAsg =
      String(subAsgId) === String(assignmentId) ||
      (assignment?.id && String(subAsgId) === String(assignment.id)) ||
      (assignment?._id && String(subAsgId) === String(assignment._id));

    const matchesStudent =
      String(subStudentId) === String(currentUserId) ||
      (currentUser?.id && String(subStudentId) === String(currentUser.id)) ||
      (currentUser?._id && String(subStudentId) === String(currentUser._id));

    return matchesAsg && matchesStudent;
  });

  // Submissions for this assignment (for teacher view)
  const assignmentSubmissions = (submissions || []).filter((s) => {
    if (!s) return false;
    const subAsgId = s.assignmentId?._id || s.assignmentId?.id || s.assignmentId;
    return (
      String(subAsgId) === String(assignmentId) ||
      (assignment?.id && String(subAsgId) === String(assignment.id)) ||
      (assignment?._id && String(subAsgId) === String(assignment._id))
    );
  });

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
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </button>

        {isTeacherOrAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEditModal}
              className="px-3.5 py-1.5 rounded-xl border border-charcoal/15 bg-white text-xs font-bold text-charcoal hover:text-forest hover:border-forest/30 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Edit Assignment & Modify Criteria"
            >
              <Edit className="w-3.5 h-3.5 text-forest" />
              <span>Edit Assignment &amp; Criteria</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Delete this assignment and all associated submissions?')) {
                  deleteAssignment(assignment.id);
                  setActiveTab(backTarget);
                }
              }}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
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

          {/* Submission Status Badge for Student */}
          {currentUser?.role === 'student' && (
            <div className="shrink-0">
              {mySubmission ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[140px]">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                    Submission Status
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" /> {mySubmission.status}
                  </span>
                  {mySubmission.score !== null ? (
                    <span className="text-base font-extrabold text-emerald-800 mt-1 block">
                      {mySubmission.score} / {mySubmission.maxScore} pts
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-600 block mt-0.5">
                      Awaiting instructor grade
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[140px]">
                  <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                    Submission Status
                  </span>
                  <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4" /> Awaiting Submission
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions Body */}
        <div className="py-6 border-b border-charcoal/10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-muted mb-3">
            Assignment Instructions &amp; Goals
          </h3>
          <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Evaluation Rubric Criteria Breakdown */}
        {assignment.rubric && assignment.rubric.length > 0 && (
          <div className="py-6 border-b border-charcoal/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-muted">
                Evaluation Rubric &amp; Criteria
              </h3>
              {isTeacherOrAdmin && (
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="text-xs font-bold text-forest hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Modify Criteria</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {assignment.rubric.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-cream/40 border border-charcoal/10 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-charcoal">{r.criteria}</span>
                  <span className="font-bold text-forest font-mono">{r.points} Points</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-charcoal-muted">
            Allowed Formats: PDF, Image scans, Documents, or Project URLs.
          </p>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'student' && (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{mySubmission ? 'Resubmit Work' : 'Submit Assignment'}</span>
              </button>
            )}

            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold text-charcoal text-xs font-bold hover:bg-gold-hover transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View &amp; Grade Student Submissions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student View: My Submitted Deliverable Card */}
      {currentUser?.role === 'student' && mySubmission && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-charcoal/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
                Your Submitted Deliverable
              </span>
              <h3 className="text-base font-bold font-heading text-charcoal">
                Submission Records & Faculty Feedback
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                mySubmission.status === 'Graded'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {mySubmission.status === 'Graded' ? 'Graded & Evaluated' : 'Submitted (Awaiting Grade)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-cream/30 border border-charcoal/10 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
                Submission Details
              </span>
              <p className="font-semibold text-charcoal">
                Submitted on: <span className="font-normal text-charcoal-muted">{mySubmission.submissionDate}</span>
              </p>
              {mySubmission.fileName && (
                <p className="font-semibold text-charcoal">
                  File Deliverable: <span className="font-mono text-forest font-bold">📁 {mySubmission.fileName}</span> {mySubmission.fileSize && <span className="text-charcoal-muted font-normal">({mySubmission.fileSize})</span>}
                </p>
              )}
              {mySubmission.linkUrl && (
                <p className="font-semibold text-charcoal">
                  Project URL:{' '}
                  <a
                    href={mySubmission.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest underline hover:text-forest-dark font-medium inline-flex items-center gap-1"
                  >
                    <span>{mySubmission.linkUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              )}
              {mySubmission.content && (
                <div className="pt-1.5 border-t border-charcoal/10 mt-2">
                  <span className="text-[10px] font-bold uppercase text-charcoal-muted block mb-0.5">Student Notes</span>
                  <p className="text-charcoal-muted italic line-clamp-3">"{mySubmission.content}"</p>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-cream/30 border border-charcoal/10 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
                Evaluation & Critique
              </span>
              {mySubmission.status === 'Graded' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-forest font-heading">
                      {mySubmission.score} / {mySubmission.maxScore} pts
                    </span>
                    <span className="text-xs font-bold text-charcoal font-mono">
                      ({Math.round(((mySubmission.score || 0) / (mySubmission.maxScore || 100)) * 100)}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal font-medium">
                    Evaluated by: <strong className="text-forest">{mySubmission.gradedBy || 'Course Faculty'}</strong>
                  </p>
                  {mySubmission.feedback ? (
                    <div className="pt-1.5 border-t border-charcoal/10 mt-1">
                      <span className="text-[10px] font-bold uppercase text-charcoal-muted block mb-0.5">Faculty Critique</span>
                      <p className="text-charcoal italic">"{mySubmission.feedback}"</p>
                    </div>
                  ) : (
                    <p className="text-charcoal-muted text-[11px]">No written commentary attached.</p>
                  )}
                </>
              ) : (
                <div className="py-3 text-center sm:text-left space-y-1">
                  <p className="font-semibold text-charcoal">Pending Faculty Review</p>
                  <p className="text-charcoal-muted text-[11px] leading-relaxed">
                    Your deliverable is in the queue. You will receive an assessment notification once your instructor reviews this assignment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Teacher View: Student Submissions for this specific assignment */}
      {isTeacherOrAdmin && (
        <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal">
                Student Submissions ({assignmentSubmissions.length})
              </h3>
              <p className="text-xs text-charcoal-muted">
                Review submitted deliverables, inspect files, and assign rubric scores
              </p>
            </div>
            <button
              onClick={() => setActiveTab('submissions')}
              className="text-xs font-bold text-forest hover:underline cursor-pointer"
            >
              Open Full Review Panel →
            </button>
          </div>

          {assignmentSubmissions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-cream/30 border border-charcoal/10 text-xs text-charcoal-muted">
              No students have submitted deliverables for this assignment yet.
            </div>
          ) : (
            <div className="divide-y divide-charcoal/5">
              {assignmentSubmissions.map((sub) => {
                const isGraded = sub.status === 'Graded';
                return (
                  <div
                    key={sub.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.studentAvatar}
                        alt=""
                        className="w-10 h-10 rounded-2xl object-cover border border-charcoal/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-charcoal">{sub.studentName}</h4>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isGraded
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isGraded ? `Score: ${sub.score}/${sub.maxScore}` : 'Awaiting Grade'}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-muted mt-0.5">
                          Submitted: {sub.submissionDate} {sub.fileName ? `• ${sub.fileName}` : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveGradingSub(sub)}
                      className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-cream text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-gold" />
                      <span>{isGraded ? 'Review & Update Grade' : 'View File & Grade in Modal'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STUDENT SUBMISSION MODAL (With Top Tabs: Text / Paragraphs, Link, File) */}
      {isSubmitModalOpen && (
        <AssignmentSubmitModal
          assignment={assignment}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={() => setIsSubmitModalOpen(false)}
        />
      )}

      {/* TEACHER / ADMIN EDIT ASSIGNMENT & CRITERIA MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-charcoal/15 shadow-2xl p-6 sm:p-7 relative my-6 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-xs">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal">
                    Edit Assignment &amp; Evaluation Criteria
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    Update task instructions, deadlines, and rubric scoring criteria
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAssignment} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Assignment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-hidden focus:border-forest font-semibold"
                />
              </div>

              {/* Deadlines & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({ ...editFormData, dueDate: e.target.value })}
                    className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Due Time
                  </label>
                  <input
                    type="text"
                    value={editFormData.dueTime}
                    onChange={(e) => setEditFormData({ ...editFormData, dueTime: e.target.value })}
                    placeholder="11:59 PM"
                    className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest font-semibold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Instructions &amp; Deliverables
                </label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3 text-xs text-charcoal focus:outline-hidden focus:border-forest resize-none leading-relaxed"
                />
              </div>

              {/* CRITERIA BUILDER / MODIFIER */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Add &amp; Modify Evaluation Criteria
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Criterion</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editFormData.rubric.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-cream/40 border border-charcoal/10"
                    >
                      <input
                        type="text"
                        value={r.criteria}
                        onChange={(e) => handleUpdateCriteria(idx, 'criteria', e.target.value)}
                        placeholder="Criteria description"
                        className="flex-1 bg-white border border-charcoal/15 rounded-lg px-2.5 py-1.5 text-xs text-charcoal focus:outline-hidden focus:border-forest font-medium"
                      />
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={r.points}
                        onChange={(e) => handleUpdateCriteria(idx, 'points', e.target.value)}
                        className="w-18 bg-white border border-charcoal/15 rounded-lg px-2 py-1.5 text-xs text-charcoal text-center font-bold font-mono focus:outline-hidden focus:border-forest"
                      />
                      <span className="text-[11px] text-charcoal-muted">Pts</span>
                      {editFormData.rubric.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCriteria(idx)}
                          className="p-1 text-charcoal-muted hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-right">
                  <span className="text-xs font-bold text-forest">
                    Total Rubric Score:{' '}
                    {editFormData.rubric.reduce((s, r) => s + (Number(r.points) || 0), 0)} pts
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-gold" />
                  <span>Save Assignment Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER GRADING & FILE VIEWER MODAL */}
      {activeGradingSub && (
        <GradingModal
          submission={activeGradingSub}
          onClose={() => setActiveGradingSub(null)}
        />
      )}
    </div>
  );
};
