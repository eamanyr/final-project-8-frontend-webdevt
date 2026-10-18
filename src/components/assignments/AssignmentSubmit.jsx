import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  Sparkles,
  Send,
  X
} from 'lucide-react';

export const AssignmentSubmit = () => {
  const {
    assignments,
    selectedAssignmentId,
    currentUser,
    submitAssignment,
    setActiveTab,
    assignmentOrigin,
  } = useLMS();

  const assignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  const [notes, setNotes] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState({
    name: `${currentUser?.name.replace(' ', '_') || 'Student'}_Final_Work.pdf`,
    size: '4.2 MB',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e3f33', '#de9e36', '#9cb49a', '#232724'],
    });

    submitAssignment({
      assignmentId: assignment.id,
      content: notes,
      linkUrl: linkUrl,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Return Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('assignment-details')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignment Details</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        {isSubmitted ? (
          <div className="text-center py-8 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              Submission Successful
            </span>

            <h3 className="text-2xl font-bold text-charcoal font-heading">
              Great Job, {currentUser?.name}!
            </h3>

            <p className="text-xs text-charcoal-muted mt-2 max-w-md mx-auto leading-relaxed">
              Your submission for <strong className="text-charcoal">{assignment.title}</strong> has been transmitted to your instructor ({assignment.courseName}). You can track grading and teacher feedback on your Grades page.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  setActiveTab(
                    assignmentOrigin === 'course-details' ? 'course-details' : 'todo'
                  )
                }
                className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream"
              >
                {assignmentOrigin === 'course-details'
                  ? 'Back to Course Details'
                  : 'Back to To-Do'}
              </button>
              <button
                onClick={() => setActiveTab('grades')}
                className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md"
              >
                View My Gradebook
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-charcoal/10 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                  {assignment.courseName}
                </span>
                <h2 className="text-xl font-bold text-charcoal font-heading mt-0.5">
                  Submit: {assignment.title}
                </h2>
                <p className="text-xs text-charcoal-muted mt-1">
                  Due: {assignment.dueDate} ({assignment.dueTime}) • Max: {assignment.maxScore} pts
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Submission Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Submission Commentary & Process Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your design choices, tools utilized, challenges encountered, and key solutions..."
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
                />
              </div>

              {/* External Link */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  External Repository, Portfolio, or Figma URL (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://github.com/your-username/studio-project or Figma link"
                    className="w-full bg-cream/40 border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Attach Deliverable File
                </label>
                <div className="border-2 border-dashed border-charcoal/20 rounded-2xl p-6 text-center bg-cream/30 hover:bg-cream/50 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-forest mx-auto mb-2" />
                  <p className="text-xs font-bold text-charcoal">
                    Drag and drop your deliverable or click to browse
                  </p>
                  <p className="text-[11px] text-charcoal-muted mt-1">
                    Supports PDF, PNG, JPG, or ZIP (Max file size 50 MB)
                  </p>

                  {/* Attached pill */}
                  {selectedFile && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-charcoal/15 shadow-xs">
                      <FileText className="w-4 h-4 text-forest" />
                      <span className="text-xs font-bold text-charcoal">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        ({selectedFile.size})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('assignment-details')}
                  className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Transmit Work</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
