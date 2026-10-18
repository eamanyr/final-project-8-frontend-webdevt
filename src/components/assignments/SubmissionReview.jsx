import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { GradingModal } from './GradingModal';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  FileText,
  User
} from 'lucide-react';

export const SubmissionReview = () => {
  const {
    submissions,
    courses,
    selectedSubmissionId,
    setSelectedSubmissionId,
  } = useLMS();

  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeGradingSub, setActiveGradingSub] = useState(null);

  // If selectedSubmissionId was passed from dashboard
  React.useEffect(() => {
    if (selectedSubmissionId) {
      const found = submissions.find((s) => s.id === selectedSubmissionId);
      if (found) setActiveGradingSub(found);
      setSelectedSubmissionId(null);
    }
  }, [selectedSubmissionId]);

  const filtered = submissions.filter((s) => {
    if (statusFilter === 'pending' && s.status !== 'Submitted') return false;
    if (statusFilter === 'graded' && s.status !== 'Graded') return false;
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;
    if (
      search &&
      !s.studentName.toLowerCase().includes(search.toLowerCase()) &&
      !s.assignmentTitle.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Faculty Evaluation Desk
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Student Submission Review & Grading
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Evaluate project submissions, attach qualitative feedback, and record marks
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-charcoal text-cream shadow-xs font-bold'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-charcoal text-cream shadow-xs font-bold'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Awaiting Review ({submissions.filter((s) => s.status === 'Submitted').length})
          </button>
          <button
            onClick={() => setStatusFilter('graded')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              statusFilter === 'graded'
                ? 'bg-charcoal text-cream shadow-xs font-bold'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Graded
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or assignment..."
            className="w-full bg-white border border-charcoal/15 rounded-xl pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none w-full sm:w-auto"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-charcoal/10 text-charcoal-muted text-xs">
            No submissions found matching your filters.
          </div>
        ) : (
          filtered.map((sub) => {
            const isGraded = sub.status === 'Graded';

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  isGraded
                    ? 'border-charcoal/10 shadow-xs'
                    : 'border-amber-200 bg-amber-50/20 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Student & Assignment Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={sub.studentAvatar}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold font-heading text-charcoal">
                          {sub.studentName}
                        </h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isGraded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-forest mt-0.5">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        Submitted: {sub.submissionDate}
                      </p>

                      {/* Content excerpt */}
                      <p className="text-xs text-charcoal mt-3 max-w-xl leading-relaxed bg-cream/50 p-3 rounded-xl border border-charcoal/5">
                        "{sub.content || 'Submission file uploaded.'}"
                      </p>

                      {/* Attachment links */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {sub.fileName && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cream text-charcoal text-[11px] font-mono border border-charcoal/10">
                            <FileText className="w-3.5 h-3.5 text-forest" />
                            <span>{sub.fileName} ({sub.fileSize})</span>
                          </span>
                        )}
                        {sub.linkUrl && (
                          <a
                            href={sub.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cream text-forest text-[11px] font-semibold border border-charcoal/10 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Project URL</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Score or Action Button */}
                  <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0">
                    {isGraded ? (
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
                          Recorded Score
                        </span>
                        <span className="text-2xl font-extrabold text-forest font-heading">
                          {sub.score} <span className="text-xs text-charcoal-muted">/ {sub.maxScore}</span>
                        </span>
                        <p className="text-[10px] text-charcoal-muted mt-0.5">
                          Graded by {sub.gradedBy}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                        Pending Evaluation
                      </span>
                    )}

                    <button
                      onClick={() => setActiveGradingSub(sub)}
                      className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isGraded ? 'Update Grade' : 'Grade Submission'}</span>
                    </button>
                  </div>
                </div>

                {/* Display recorded feedback if already graded */}
                {isGraded && sub.feedback && (
                  <div className="mt-4 pt-3 border-t border-charcoal/10 text-xs">
                    <span className="font-bold text-charcoal">Instructor Feedback: </span>
                    <span className="text-charcoal-muted leading-relaxed">
                      "{sub.feedback}"
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grading Modal */}
      {activeGradingSub && (
        <GradingModal
          submission={activeGradingSub}
          onClose={() => setActiveGradingSub(null)}
        />
      )}
    </div>
  );
};
