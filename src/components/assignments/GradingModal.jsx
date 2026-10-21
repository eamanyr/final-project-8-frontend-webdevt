import React, { useState } from 'react';
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

  // Initialize individual criteria scores if available or split proportionally
  const [rubricScores, setRubricScores] = useState(() => {
    if (submission.rubricScores && typeof submission.rubricScores === 'object') {
      return submission.rubricScores;
    }
    const initial = {};
    const baseScore = submission.score !== null ? submission.score : Math.round(submission.maxScore * 0.9);
    const totalRubricPts = rubric.reduce((sum, r) => sum + (Number(r.points) || 0), 0) || 100;
    rubric.forEach((r, idx) => {
      const proportional = Math.round((Number(r.points) / totalRubricPts) * baseScore);
      initial[idx] = Math.min(Number(r.points), proportional);
    });
    return initial;
  });

  const [score, setScore] = useState(() => {
    return submission.score !== null ? submission.score : Math.round(submission.maxScore * 0.9);
  });

  const [feedback, setFeedback] = useState(
    submission.feedback ||
      'Great conceptual demonstration. Your attention to detail, tonal balance, and compositional structure is well executed.'
  );

  // File viewer states
  const [pdfPage, setPdfPage] = useState(1);
  const totalPdfPages = 3;
  const [zoomLevel, setZoomLevel] = useState(100);

  const isGraded = submission.status === 'Graded';

  const handleRubricScoreChange = (idx, val, maxPts) => {
    const num = Math.max(0, Math.min(maxPts, parseInt(val) || 0));
    const updated = { ...rubricScores, [idx]: num };
    setRubricScores(updated);

    // Sum updated criteria points to update overall score
    const newTotal = Object.values(updated).reduce((acc, pts) => acc + (Number(pts) || 0), 0);
    setScore(Math.min(submission.maxScore, newTotal));
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
    gradeSubmission(submission.id, score, feedback, rubricScores);
    onClose();
  };

  const isImageFile =
    submission.fileName?.match(/\.(png|jpg|jpeg|webp|gif)$/i) ||
    submission.fileUrl?.startsWith('data:image');
  const isZipFile = submission.fileName?.match(/\.(zip|tar|gz|rar)$/i);

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
                {submission.fileName && (
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

                {submission.fileName && (
                  <button
                    type="button"
                    onClick={() => addToast(`Downloading deliverable: ${submission.fileName}`, 'success')}
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
              {/* IF LOCAL / CUSTOM FILE URL OR IMAGE */}
              {submission.fileUrl && isImageFile ? (
                <div
                  className="w-full bg-white rounded-2xl border border-charcoal/10 p-2 shadow-xs transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <img
                    src={submission.fileUrl}
                    alt={submission.fileName}
                    className="w-full max-h-[480px] object-contain rounded-xl"
                  />
                </div>
              ) : submission.fileUrl && submission.fileUrl.endsWith('.pdf') ? (
                <div className="w-full h-96 bg-white rounded-2xl border border-charcoal/10 overflow-hidden shadow-xs">
                  <iframe
                    src={submission.fileUrl}
                    title={submission.fileName}
                    className="w-full h-full border-none"
                  />
                </div>
              ) : isImageFile ? (
                /* Simulated Rendered High-Res Image Deliverable */
                <div
                  className="w-full max-w-lg bg-white rounded-2xl border border-charcoal/10 p-3 shadow-sm transition-transform duration-200 space-y-2"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <div className="relative rounded-xl overflow-hidden bg-charcoal/5 border border-charcoal/10 aspect-4/3 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
                      alt="Student Illustration Plate"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-charcoal/80 text-cream text-[10px] font-mono backdrop-blur-xs">
                      {submission.fileName} • High-Res
                    </span>
                  </div>
                  <div className="text-center text-[11px] text-charcoal-muted">
                    Photo Plate 1 of 1 • Dimensions: 3000 x 2250 px • CMYK 300 DPI
                  </div>
                </div>
              ) : isZipFile ? (
                /* Archive / Source Code ZIP Viewer */
                <div
                  className="w-full max-w-lg bg-white rounded-2xl border border-charcoal/10 p-5 shadow-sm space-y-4"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-charcoal/10">
                    <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center font-bold">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-charcoal">{submission.fileName}</h4>
                      <p className="text-[10px] text-charcoal-muted">{submission.fileSize || '18.7 MB'} • Compressed Project Archive</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <p className="text-[11px] font-bold text-charcoal uppercase tracking-wider mb-2 font-sans">
                      Archived Project Contents:
                    </p>
                    <div className="p-2.5 rounded-lg bg-cream/40 border border-charcoal/5 flex items-center justify-between">
                      <span className="text-charcoal">📁 /plates/plate_01_macro_ink.png</span>
                      <span className="text-charcoal-muted">4.8 MB</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-cream/40 border border-charcoal/5 flex items-center justify-between">
                      <span className="text-charcoal">📁 /plates/plate_02_nuqta_grid.pdf</span>
                      <span className="text-charcoal-muted">6.2 MB</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-cream/40 border border-charcoal/5 flex items-center justify-between">
                      <span className="text-charcoal">📄 metadata_statement.txt</span>
                      <span className="text-charcoal-muted">14 KB</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Authentic Multi-Page PDF Document Viewer */
                <div
                  className="w-full max-w-lg bg-white rounded-2xl border border-charcoal/15 p-6 shadow-sm space-y-5 transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {/* PDF Header Page Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 text-[11px] text-charcoal-muted">
                    <span className="font-bold text-charcoal font-sans uppercase tracking-wider">
                      Academic Document Viewer
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                        disabled={pdfPage === 1}
                        className="p-1 rounded hover:bg-cream disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-charcoal">
                        Page {pdfPage} of {totalPdfPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPdfPage((p) => Math.min(totalPdfPages, p + 1))}
                        disabled={pdfPage === totalPdfPages}
                        className="p-1 rounded hover:bg-cream disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rendered Document Sheet based on Page */}
                  {pdfPage === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="border-l-2 border-forest pl-3">
                        <span className="text-[10px] font-bold uppercase text-forest tracking-wider">
                          STUDENT PORTFOLIO SUBMISSION
                        </span>
                        <h4 className="text-base font-bold font-heading text-charcoal mt-0.5">
                          {submission.assignmentTitle}
                        </h4>
                        <p className="text-[11px] text-charcoal-muted">
                          Candidate: {submission.studentName} • Course: {submission.courseName || 'CacheUp Visual Arts'}
                        </p>
                      </div>

                      {/* Visual Swatches for Color Palette or Figure representation */}
                      <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-cream/40 border border-charcoal/10">
                        <div className="text-center">
                          <div className="w-full h-12 rounded-lg bg-[#1e3f33] shadow-2xs mb-1" />
                          <span className="text-[10px] font-mono text-charcoal font-bold">#1E3F33</span>
                          <span className="text-[9px] text-charcoal-muted block">Forest Deep</span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 rounded-lg bg-[#de9e36] shadow-2xs mb-1" />
                          <span className="text-[10px] font-mono text-charcoal font-bold">#DE9E36</span>
                          <span className="text-[9px] text-charcoal-muted block">Mustard Gold</span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 rounded-lg bg-[#9cb49a] shadow-2xs mb-1" />
                          <span className="text-[10px] font-mono text-charcoal font-bold">#9CB49A</span>
                          <span className="text-[9px] text-charcoal-muted block">Sage Light</span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 rounded-lg bg-[#fbf9f4] border border-charcoal/20 shadow-2xs mb-1" />
                          <span className="text-[10px] font-mono text-charcoal font-bold">#FBF9F4</span>
                          <span className="text-[9px] text-charcoal-muted block">Warm Cream</span>
                        </div>
                        <div className="text-center">
                          <div className="w-full h-12 rounded-lg bg-[#232724] shadow-2xs mb-1" />
                          <span className="text-[10px] font-mono text-charcoal font-bold">#232724</span>
                          <span className="text-[9px] text-charcoal-muted block">Charcoal</span>
                        </div>
                      </div>

                      <div className="text-xs text-charcoal leading-relaxed space-y-2">
                        <p className="font-semibold text-charcoal">
                          1. Conceptual Rationale &amp; Aesthetic Harmony
                        </p>
                        <p className="text-[11px] text-charcoal-muted leading-relaxed">
                          "This harmony study draws directly from Japanese moss gardens and natural weathering patterns. The high contrast between the deep forest ground (#1E3F33) and the golden accent (#DE9E36) establishes immediate visual rhythm while the sage tone acts as a stabilizing intermediate."
                        </p>
                      </div>
                    </div>
                  )}

                  {pdfPage === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <p className="text-xs font-semibold text-charcoal">
                        2. Contrast Ratio Verification &amp; Typography Scales
                      </p>
                      <div className="p-3.5 rounded-xl bg-cream/30 border border-charcoal/10 space-y-2 text-[11px]">
                        <div className="flex justify-between border-b border-charcoal/5 pb-1.5">
                          <span className="font-medium text-charcoal">Charcoal on Warm Cream</span>
                          <span className="font-bold text-forest font-mono">14.2 : 1 (AAA Pass)</span>
                        </div>
                        <div className="flex justify-between border-b border-charcoal/5 pb-1.5">
                          <span className="font-medium text-charcoal">Deep Forest on Warm Cream</span>
                          <span className="font-bold text-forest font-mono">9.8 : 1 (AAA Pass)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-charcoal">Mustard Gold on Deep Forest</span>
                          <span className="font-bold text-forest font-mono">5.1 : 1 (AA Pass)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-charcoal-muted leading-relaxed">
                        Typography specimens were scaled according to a Major Third (1.25) typographic hierarchy. Headings are set in editorial serif with generous optical tracking, paired with high-legibility geometric sans-serif body copy.
                      </p>
                    </div>
                  )}

                  {pdfPage === 3 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <p className="text-xs font-semibold text-charcoal">
                        3. Studio Reflections &amp; Application Testing
                      </p>
                      <p className="text-[11px] text-charcoal-muted leading-relaxed">
                        "During initial iteration tests, the sage shade lacked sufficient luminance contrast when rendered on dark backgrounds. A 10% lightness adjustment resolved the perceptual legibility while retaining the soft organic ambiance."
                      </p>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[10px] text-emerald-800 font-semibold">
                        ✓ All deliverables and source files compiled and verified for studio evaluation.
                      </div>
                    </div>
                  )}
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
                      <span>{getLetterGrade(score, submission.maxScore)}</span>
                      <span className="text-cream text-xs font-normal">
                        ({((score / submission.maxScore) * 100).toFixed(0)}%)
                      </span>
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
                      const curPts = rubricScores[idx] !== undefined ? rubricScores[idx] : maxPts;

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
