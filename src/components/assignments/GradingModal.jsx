import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  Award,
  CheckCircle2,
  FileText,
  ExternalLink,
  MessageSquare,
  Send,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileCheck,
  Sparkles,
  HelpCircle,
  Clock,
  User,
  Sliders,
  Check
} from 'lucide-react';

export const GradingModal = ({ submission, onClose }) => {
  const { gradeSubmission, assignments, courses, currentUser, addToast } = useLMS();

  // Find assignment associated with this submission to extract its rubric/criteria
  const assignment = assignments.find((a) => a.id === submission.assignmentId);
  const rubric = assignment?.rubric || [
    { criteria: 'Technical Execution & Precision', points: Math.round(submission.maxScore * 0.4) },
    { criteria: 'Concept Originality & Aesthetic Flow', points: Math.round(submission.maxScore * 0.35) },
    { criteria: 'Documentation & Presentation', points: Math.round(submission.maxScore * 0.25) },
  ];

  // Nothing is pre-filled: scores and feedback stay empty until the instructor enters them
  // (already-graded submissions show what was recorded).
  const [rubricScores, setRubricScores] = useState(() =>
    submission.rubricScores && typeof submission.rubricScores === 'object'
      ? submission.rubricScores
      : {}
  );

  const [score, setScore] = useState(() =>
    submission.score !== null && submission.score !== undefined ? submission.score : ''
  );

  const [feedback, setFeedback] = useState(submission.feedback || '');

  // File viewer states
  const [zoomLevel, setZoomLevel] = useState(100);

  // Real uploaded file: work out how to show it and give the viewer a blob URL (data: URLs are
  // unreliable inside iframes and for large files).
  const fileExt = (submission.fileName || '').split('.').pop().toLowerCase();
  const dataMime = /^data:([^;,]+)/.exec(submission.fileUrl || '')?.[1] || '';
  const fileKind =
    fileExt === 'pdf' || dataMime === 'application/pdf'
      ? 'pdf'
      : /^(png|jpe?g|gif|webp|svg)$/.test(fileExt) || dataMime.startsWith('image/')
      ? 'image'
      : fileExt === 'txt' || dataMime === 'text/plain'
      ? 'text'
      : 'other';
  const viewMime =
    fileKind === 'pdf' ? 'application/pdf' : fileKind === 'text' ? 'text/plain' : dataMime;
  const [blobUrl, setBlobUrl] = useState('');
  useEffect(() => {
    const url = submission.fileUrl;
    if (!url) return undefined;
    if (!url.startsWith('data:')) {
      setBlobUrl(url);
      return undefined;
    }
    let cancelled = false;
    let created = '';
    fetch(url)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled) return;
        created = URL.createObjectURL(viewMime ? new Blob([b], { type: viewMime }) : b);
        setBlobUrl(created);
      })
      .catch(() => {
        if (!cancelled) setBlobUrl('');
      });
    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [submission.fileUrl, viewMime]);

  const handleDownload = () => {
    if (!submission.fileUrl) {
      addToast('This submission has no downloadable file attached.', 'warning');
      return;
    }
    const a = document.createElement('a');
    a.href = blobUrl || submission.fileUrl;
    a.download = submission.fileName || 'submission';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const isGraded = submission.status === 'Graded';

  const handleRubricScoreChange = (idx, val, maxPts) => {
    const updated = {
      ...rubricScores,
      [idx]: val === '' ? '' : Math.max(0, Math.min(maxPts, parseInt(val) || 0)),
    };
    setRubricScores(updated);

    // Sum the criteria that have been filled in; stay empty if none have.
    const filled = Object.values(updated).filter((pts) => pts !== '' && pts !== undefined);
    setScore(
      filled.length
        ? Math.min(submission.maxScore, filled.reduce((acc, pts) => acc + (Number(pts) || 0), 0))
        : ''
    );
  };

  const getLetterGrade = (val, max = 100) => {
    const pct = (val / max) * 100;
    if (pct >= 94) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 75) return 'C+';
    if (pct >= 70) return 'C';
    return 'D';
  };

  const handleSave = (e) => {
    e.preventDefault();
    gradeSubmission(submission.id, Number(score), feedback, rubricScores);
    onClose();
  };


  const quickFeedbackSuggestions = [
    '🌟 Outstanding aesthetic balance and visual hierarchy.',
    '🎯 All rubric criteria thoroughly satisfied with precision.',
    '💡 Review tonal contrast on secondary text elements.',
    '📐 Excellent compositional structure and proportion.',
    '✨ Remarkable creativity and high conceptual clarity.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-charcoal/65 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-charcoal/15 shadow-2xl overflow-hidden relative my-4 max-h-[94vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-cream/40 border-b border-charcoal/10 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={submission.studentAvatar}
              alt=""
              className="w-11 h-11 rounded-2xl object-cover border border-charcoal/10 shrink-0 shadow-2xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-heading text-charcoal truncate">
                  {submission.studentName}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isGraded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {isGraded ? 'Graded' : 'Awaiting Review'}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted truncate">
                {submission.assignmentTitle} • {submission.courseName || 'Studio Course'} • Submitted {submission.submissionDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2-Column on LG (Left: Student Deliverable & File Viewer, Right: Grading & Feedback) */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT COLUMN: Student Deliverable & File Viewer */}
          <div className="lg:w-7/12 border-b lg:border-b-0 lg:border-r border-charcoal/10 bg-cream/20 flex flex-col overflow-y-auto">
            {/* Viewer Toolbar */}
            <div className="p-3.5 bg-white border-b border-charcoal/10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2 py-0.5 rounded-md bg-forest/10 inline-flex items-center gap-1 shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Student Deliverable</span>
                </span>
                {submission.fileUrl && submission.fileName && (
                  <span className="text-xs font-mono font-semibold text-charcoal truncate">
                    {submission.fileName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Zoom controls */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg border border-charcoal/10 hover:bg-cream text-charcoal-muted hover:text-charcoal cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-charcoal-muted px-1">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  title="Zoom In"
                  className="p-1.5 rounded-lg border border-charcoal/10 hover:bg-cream text-charcoal-muted hover:text-charcoal cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                {submission.fileUrl && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="ml-1 px-2.5 py-1 rounded-lg bg-forest text-cream text-[11px] font-bold hover:bg-forest-light transition-colors flex items-center gap-1 cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document / File Preview Canvas */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col items-center justify-start overflow-y-auto">
              {/* REAL UPLOADED FILE */}
              {submission.fileUrl ? (
                !blobUrl ? (
                  <p className="text-xs text-charcoal-muted py-10">Loading file…</p>
                ) : fileKind === 'image' ? (
                  <div
                    className="w-full bg-white rounded-2xl border border-charcoal/10 p-2 shadow-xs transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    <img
                      src={blobUrl}
                      alt={submission.fileName}
                      className="w-full max-h-[480px] object-contain rounded-xl"
                    />
                  </div>
                ) : fileKind === 'pdf' || fileKind === 'text' ? (
                  <div className="w-full h-[28rem] bg-white rounded-2xl border border-charcoal/10 overflow-hidden shadow-xs">
                    <iframe src={blobUrl} title={submission.fileName} className="w-full h-full border-none" />
                  </div>
                ) : (
                  <div className="w-full max-w-lg bg-white rounded-2xl border border-charcoal/10 p-6 shadow-xs text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-bold text-charcoal break-all">{submission.fileName}</h4>
                    <p className="text-[11px] text-charcoal-muted">
                      {submission.fileSize ? `${submission.fileSize} • ` : ''}
                      This file type can&apos;t be previewed in the browser. Download it to view.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download file</span>
                    </button>
                  </div>
                )
              ) : (
                <div className="w-full max-w-lg bg-white rounded-2xl border border-dashed border-charcoal/20 p-8 text-center space-y-2">
                  <div className="w-11 h-11 rounded-xl bg-charcoal/5 text-charcoal-muted flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal">No file attached</h4>
                  <p className="text-[11px] text-charcoal-muted">
                    {submission.submissionType === 'text'
                      ? "This is a written submission. The student's text is shown below."
                      : submission.submissionType === 'link'
                      ? 'This is a link submission. Open the project link below.'
                      : 'The student did not upload a file for this submission.'}
                  </p>
                </div>
              )}

              {/* Student Written Commentary & External Link Bar */}
              <div className="w-full max-w-lg mt-4 space-y-3">
                {submission.content && (
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                      Student Commentary &amp; Process Notes
                    </span>
                    <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line italic">
                      "{submission.content}"
                    </p>
                  </div>
                )}

                {submission.linkUrl && (
                  <div className="p-3.5 rounded-2xl bg-white border border-charcoal/10 shadow-2xs flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block">
                        Project Artifact URL
                      </span>
                      <p className="text-xs font-mono font-semibold text-forest truncate mt-0.5">
                        {submission.linkUrl}
                      </p>
                    </div>
                    <a
                      href={submission.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-forest/10 hover:bg-forest text-forest hover:text-cream text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Grading & Feedback Evaluation Desk */}
          <div className="lg:w-5/12 bg-white flex flex-col justify-between overflow-y-auto p-5 sm:p-6 space-y-5">
            <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Score & Letter Grade Banner */}
                <div className="p-4 rounded-2xl bg-cream/40 border border-charcoal/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Total Evaluated Score
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        max={submission.maxScore}
                        required
                        value={score}
                        placeholder="—"
                        onChange={(e) => setScore(e.target.value)}
                        className="w-20 bg-white border border-charcoal/20 rounded-xl px-2.5 py-1.5 text-lg font-extrabold text-charcoal font-heading text-center focus:outline-hidden focus:border-forest"
                      />
                      <span className="text-xs font-bold text-charcoal-muted">
                        / {submission.maxScore} pts
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Calculated Grade
                    </span>
                    <div className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest text-gold font-extrabold text-sm font-heading shadow-2xs">
                      <Award className="w-4 h-4 text-gold" />
                      {score === '' || Number.isNaN(Number(score)) ? (
                        <span className="text-cream text-xs font-normal">—</span>
                      ) : (
                        <>
                          <span>{getLetterGrade(Number(score), submission.maxScore)}</span>
                          <span className="text-cream text-xs font-normal">
                            ({((Number(score) / submission.maxScore) * 100).toFixed(0)}%)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rubric / Criteria Breakdown Scoring */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                      Assignment Evaluation Criteria
                    </label>
                    <span className="text-[10px] font-semibold text-charcoal-muted">
                      {rubric.length} Criteria Defined
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {rubric.map((r, idx) => {
                      const maxPts = Number(r.points) || 10;
                      const curPts = rubricScores[idx] ?? '';

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-cream/30 border border-charcoal/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-charcoal block leading-snug">
                              {r.criteria}
                            </span>
                            <span className="text-[10px] text-charcoal-muted">
                              Max Available: {maxPts} Pts
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              min="0"
                              max={maxPts}
                              value={curPts}
                              onChange={(e) => handleRubricScoreChange(idx, e.target.value, maxPts)}
                              className="w-14 bg-white border border-charcoal/15 rounded-lg px-2 py-1 text-xs font-bold text-charcoal text-center focus:outline-hidden focus:border-forest"
                            />
                            <span className="text-[11px] text-charcoal-muted">/ {maxPts}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Qualitative Feedback Textarea */}
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Constructive Instructor Comments &amp; Feedback <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive assessment, highlight technical achievements, and suggest studio revisions..."
                    className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                  />

                  {/* Quick feedback suggestions chips */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {quickFeedbackSuggestions.slice(0, 3).map((text, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setFeedback((prev) => (prev ? `${prev} ${text}` : text))
                        }
                        className="text-[10px] font-semibold bg-cream/60 hover:bg-forest/10 hover:text-forest text-charcoal-muted px-2 py-0.5 rounded-lg border border-charcoal/10 transition-colors cursor-pointer"
                      >
                        + {text.slice(0, 28)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-gold" />
                  <span>{isGraded ? 'Update Marks & Comments' : 'Record Grade & Comments'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
