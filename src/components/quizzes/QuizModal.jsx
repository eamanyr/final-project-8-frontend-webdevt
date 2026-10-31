import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  X,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

export const QuizModal = ({ course, editingQuiz, initialUnitIdx = 0, onClose }) => {
  const { addQuiz, updateQuiz, addToast } = useLMS();

  const [formData, setFormData] = useState(() => {
    if (editingQuiz) {
      return {
        unitIdx: editingQuiz.unitIdx !== undefined ? editingQuiz.unitIdx : initialUnitIdx,
        title: editingQuiz.title || '',
        description: editingQuiz.description || '',
        dueDate: editingQuiz.dueDate || '',
        dueTime: editingQuiz.dueTime || '',
        timeLimitMinutes: editingQuiz.timeLimitMinutes || '',
        passingScorePercent: editingQuiz.passingScorePercent || '',
        questions: editingQuiz.questions && editingQuiz.questions.length
          ? editingQuiz.questions
          : [
              {
                id: `q-${Date.now()}-1`,
                prompt: '',
                points: 10,
                options: ['', '', '', ''],
                correctOptionIndex: 0,
                explanation: '',
              },
            ],
      };
    }
    return {
      unitIdx: initialUnitIdx,
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      timeLimitMinutes: '',
      passingScorePercent: '',
      questions: [
        {
          id: `q-${Date.now()}-1`,
          prompt: '',
          points: '',
          options: ['', '', '', ''],
          correctOptionIndex: null,
          explanation: '',
        },
      ],
    };
  });

  const [errorMessage, setErrorMessage] = useState('');

  // Add Question
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q-${Date.now()}-${prev.questions.length + 1}`,
          prompt: '',
          points: '',
          options: ['', '', '', ''],
          correctOptionIndex: null,
          explanation: '',
        },
      ],
    }));
  };

  // Remove Question
  const handleRemoveQuestion = (qIdx) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx),
    }));
  };

  // Update Question prompt or points or explanation
  const handleUpdateQuestion = (qIdx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[qIdx] = {
        ...updated[qIdx],
        [field]: field === 'points' ? (value === '' ? '' : Math.max(1, parseInt(value) || 1)) : value,
      };
      return { ...prev, questions: updated };
    });
  };

  // Update Question Option Text
  const handleUpdateOption = (qIdx, optIdx, text) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      const updatedOpts = [...updated[qIdx].options];
      updatedOpts[optIdx] = text;
      updated[qIdx] = { ...updated[qIdx], options: updatedOpts };
      return { ...prev, questions: updated };
    });
  };

  // Add Option to a question
  const handleAddOption = (qIdx) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      if (updated[qIdx].options.length >= 6) return prev;
      updated[qIdx] = {
        ...updated[qIdx],
        options: [...updated[qIdx].options, ''],
      };
      return { ...prev, questions: updated };
    });
  };

  // Remove Option from a question
  const handleRemoveOption = (qIdx, optIdx) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      if (updated[qIdx].options.length <= 2) return prev;
      const updatedOpts = updated[qIdx].options.filter((_, idx) => idx !== optIdx);
      let correctIdx = updated[qIdx].correctOptionIndex;
      if (correctIdx === optIdx) correctIdx = null;
      else if (correctIdx !== null && correctIdx > optIdx) correctIdx -= 1;

      updated[qIdx] = {
        ...updated[qIdx],
        options: updatedOpts,
        correctOptionIndex: correctIdx,
      };
      return { ...prev, questions: updated };
    });
  };

  // Set Correct Answer for a question
  const handleSetCorrectOption = (qIdx, optIdx) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[qIdx] = {
        ...updated[qIdx],
        correctOptionIndex: optIdx,
      };
      return { ...prev, questions: updated };
    });
  };

  const totalPoints = formData.questions.reduce((acc, q) => acc + (Number(q.points) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim()) {
      setErrorMessage('Please enter a quiz title.');
      return;
    }

    if (formData.questions.length === 0) {
      setErrorMessage('Please add at least one multiple choice question.');
      return;
    }

    if (!formData.dueDate || !formData.dueTime.trim()) {
      setErrorMessage('Please set the due date and due time.');
      return;
    }
    if (!Number(formData.timeLimitMinutes) || !Number(formData.passingScorePercent)) {
      setErrorMessage('Please enter the time limit and passing score.');
      return;
    }

    // Validate that questions have prompts and options
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.prompt.trim()) {
        setErrorMessage(`Question ${i + 1} prompt cannot be empty.`);
        return;
      }
      if (!Number(q.points)) {
        setErrorMessage(`Question ${i + 1} needs a points value.`);
        return;
      }
      if (q.correctOptionIndex === null || q.correctOptionIndex === undefined) {
        setErrorMessage(`Select the correct answer for Question ${i + 1}.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setErrorMessage(`Option ${String.fromCharCode(65 + j)} in Question ${i + 1} cannot be empty.`);
          return;
        }
      }
    }

    const payload = {
      courseId: course.id,
      courseName: course.title,
      unitIdx: Number(formData.unitIdx),
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      duration: `${formData.timeLimitMinutes} minutes`,
      timeLimitMinutes: Number(formData.timeLimitMinutes),
      passingScorePercent: Number(formData.passingScorePercent),
      totalPoints,
      questions: formData.questions,
    };

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, payload);
    } else {
      addQuiz(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-charcoal/15 shadow-2xl p-6 sm:p-8 relative my-6 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-charcoal">
                {editingQuiz ? 'Edit Multiple Choice Quiz' : 'Create Multiple Choice Quiz'}
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                {course.code}: {course.title} • Build questions, designate correct options, and configure scoring
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-cream text-charcoal-muted hover:text-charcoal cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Top metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Target Curriculum Unit
              </label>
              <select
                value={formData.unitIdx}
                onChange={(e) => setFormData({ ...formData, unitIdx: Number(e.target.value) })}
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-semibold focus:outline-hidden focus:border-forest"
              >
                {(course.syllabus || []).map((u, uIdx) => (
                  <option key={uIdx} value={uIdx}>
                    {u.unit || `Unit ${uIdx + 1}`}: {u.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Color Harmonies & Contrast Multi-Choice Quiz"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-semibold focus:outline-hidden focus:border-forest"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Due Time
              </label>
              <input
                type="text"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                placeholder="11:59 PM"
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={formData.timeLimitMinutes}
                onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal font-bold text-center focus:outline-hidden focus:border-forest font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.passingScorePercent}
                onChange={(e) => setFormData({ ...formData, passingScorePercent: e.target.value })}
                className="w-full bg-cream/30 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal font-bold text-center focus:outline-hidden focus:border-forest font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Instructions &amp; Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide instructions, scope, or background context for students taking this quiz..."
              className="w-full bg-cream/30 border border-charcoal/15 rounded-xl p-3 text-xs text-charcoal focus:outline-hidden focus:border-forest resize-none leading-relaxed"
            />
          </div>

          {/* QUESTIONS BUILDER */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-charcoal font-heading">
                  Multiple Choice Questions ({formData.questions.length})
                </h4>
                <p className="text-[11px] text-charcoal-muted">
                  Click the radio button beside an option to mark it as the correct answer.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-forest font-mono bg-forest/10 px-2.5 py-1 rounded-lg">
                  Total: {totalPoints} Pts
                </span>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 sm:p-5 rounded-2xl bg-cream/30 border border-charcoal/15 space-y-3.5 shadow-2xs"
                >
                  {/* Question header with points & remove */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-forest text-gold text-xs flex items-center justify-center font-bold">
                        {qIdx + 1}
                      </span>
                      <span>Question Prompt</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <label className="text-[11px] text-charcoal-muted font-bold">Points:</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'points', e.target.value)}
                          className="w-14 bg-white border border-charcoal/15 rounded-lg px-2 py-1 text-xs text-charcoal font-bold text-center font-mono focus:outline-hidden focus:border-forest"
                        />
                      </div>

                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1.5 text-charcoal-muted hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question prompt textarea */}
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter question text (e.g. Which pigment combination yields chromatic gray?)"
                    value={q.prompt}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'prompt', e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl p-3 text-xs text-charcoal focus:outline-hidden focus:border-forest font-medium resize-none leading-relaxed"
                  />

                  {/* Options List */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider">
                      Answer Choices (Select radio button for the correct choice):
                    </label>

                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrect = q.correctOptionIndex === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-white border-charcoal/10'
                          }`}
                        >
                          {/* Radio button to select correct answer */}
                          <button
                            type="button"
                            onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                            className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-cream text-charcoal-muted hover:text-charcoal border border-charcoal/15'
                            }`}
                            title="Click to mark as correct answer"
                          >
                            {letter}
                          </button>

                          <input
                            type="text"
                            required
                            placeholder={`Option ${letter} choice text`}
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className="flex-1 bg-transparent border-none text-xs text-charcoal focus:outline-hidden font-medium"
                          />

                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Correct Answer</span>
                            </span>
                          )}

                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(qIdx, optIdx)}
                              className="p-1 text-charcoal-muted hover:text-red-500 cursor-pointer"
                              title="Remove this option"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => handleAddOption(qIdx)}
                        className="text-[11px] font-bold text-forest hover:text-gold inline-flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Option ({String.fromCharCode(65 + q.options.length)})</span>
                      </button>
                    )}
                  </div>

                  {/* Explanation for students */}
                  <div>
                    <label className="block text-[11px] font-bold text-charcoal uppercase tracking-wider mb-1">
                      Explanation / Learning Note (Shown after quiz completion)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Complementary colors form maximum chromatic contrast..."
                      value={q.explanation || ''}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3 py-1.5 text-xs text-charcoal focus:outline-hidden focus:border-forest"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-charcoal/20 hover:border-forest/50 text-forest text-xs font-bold hover:bg-forest/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Multiple Choice Question</span>
            </button>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between gap-3">
            <span className="text-xs text-charcoal-muted font-medium">
              Passing threshold: {formData.passingScorePercent}% of {totalPoints} total points
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream text-xs font-bold transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-gold" />
                <span>{editingQuiz ? 'Save Quiz Changes' : 'Publish Quiz to Unit'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
