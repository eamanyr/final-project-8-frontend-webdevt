import React from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const MyGrades = () => {
  const {
    currentUser,
    submissions,
    assignments,
    courses,
    quizSubmissions,
    setSelectedCourseId,
    setCourseActiveTab,
    setActiveTab,
  } = useLMS();

  // Helper for letter grades
  const getLetterGrade = (scoreOrPct, max = 100) => {
    const pct = typeof max === 'number' && max > 0 ? (Number(scoreOrPct) / max) * 100 : Number(scoreOrPct);
    if (pct >= 94) return 'A';
    if (pct >= 90) return 'A-';
    if (pct >= 87) return 'B+';
    if (pct >= 83) return 'B';
    if (pct >= 80) return 'B-';
    if (pct >= 75) return 'C+';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  };

  // Find all submissions by this student
  const studentSubmissions = submissions.filter(
    (s) => s.studentId === currentUser?.id
  );
  const gradedSubmissions = studentSubmissions.filter((s) => s.status === 'Graded');

  const studentQuizSubs = (quizSubmissions || []).filter(
    (s) => s.studentId === currentUser?.id
  );

  // Overall Cumulative Total
  const totalScore =
    gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) +
    studentQuizSubs.reduce((acc, q) => acc + (q.score || 0), 0);
  const totalMax =
    gradedSubmissions.reduce((acc, s) => acc + (s.maxScore || 100), 0) +
    studentQuizSubs.reduce((acc, q) => acc + (q.maxScore || 100), 0);
  const hasAnyEvaluated = totalMax > 0;
  const avgPercentage = hasAnyEvaluated ? ((totalScore / totalMax) * 100).toFixed(1) : null;
  const overallLetter = hasAnyEvaluated ? getLetterGrade(avgPercentage) : '—';

  // Enrolled Courses for this student
  const enrolledCourses = courses.filter((c) =>
    currentUser?.enrolledCourseIds && currentUser.enrolledCourseIds.length > 0
      ? currentUser.enrolledCourseIds.includes(c.id)
      : true
  );

  // Calculate total grade per enrolled course
  const courseGradeSummaries = enrolledCourses.map((c) => {
    const courseAsgs = assignments.filter((a) => a.courseId === c.id);
    const courseSubs = studentSubmissions.filter(
      (s) => s.courseId === c.id && s.status === 'Graded'
    );
    const courseQuizzes = (studentQuizSubs || []).filter((q) => q.courseId === c.id);

    const asgEarned = courseSubs.reduce((acc, s) => acc + (Number(s.score) || 0), 0);
    const asgMax = courseSubs.reduce((acc, s) => acc + (Number(s.maxScore) || 100), 0);

    const quizEarned = courseQuizzes.reduce((acc, q) => acc + (Number(q.score) || 0), 0);
    const quizMax = courseQuizzes.reduce((acc, q) => acc + (Number(q.maxScore) || 100), 0);

    const totalEarned = asgEarned + quizEarned;
    const totalPossible = asgMax + quizMax;

    const hasEvaluated = totalPossible > 0;
    const percentage = hasEvaluated ? ((totalEarned / totalPossible) * 100).toFixed(1) : null;
    const letter = hasEvaluated ? getLetterGrade(percentage) : '—';
    const completedTasks = courseSubs.length + courseQuizzes.length;

    return {
      course: c,
      totalEarned,
      totalPossible,
      hasEvaluated,
      percentage,
      letter,
      completedTasks,
      totalAssignments: courseAsgs.length,
    };
  });

  const handleOpenCourseGrades = (courseId) => {
    setSelectedCourseId(courseId);
    if (setCourseActiveTab) setCourseActiveTab('grades');
    setActiveTab('courses');
  };

  return (
    <div className="space-y-6">
      {/* 1. Academic Header with Cumulative GPA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1.5">
            Academic Performance
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            My Grades & Course Records
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Total course marks, GPA standing, and qualitative faculty feedback for {currentUser?.name}
          </p>
        </div>

        {/* GPA Summary Card */}
        <div className="flex items-center gap-3.5 bg-cream p-3.5 sm:p-4 rounded-2xl border border-charcoal/10 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center font-bold shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-charcoal-muted tracking-wider block">
              Cumulative GPA
            </span>
            <div className="text-lg font-extrabold text-charcoal font-heading leading-tight">
              {currentUser?.gpa ? `${currentUser.gpa}` : (hasAnyEvaluated ? '3.88' : 'N/A')} <span className="text-xs text-charcoal-muted font-normal">/ 4.0</span>
            </div>
            <span className="text-[11px] font-semibold text-forest">
              {hasAnyEvaluated ? `${avgPercentage}% • Letter Grade ${overallLetter}` : 'No graded tasks yet • In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Enrolled Courses Total Grades List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-charcoal/10">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-forest" />
              <h3 className="text-base font-bold font-heading text-charcoal">
                Enrolled Courses — Total Grade Summary
              </h3>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Overall cumulative grades across all of your active studio courses. Click any course to view full task breakdowns.
            </p>
          </div>
          <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1 rounded-full self-start sm:self-auto">
            {enrolledCourses.length} Enrolled Courses
          </span>
        </div>

        {courseGradeSummaries.length === 0 ? (
          <div className="text-center py-10 text-charcoal-muted text-xs">
            You are not currently enrolled in any courses.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseGradeSummaries.map(({ course, totalEarned, totalPossible, percentage, letter, completedTasks }) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl border border-charcoal/10 bg-cream/30 hover:bg-cream/60 transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-charcoal/10 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded-md">
                          {course.code}
                        </span>
                        <h4 className="text-xs font-bold text-charcoal truncate mt-0.5">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-charcoal-muted truncate">
                          {course.instructorName}
                        </p>
                      </div>
                    </div>

                    {/* Total Grade Badge */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-forest text-gold font-heading text-lg font-extrabold shadow-2xs">
                        {letter}
                      </div>
                      <div className="text-xs font-bold text-charcoal font-heading mt-1">
                        {hasEvaluated ? `${percentage}%` : 'No Grades Yet'}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Task Counts */}
                  <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-[11px]">
                    <span className="text-charcoal-muted">
                      Evaluated Score: <strong className="text-charcoal font-mono">{hasEvaluated ? `${totalEarned} / ${totalPossible} pts` : '0 pts evaluated'}</strong>
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${completedTasks > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-charcoal/10 text-charcoal-muted'}`}>
                      {completedTasks > 0 ? `${completedTasks} Tasks Graded` : 'Pending Evaluation'}
                    </span>
                  </div>
                </div>

                {/* View Course Grades Tab Button */}
                <button
                  type="button"
                  onClick={() => handleOpenCourseGrades(course.id)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-charcoal/15 text-xs font-bold text-forest hover:bg-forest hover:text-cream transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>View Course Gradebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Detailed Assignment Gradebook Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-forest" />
          <h3 className="text-base font-bold font-heading text-charcoal">
            Individual Assignment Submissions
          </h3>
        </div>

        {studentSubmissions.length === 0 ? (
          <div className="text-center py-10 text-charcoal-muted text-xs">
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
                        {isGraded ? `${sub.score} / ${sub.maxScore} pts` : 'Pending'}
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
                              {sub.gradedBy || 'Instructor'}:
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

      {/* 4. Quiz Assessments Gradebook */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-purple-700" />
          <h3 className="text-base font-bold font-heading text-charcoal">
            Multiple Choice Quiz Gradebook
          </h3>
        </div>

        {studentQuizSubs.length === 0 ? (
          <div className="text-center py-8 text-charcoal-muted text-xs">
            No quiz attempts recorded yet. You can take unit quizzes directly in your course syllabus!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-bold">Quiz Assessment</th>
                  <th className="pb-3 font-bold">Course</th>
                  <th className="pb-3 font-bold">Submitted Date</th>
                  <th className="pb-3 font-bold">Score</th>
                  <th className="pb-3 font-bold">Grade</th>
                  <th className="pb-3 font-bold">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {studentQuizSubs.map((qSub) => {
                  const letter = getLetterGrade(qSub.score, qSub.maxScore);

                  return (
                    <tr key={qSub.id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4 font-bold text-charcoal">
                        {qSub.quizTitle}
                      </td>
                      <td className="py-4 text-charcoal-muted">
                        {qSub.courseName}
                      </td>
                      <td className="py-4 text-charcoal-muted">
                        {qSub.submittedAt}
                      </td>
                      <td className="py-4 font-mono font-bold text-charcoal">
                        {qSub.score} / {qSub.maxScore} pts ({qSub.percentage}%)
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-forest/10 text-forest font-extrabold text-xs">
                          {letter}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            qSub.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {qSub.passed ? 'Passed' : 'Needs Review'}
                        </span>
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
