import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { X, Award, CheckCircle2, FileText, ExternalLink, MessageSquare, Send } from 'lucide-react';

export const GradingModal = ({ submission, onClose }) => {
  const { gradeSubmission, currentUser } = useLMS();

  const [score, setScore] = useState(submission.score !== null ? submission.score : 90);
  const [feedback, setFeedback] = useState(
    submission.feedback || 'Great conceptual demonstration. Your attention to tonal balance and composition is well executed.'
  );

  const getLetterGrade = (score, max = 100) => {
    const pct = (score / max) * 100;
    if (pct >= 94) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 75) return 'C+';
    return 'C';
  };

  const handleSave = (e) => {
    e.preventDefault();
    gradeSubmission(submission.id, score, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-charcoal/15 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-cream"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-charcoal/10">
          <img
            src={submission.studentAvatar}
            alt=""
            className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10"
          />
          <div>
            <h3 className="text-base font-bold font-heading text-charcoal">
              Grade: {submission.studentName}
            </h3>
            <p className="text-xs text-charcoal-muted">
              {submission.assignmentTitle}
            </p>
          </div>
        </div>

        {/* Student submission preview */}
        <div className="mb-6 p-4 rounded-2xl bg-cream/50 border border-charcoal/10 space-y-2">
          <p className="text-xs font-semibold text-charcoal">Student Notes:</p>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            "{submission.content || 'No commentary submitted.'}"
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            {submission.fileName && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-charcoal/10 font-mono text-[11px] text-forest font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>{submission.fileName}</span>
              </span>
            )}
            {submission.linkUrl && (
              <a
                href={submission.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-charcoal/10 text-[11px] text-forest font-semibold hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>External Link</span>
              </a>
            )}
          </div>
        </div>

        {/* Grading Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Score (out of {submission.maxScore})
              </label>
              <input
                type="number"
                min="0"
                max={submission.maxScore}
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-sm font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Calculated Letter Grade
              </label>
              <div className="px-3.5 py-2 rounded-xl bg-forest/10 border border-forest/20 text-forest font-bold text-sm text-center">
                {getLetterGrade(score, submission.maxScore)} ({((score / submission.maxScore) * 100).toFixed(0)}%)
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Constructive Instructor Feedback
            </label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Highlight strengths, offer aesthetic suggestions, and evaluate rubric criteria..."
              className="w-full bg-cream/40 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Record Grade & Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
