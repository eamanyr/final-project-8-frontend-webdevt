import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  TrendingUp,
  Award,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Download,
  Sparkles,
  Printer,
  X
} from 'lucide-react';

export const MyProgress = () => {
  const { currentUser, courses, assignments, submissions, addToast } = useLMS();
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const enrolledCourses = courses.filter((c) =>
    currentUser?.enrolledCourseIds?.includes(c.id)
  );

  const badges = [
    {
      id: 'bdg-1',
      title: 'Nuqta Geometry Master',
      desc: 'Completed all Arabic calligraphy dot calibration exercises with 98% accuracy.',
      icon: '✒️',
      earnedDate: 'Oct 2026',
      color: 'bg-gold/20 text-gold-dark',
    },
    {
      id: 'bdg-2',
      title: '14-Day Study Streak',
      desc: 'Logged in and completed studio tasks consecutively for two full weeks.',
      icon: '🔥',
      earnedDate: 'Oct 2026',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'bdg-3',
      title: 'Bauhaus Color Scholar',
      desc: 'Published an approved modern art mood board with flawless chromatic balance.',
      icon: '🎨',
      earnedDate: 'Sept 2026',
      color: 'bg-forest/10 text-forest',
    },
    {
      id: 'bdg-4',
      title: 'Early Bird Submitter',
      desc: 'Delivered three major assignments at least 24 hours prior to deadline.',
      icon: '⚡',
      earnedDate: 'Sept 2026',
      color: 'bg-sage/30 text-forest-dark',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Learning Analytics
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            My Learning Progress & Milestones
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Real-time track completion, study streaks, and accredited competency badges
          </p>
        </div>

        <button
          onClick={() => setShowTranscriptModal(true)}
          className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Download Progress Transcript</span>
        </button>
      </div>

      {/* Course Completion Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <h3 className="text-base font-bold font-heading text-charcoal mb-4">
          Course Track Completion
        </h3>

        <div className="space-y-4">
          {enrolledCourses.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-cream/40 border border-charcoal/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                    {c.code}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal">{c.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-forest">
                    {c.completedLessons || 0} /{' '}
                    {c.syllabus?.reduce((acc, u) => acc + (u.lessons || 0), 0) || c.totalLessons || 6}{' '}
                    Lessons
                  </span>
                  <span className="text-xs font-extrabold text-charcoal ml-2">
                    ({c.progress}%)
                  </span>
                </div>
              </div>

              <div className="w-full h-3 rounded-full bg-charcoal/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-700"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Earned Badges & Achievements */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-heading text-charcoal">
            Academy Honors & Badges
          </h3>
          <span className="text-xs font-bold text-forest">
            {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-charcoal/10 bg-cream/30 text-center flex flex-col items-center justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-charcoal/10 flex items-center justify-center text-2xl shadow-xs mx-auto mb-3">
                  {b.icon}
                </div>
                <h4 className="text-xs font-bold text-charcoal font-heading">
                  {b.title}
                </h4>
                <p className="text-[11px] text-charcoal-muted mt-1 leading-snug">
                  {b.desc}
                </p>
              </div>

              <span className="mt-3 px-2 py-0.5 rounded-full text-[10px] font-semibold text-charcoal-muted bg-white border border-charcoal/10">
                Earned {b.earnedDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-charcoal/15 shadow-2xl relative">
            <button
              onClick={() => setShowTranscriptModal(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-charcoal/10 mb-4">
              <span className="text-lg font-extrabold text-forest font-heading">
                Cache<span className="text-gold">Up</span> Academy
              </span>
              <h3 className="text-base font-bold text-charcoal mt-1">
                Official Student Progress Certificate
              </h3>
              <p className="text-xs text-charcoal-muted">
                Student: {currentUser?.name} • ID: {currentUser?.studentId}
              </p>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Cumulative GPA</span>
                <span className="font-bold text-charcoal">{currentUser?.gpa} / 4.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Total Enrolled Tracks</span>
                <span className="font-bold text-charcoal">{enrolledCourses.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Academy Honor Points</span>
                <span className="font-bold text-forest">{currentUser?.points} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Accreditation Status</span>
                <span className="font-bold text-emerald-700">Good Standing (2026)</span>
              </div>
            </div>

            <button
              onClick={() => {
                addToast('Transcript downloaded as PDF.', 'success');
                setShowTranscriptModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Confirm & Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
