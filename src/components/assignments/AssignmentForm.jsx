import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ArrowLeft, Plus, Trash2, Save, FileCheck2 } from 'lucide-react';

export const AssignmentForm = () => {
  const { courses, addAssignment, setActiveTab, setSelectedAssignmentId } = useLMS();

  const [formData, setFormData] = useState({
    courseId: courses[0]?.id || 'crs-1',
    title: '',
    description: '',
    dueDate: '2026-10-30',
    dueTime: '11:59 PM',
    duration: '2 hours 30 min',
    maxScore: 100,
    priority: 'High',
    rubric: [
      { criteria: 'Technical Execution & Precision', points: 40 },
      { criteria: 'Concept Originality & Aesthetic Flow', points: 35 },
      { criteria: 'Documentation & Presentation', points: 25 },
    ],
  });

  const handleAddRubricItem = () => {
    setFormData({
      ...formData,
      rubric: [...formData.rubric, { criteria: 'Additional Studio Criterion', points: 10 }],
    });
  };

  const handleRemoveRubricItem = (idx) => {
    setFormData({
      ...formData,
      rubric: formData.rubric.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in assignment title and description.');
      return;
    }
    const created = addAssignment(formData);
    setSelectedAssignmentId(created.id);
    setActiveTab('assignment-details');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('assignments')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Assignments</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal font-heading">
              Create / Edit Assignment
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Publish student tasks, submission rubrics, and deadlines
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Target Course
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dynamic Balance & Typography Poster"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
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
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
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
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Max Score (Pts)
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Instructions & Deliverables
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail assignment steps, technical expectations, source material citations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
            />
          </div>

          {/* Rubric Criteria Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                Evaluation Rubric Breakdown
              </label>
              <button
                type="button"
                onClick={handleAddRubricItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Criterion</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.rubric.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream/40 border border-charcoal/10"
                >
                  <input
                    type="text"
                    value={r.criteria}
                    onChange={(e) => {
                      const updated = [...formData.rubric];
                      updated[idx].criteria = e.target.value;
                      setFormData({ ...formData, rubric: updated });
                    }}
                    placeholder="Criteria name"
                    className="flex-1 bg-white border border-charcoal/10 rounded-lg px-2.5 py-1 text-xs text-charcoal focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={r.points}
                    onChange={(e) => {
                      const updated = [...formData.rubric];
                      updated[idx].points = parseInt(e.target.value) || 0;
                      setFormData({ ...formData, rubric: updated });
                    }}
                    className="w-20 bg-white border border-charcoal/10 rounded-lg px-2 py-1 text-xs text-charcoal text-center font-bold"
                  />
                  <span className="text-[11px] text-charcoal-muted">Pts</span>
                  {formData.rubric.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRubricItem(idx)}
                      className="p-1 text-charcoal-muted hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Publish Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
