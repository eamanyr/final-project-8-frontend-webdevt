import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  FileText
} from 'lucide-react';

export const MyGrades = () => {
  const { currentUser, submissions, assignments, courses } = useLMS();

  // Find all submissions by this student
  const studentSubmissions = submissions.filter(
    (s) => s.studentId === currentUser?.id
  );

  const gradedSubmissions = studentSubmissions.filter((s) => s.status === 'Graded');

  // Calculate cumulative average
  const totalScore = gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0);
  const totalMax = gradedSubmissions.reduce((acc, s) => acc + (s.maxScore || 100), 0);
  const avgPercentage = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : '92.5';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Academic Performance
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            My Grades & Instructor Evaluations
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Verified marks, letter grades, and qualitative feedback for {currentUser?.name}
          </p>
        </div>

        {/* GPA Summary Pill */}
        <div className="flex items-center gap-3 bg-cream p-3 rounded-2xl border border-charcoal/10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
              Cumulative GPA
            </span>
            <span className="text-base font-extrabold text-charcoal font-heading">
              {currentUser?.gpa || '3.88'} / 4.0 ({avgPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <h3 className="text-base font-bold font-heading text-charcoal mb-4">
          Assignment Gradebook
        </h3>

        {studentSubmissions.length === 0 ? (
          <div className="text-center py-12 text-charcoal-muted text-xs">
            No assignment submissions recorded yet. Check your course assignments to submit your work!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Assignment</th>
                  <th className="pb-3 font-bold">Submitted Date</th>
                  <th className="pb-3 font-bold">Score</th>
                  <th className="pb-3 font-bold">Grade</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Evaluator Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {studentSubmissions.map((sub) => {
                  const isGraded = sub.status === 'Graded';
                  const letter = isGraded ? getLetterGrade(sub.score, sub.maxScore) : '—';

                  return (
                    <tr key={sub.id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-charcoal">
                          {sub.assignmentTitle}
                        </div>
                        <div className="text-[11px] text-charcoal-muted flex items-center gap-2 mt-0.5">
                          {sub.fileName && <span>📁 {sub.fileName}</span>}
                        </div>
                      </td>

                      <td className="py-4 text-charcoal-muted">
                        {sub.submissionDate}
                      </td>

                      <td className="py-4 font-mono font-bold text-charcoal">
                        {isGraded ? `${sub.score} / ${sub.maxScore}` : 'Pending'}
                      </td>

                      <td className="py-4">
                        {isGraded ? (
                          <span className="px-2.5 py-1 rounded-lg bg-forest/10 text-forest font-extrabold text-xs">
                            {letter}
                          </span>
                        ) : (
                          <span className="text-charcoal-muted">—</span>
                        )}
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isGraded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>

                      <td className="py-4 max-w-xs">
                        {isGraded ? (
                          <div className="text-xs text-charcoal-muted leading-relaxed">
                            <span className="font-semibold text-charcoal block text-[11px]">
                              Prof. Alicia Mayer:
                            </span>
                            "{sub.feedback}"
                          </div>
                        ) : (
                          <span className="text-charcoal-muted italic">
                            Awaiting professor critique...
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
