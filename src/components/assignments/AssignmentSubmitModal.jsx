import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import confetti from 'canvas-confetti';
import {
  X,
  FileText,
  Link as LinkIcon,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Send,
  Calendar,
  Award,
  AlertCircle,
  FileCheck2,
  Trash2
} from 'lucide-react';

export const AssignmentSubmitModal = ({ assignment, onClose, onSubmitted }) => {
  const { currentUser, submitAssignment, assignmentOrigin, setActiveTab } = useLMS();

  // Active top tab: 'text' | 'link' | 'file'
  const [activeTab, setActiveTabMode] = useState('file');

  // Form states
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');

  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');

  const [selectedFile, setSelectedFile] = useState({
    name: `${currentUser?.name ? currentUser.name.replace(/\s+/g, '_') : 'Student'}_Final_Work.pdf`,
    size: '4.2 MB',
    fileUrl: '',
    rawFile: null,
  });
  const [fileNotes, setFileNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!assignment) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const previewUrl = URL.createObjectURL(file);
      setSelectedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        fileUrl: previewUrl,
        rawFile: file,
      });
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation according to chosen tab
    if (activeTab === 'text') {
      if (!textContent.trim()) {
        setErrorMessage('Please enter your written paragraphs or submission text.');
        return;
      }
    } else if (activeTab === 'link') {
      if (!linkUrl.trim()) {
        setErrorMessage('Please provide a valid web URL.');
        return;
      }
      try {
        new URL(linkUrl);
      } catch {
        setErrorMessage('Please enter a valid URL starting with http:// or https://');
        return;
      }
    } else if (activeTab === 'file') {
      if (!selectedFile || !selectedFile.name) {
        setErrorMessage('Please attach a deliverable file for your submission.');
        return;
      }
    }

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e3f33', '#de9e36', '#9cb49a', '#232724'],
    });

    const submissionPayload = {
      assignmentId: assignment.id,
      submissionType: activeTab,
      content:
        activeTab === 'text'
          ? (textTitle ? `${textTitle}\n\n${textContent}` : textContent)
          : activeTab === 'link'
          ? (linkDescription || `Project submission link for ${assignment.title}`)
          : (fileNotes || `Attached project deliverable: ${selectedFile.name}`),
      linkUrl: activeTab === 'link' ? linkUrl : '',
      fileName: activeTab === 'file' ? selectedFile.name : (activeTab === 'text' ? 'Written_Submission.txt' : ''),
      fileSize: activeTab === 'file' ? selectedFile.size : (activeTab === 'text' ? `${(textContent.length / 1024).toFixed(1)} KB` : ''),
      fileUrl: activeTab === 'file' ? selectedFile.fileUrl : '',
    };

    submitAssignment(submissionPayload);
    setIsSubmitted(true);
    if (onSubmitted) onSubmitted();
  };

  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-charcoal/15 shadow-2xl overflow-hidden relative my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-cream/30 border-b border-charcoal/10 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest/10 text-forest">
                {assignment.courseName}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                Due: {assignment.dueDate} ({assignment.dueTime})
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-charcoal">
              Submit: {assignment.title}
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Select your deliverable method from the top tabs below (Max Score: {assignment.maxScore} pts)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Submission Success View */
          <div className="p-8 text-center space-y-4 my-auto animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Submission Recorded Successfully
            </span>

            <h4 className="text-2xl font-bold text-charcoal font-heading">
              Outstanding Work, {currentUser?.name}!
            </h4>

            <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed">
              Your assignment submission for <strong className="text-charcoal">{assignment.title}</strong> has been transmitted. Your instructor will review your work, inspect criteria, and provide feedback.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
              >
                Close & Return
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveTab('grades');
                }}
                className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md cursor-pointer"
              >
                View in Gradebook
              </button>
            </div>
          </div>
        ) : (
          /* Form with Top Tabs */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* TOP TABS: Text / Paragraphs, Link, File Upload */}
            <div className="p-3 bg-cream/50 border-b border-charcoal/10 shrink-0">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-2xl border border-charcoal/10 shadow-2xs">
                {/* Tab 1: Text / Paragraphs */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('text');
                    setErrorMessage('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-forest text-cream shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="truncate">Text / Paragraphs</span>
                </button>

                {/* Tab 2: Link */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('link');
                    setErrorMessage('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'link'
                      ? 'bg-forest text-cream shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="truncate">Web Link / URL</span>
                </button>

                {/* Tab 3: File Upload */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTabMode('file');
                    setErrorMessage('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'file'
                      ? 'bg-forest text-cream shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-cream/50'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span className="truncate">File Upload</span>
                </button>
              </div>
            </div>

            {/* Tab Body Content (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: TEXT / PARAGRAPHS */}
              {activeTab === 'text' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Response Title / Heading (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Critical Analysis & Studio Reflections"
                      value={textTitle}
                      onChange={(e) => setTextTitle(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                        Submission Paragraphs / Written Essay <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-charcoal-muted">
                        {wordCount} words • {textContent.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      required
                      placeholder="Write or paste your complete assignment response, conceptual rationale, analysis paragraphs, code, or studio documentation here..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed font-normal"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-cream/40 border border-charcoal/10 text-[11px] text-charcoal-muted flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span>
                      Tip: You can organize your paragraphs with clear headings, bullet points, or numbered steps. Your instructor can view the formatted text directly in their grading desk.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: LINK */}
              {activeTab === 'link' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Project or Artifact Web URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                      <input
                        type="url"
                        required
                        placeholder="https://example.com/your-project-demo"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full bg-cream/30 border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-charcoal-muted mt-1">
                      Enter the live link where your project, portfolio piece, or document can be accessed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Link Description &amp; Instructions for Evaluator (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what this URL showcases, any viewing guidelines, credentials if needed, or key highlights to inspect..."
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FILE UPLOAD */}
              {activeTab === 'file' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Deliverable File Attachment <span className="text-red-500">*</span>
                    </label>

                    <label className="border-2 border-dashed border-charcoal/20 hover:border-forest/50 rounded-2xl p-6 text-center bg-cream/20 hover:bg-cream/40 transition-all cursor-pointer block">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.zip,.docx,.txt"
                        className="hidden"
                      />
                      <UploadCloud className="w-9 h-9 text-forest mx-auto mb-2" />
                      <p className="text-xs font-bold text-charcoal">
                        Click to browse or drag &amp; drop your deliverable file
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-1">
                        Accepts PDF, Images (PNG, JPG), Word (DOCX), or Archives (ZIP) up to 50 MB
                      </p>
                    </label>

                    {/* Attached file pill */}
                    {selectedFile && (
                      <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-forest/5 border border-forest/20">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-5 h-5 text-forest shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-charcoal truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-[10px] text-charcoal-muted">
                              {selectedFile.size} • Ready for faculty review
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-forest uppercase tracking-wider bg-white px-2.5 py-1 rounded-lg border border-forest/20 shrink-0">
                          Attached
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Student Process Notes &amp; Commentary (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your creative decisions, techniques, challenges overcome, or questions for your teacher..."
                      value={fileNotes}
                      onChange={(e) => setFileNotes(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-charcoal/10 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-charcoal-muted hidden sm:inline">
                Evaluation based on {assignment.rubric?.length || 1} criteria breakdown
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream text-xs font-bold transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>Submit Assignment</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
