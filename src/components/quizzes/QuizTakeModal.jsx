import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  Check,
  XCircle
} from 'lucide-react';

export const QuizTakeModal = ({ quiz, existingSubmission, onClose }) => {
  const { currentUser, submitQuiz } = useLMS();

  const [answers, setAnswers] = useState(() => {
    return existingSubmission?.answers || {};
  });

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(existingSubmission));
  const [submissionResult, setSubmissionResult] = useState(existingSubmission || null);
  const [validationError, setValidationError] = useState('');

  // Countdown timer in seconds
  const [secondsLeft, setSecondsLeft] = useState(() => (quiz.timeLimitMinutes || 20) * 60);

  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSelectOption = (questionId, optIdx) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optIdx,
    }));
    setValidationError('');
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    const unansweredCount = quiz.questions.filter((q) => answers[q.id] === undefined).length;
    if (unansweredCount > 0 && !confirm(`You have ${unansweredCount} unanswered question(s). Submit quiz anyway?`)) {
      return;
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1e3f33', '#de9e36', '#9cb49a', '#232724'],
    });

    const timeSpentMins = Math.floor(((quiz.timeLimitMinutes || 20) * 60 - secondsLeft) / 60);
    const timeSpentSecs = ((quiz.timeLimitMinutes || 20) * 60 - secondsLeft) % 60;
    const timeSpentFormatted = `${timeSpentMins}m ${timeSpentSecs}s`;

    const result = submitQuiz({
      quizId: quiz.id,
      answers,
      timeSpent: timeSpentFormatted,
    });

    setSubmissionResult(result);
    setIsSubmitted(true);
  };

  const questions = quiz.questions || [];
  const currentQ = questions[currentQIndex] || questions[0];
  const answeredTotal = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/65 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-charcoal/15 shadow-2xl p-6 sm:p-8 relative my-6 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2 py-0.5 rounded-full bg-forest/10">
                  Multiple Choice Assessment
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  {quiz.courseName || 'Course'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-charcoal mt-0.5">
                {quiz.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream border border-charcoal/10 text-xs font-mono font-bold text-charcoal">
                <Clock className="w-3.5 h-3.5 text-forest" />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSubmitted && submissionResult ? (
          /* RESULT REVIEW SCREEN */
          <div className="space-y-6 animate-in zoom-in-95">
            {/* Score Banner */}
            <div
              className={`p-6 rounded-3xl border text-center space-y-3 ${
                submissionResult.passed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center shadow-2xs">
                {submissionResult.passed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white shadow-2xs">
                  {submissionResult.passed ? '🎉 Passed' : 'Below Passing Score'}
                </span>
                <h4 className="text-2xl font-bold font-heading mt-2">
                  {submissionResult.score} / {submissionResult.maxScore} Points ({submissionResult.percentage}%)
                </h4>
                <p className="text-xs text-charcoal-muted mt-1">
                  Completed on {submissionResult.submittedAt} ({submissionResult.timeSpent || 'Finished'})
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-charcoal/10 text-[11px] font-bold text-forest mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Auto-Graded Instantly • No Teacher Review Needed</span>
                </div>
              </div>
            </div>

            {/* Question Breakdown with Correct Answers and Explanations */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal font-heading">
                Instant Answer Key & Explanations
              </h4>

              {questions.map((q, idx) => {
                const studentAnswerIdx = submissionResult.answers?.[q.id];
                const isCorrect = studentAnswerIdx === q.correctOptionIndex;

                return (
                  <div
                    key={q.id || idx}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                      isCorrect
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-red-50/20 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-charcoal leading-snug">
                            {q.prompt}
                          </p>
                          <span className="text-[10px] font-mono font-semibold text-charcoal-muted">
                            Worth: {q.points} Pts
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <Check className="w-3 h-3" /> Correct (+{q.points} pts)
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Incorrect (0 pts)
                          </>
                        )}
                      </span>
                    </div>

                    {/* Options list showing student selection vs correct answer */}
                    <div className="space-y-1.5 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isStudentChoice = studentAnswerIdx === oIdx;
                        const isTheCorrectAnswer = q.correctOptionIndex === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                              isTheCorrectAnswer
                                ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-900'
                                : isStudentChoice
                                ? 'bg-red-100/70 border-red-300 font-semibold text-red-900'
                                : 'bg-white/60 border-charcoal/10 text-charcoal-muted'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-white text-charcoal border border-charcoal/15 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {letter}
                              </span>
                              <span>{opt}</span>
                            </span>

                            {isTheCorrectAnswer && (
                              <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Correct Answer
                              </span>
                            )}
                            {isStudentChoice && !isTheCorrectAnswer && (
                              <span className="text-[10px] font-bold text-red-800 flex items-center gap-1">
                                Your Selection
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-white border border-charcoal/10 text-xs text-charcoal space-y-0.5">
                        <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">
                          Instructor Learning Note:
                        </span>
                        <p className="text-charcoal-muted leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md cursor-pointer"
              >
                Close &amp; Return to Course
              </button>
            </div>
          </div>
        ) : (
          /* QUIZ TAKING ENVIRONMENT */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Bar & Question Jump bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-charcoal">
                <span>
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="text-charcoal-muted font-normal">
                  {answeredTotal} of {questions.length} Answered
                </span>
              </div>

              <div className="w-full bg-cream rounded-full h-2 overflow-hidden border border-charcoal/10">
                <div
                  className="bg-forest h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(answeredTotal / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Number Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = currentQIndex === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? 'bg-forest text-gold ring-2 ring-forest/30 shadow-2xs'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-cream/60 text-charcoal-muted hover:text-charcoal hover:bg-cream border border-charcoal/10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Display Card */}
            {currentQ && (
              <div className="p-5 sm:p-6 rounded-3xl bg-cream/30 border border-charcoal/15 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm sm:text-base font-bold font-heading text-charcoal leading-snug">
                    {currentQ.prompt}
                  </h4>
                  <span className="text-xs font-mono font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-lg shrink-0">
                    {currentQ.points} Pts
                  </span>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const letter = String.fromCharCode(65 + optIdx);
                    const isSelected = answers[currentQ.id] === optIdx;

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-forest text-cream border-forest shadow-xs'
                            : 'bg-white hover:bg-cream/50 border-charcoal/15 text-charcoal'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? 'bg-gold text-charcoal shadow-2xs'
                              : 'bg-cream text-charcoal border border-charcoal/10'
                          }`}
                        >
                          {letter}
                        </span>

                        <span className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
                          {opt}
                        </span>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gold text-charcoal flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation & Submit CTA */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex((i) => Math.min(questions.length - 1, i + 1))}
                    className="px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-charcoal text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Completed Quiz</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
