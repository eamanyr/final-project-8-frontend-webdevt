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
  AlertCircle
} from 'lucide-react';

// Files are sent to the API as base64 inside a 10 MB JSON body, so keep the raw file under ~7 MB.
const MAX_UPLOAD_BYTES = 7 * 1024 * 1024;

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

  // Active top tab: 'file' | 'link' | 'text'
  const [activeTab, setActiveTabMode] = useState('file');

  // Form states
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');

  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileNotes, setFileNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!assignment) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setErrorMessage('This file is too large. Please upload a file of 7 MB or less.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        fileUrl: reader.result,
        rawFile: file,
      });
      setErrorMessage('');
    };
    reader.onerror = () => setErrorMessage('Could not read that file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'text' && !textContent.trim()) {
      setErrorMessage('Please write your submission paragraphs or essay response.');
      return;
    }
    if (activeTab === 'link') {
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
    }
    if (activeTab === 'file' && (!selectedFile || !selectedFile.name)) {
      setErrorMessage('Please attach a deliverable file for your submission.');
      return;
    }

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e3f33', '#de9e36', '#9cb49a', '#232724'],
    });

    submitAssignment({
      assignmentId: assignment.id,
      submissionType: activeTab,
      content:
        activeTab === 'text'
          ? (textTitle ? `${textTitle}\n\n${textContent}` : textContent)
          : activeTab === 'link'
          ? (linkDescription || `Project submission link for ${assignment.title}`)
          : (fileNotes || `Attached project deliverable: ${selectedFile.name}`),
      linkUrl: activeTab === 'link' ? linkUrl : '',
      fileName: activeTab === 'file' ? selectedFile.name : '',
      fileSize: activeTab === 'file' ? selectedFile.size : '',
      fileUrl: activeTab === 'file' ? selectedFile.fileUrl : '',
    });

    setIsSubmitted(true);
  };

  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Return Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('assignment-details')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignment Details</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        {isSubmitted ? (
          <div className="text-center py-8 animate-in zoom-in-95 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Submission Successful
            </span>

            <h3 className="text-2xl font-bold text-charcoal font-heading">
              Great Job, {currentUser?.name}!
            </h3>

            <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed">
              Your submission for <strong className="text-charcoal">{assignment.title}</strong> has been transmitted to your instructor ({assignment.courseName}). You can track grading and teacher feedback on your Grades page.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() =>
                  setActiveTab(
                    assignmentOrigin === 'course-details' ? 'course-details' : 'todo'
                  )
                }
                className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream cursor-pointer"
              >
                {assignmentOrigin === 'course-details'
                  ? 'Back to Course Details'
                  : 'Back to To-Do'}
              </button>
              <button
                onClick={() => setActiveTab('grades')}
                className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md cursor-pointer"
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
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TOP TABS ON TOP OF SUBMISSION */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Choose Submission Deliverable Format
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-cream/50 rounded-2xl border border-charcoal/10">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTabMode('text');
                      setErrorMessage('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'text'
                        ? 'bg-forest text-cream shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-white/60'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Text / Paragraphs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTabMode('link');
                      setErrorMessage('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'link'
                        ? 'bg-forest text-cream shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-white/60'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Web Link / URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTabMode('file');
                      setErrorMessage('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'file'
                        ? 'bg-forest text-cream shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-white/60'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>File Upload</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: TEXT / PARAGRAPHS */}
              {activeTab === 'text' && (
                <div className="space-y-4 animate-in fade-in duration-150">
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
                        Written Response Paragraphs <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-charcoal-muted">
                        {wordCount} words • {textContent.length} characters
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      required
                      placeholder="Enter your full written response, essay paragraphs, process commentary, or detailed analysis here..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: LINK */}
              {activeTab === 'link' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Project or Deliverable Web URL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                      <input
                        type="url"
                        required
                        placeholder="https://example.com/project-demo"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full bg-cream/30 border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Link Description &amp; Instructions (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe what this URL showcases and any notes for the instructor..."
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: FILE UPLOAD */}
              {activeTab === 'file' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Attach Deliverable File <span className="text-red-500">*</span>
                    </label>
                    <label className="border-2 border-dashed border-charcoal/20 hover:border-forest/50 rounded-2xl p-6 text-center bg-cream/30 hover:bg-cream/50 transition-colors cursor-pointer block">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.zip,.docx,.txt"
                        className="hidden"
                      />
                      <UploadCloud className="w-8 h-8 text-forest mx-auto mb-2" />
                      <p className="text-xs font-bold text-charcoal">
                        Drag and drop your deliverable or click to browse
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-1">
                        Supports PDF, PNG, JPG, DOCX, or ZIP (Max file size 7 MB)
                      </p>

                      {/* Attached pill */}
                      {selectedFile && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-charcoal/15 shadow-2xs">
                          <FileText className="w-4 h-4 text-forest" />
                          <span className="text-xs font-bold text-charcoal">
                            {selectedFile.name}
                          </span>
                          <span className="text-[10px] text-charcoal-muted">
                            ({selectedFile.size})
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                      Process Commentary &amp; Submission Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={fileNotes}
                      onChange={(e) => setFileNotes(e.target.value)}
                      placeholder="Describe your design choices, tools utilized, challenges encountered, and key solutions..."
                      className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-hidden focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('assignment-details')}
                  className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm &amp; Transmit Work</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
