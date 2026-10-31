import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ArrowLeft, Plus, Trash2, Save, FileCheck2, Sliders, Check } from 'lucide-react';

export const AssignmentForm = () => {
  const {
    courses,
    currentUser,
    assignments,
    addAssignment,
    updateAssignment,
    setActiveTab,
    selectedAssignmentId,
    setSelectedAssignmentId,
  } = useLMS();

  const isTeacher = currentUser?.role === 'teacher';
  const teacherCourses = isTeacher
    ? courses.filter(
        (c) =>
          c.instructorId === currentUser?.id ||
          (currentUser?._id && c.instructorId === currentUser?._id) ||
          currentUser?.assignedCourseIds?.includes(c.id) ||
          (c._id && currentUser?.assignedCourseIds?.includes(c._id)) ||
          (c.instructorName &&
            currentUser?.name &&
            c.instructorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
      )
    : courses;
  const availableCourses = isTeacher && teacherCourses.length > 0 ? teacherCourses : courses;

  const [mode, setMode] = useState('create'); // 'create' | 'edit'
  const [selectedEditId, setSelectedEditId] = useState(selectedAssignmentId || assignments[0]?.id || '');

  const [formData, setFormData] = useState({
    courseId: '',
    unitIdx: '',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    duration: '',
    maxScore: '',
    priority: '',
    rubric: [],
  });

  // If in edit mode, populate form
  const handleSelectEditAssignment = (asgId) => {
    setSelectedEditId(asgId);
    const target = assignments.find((a) => a.id === asgId);
    if (target) {
      setFormData({
        courseId: target.courseId || '',
        unitIdx: target.unitIdx !== undefined ? target.unitIdx : '',
        title: target.title || '',
        description: target.description || '',
        dueDate: target.dueDate || '',
        dueTime: target.dueTime || '',
        duration: target.duration || '',
        maxScore: target.maxScore || '',
        priority: target.priority || '',
        rubric: target.rubric && target.rubric.length ? target.rubric : [],
      });
    }
  };

  const handleAddRubricItem = () => {
    setFormData((prev) => {
      const updatedRubric = [...prev.rubric, { criteria: '', points: '' }];
      const sum = updatedRubric.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
      return {
        ...prev,
        rubric: updatedRubric,
        maxScore: sum,
      };
    });
  };

  const handleRemoveRubricItem = (idx) => {
    setFormData((prev) => {
      const updatedRubric = prev.rubric.filter((_, i) => i !== idx);
      const sum = updatedRubric.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
      return {
        ...prev,
        rubric: updatedRubric,
        maxScore: sum > 0 ? sum : prev.maxScore,
      };
    });
  };

  const handleRubricChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.rubric];
      updated[idx] = {
        ...updated[idx],
        [field]: field === 'points' ? (value === '' ? '' : Math.max(0, parseInt(value) || 0)) : value,
      };
      const sum = updated.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
      return {
        ...prev,
        rubric: updated,
        maxScore: sum > 0 ? sum : prev.maxScore,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in assignment title and description.');
      return;
    }

    const totalRubricPts = formData.rubric.reduce((acc, r) => acc + (Number(r.points) || 0), 0);
    const finalMaxScore = totalRubricPts > 0 ? totalRubricPts : parseInt(formData.maxScore) || 0;
    if (!finalMaxScore) {
      alert('Please enter the maximum score or add rubric criteria with points.');
      return;
    }

    const payload = {
      ...formData,
      maxScore: finalMaxScore,
      unitIdx: Number(formData.unitIdx),
    };

    if (mode === 'edit' && selectedEditId) {
      updateAssignment(selectedEditId, payload);
      setSelectedAssignmentId(selectedEditId);
    } else {
      const created = addAssignment(payload);
      if (created?.id) setSelectedAssignmentId(created.id);
    }

    setActiveTab('assignment-details');
  };

  const selectedCourseObj = availableCourses.find((c) => c.id === formData.courseId) || availableCourses[0];
  const totalRubricPoints = formData.rubric.reduce((acc, r) => acc + (Number(r.points) || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('assignments')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel &amp; Back to Assignments</span>
        </button>

        {/* Mode Switcher: Create New or Edit Existing */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-charcoal/10 shadow-2xs">
          <button
            type="button"
            onClick={() => setMode('create')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'create'
                ? 'bg-forest text-cream shadow-2xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Create New
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('edit');
              handleSelectEditAssignment(selectedEditId || assignments[0]?.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'edit'
                ? 'bg-forest text-cream shadow-2xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Edit Existing
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal font-heading">
              {mode === 'edit' ? 'Edit Assignment & Criteria' : 'Create Assignment & Define Criteria'}
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Publish student tasks, evaluate rubrics, and configure deadline points
            </p>
          </div>
        </div>

        {mode === 'edit' && (
          <div className="mb-5 p-3.5 rounded-2xl bg-cream/40 border border-charcoal/10">
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Select Assignment to Modify
            </label>
            <select
              value={selectedEditId}
              onChange={(e) => handleSelectEditAssignment(e.target.value)}
              className="w-full bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal focus:outline-hidden focus:border-forest"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.courseName || 'Course'})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Target Course
              </label>
              <select
                required
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value, unitIdx: '' })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest font-semibold"
              >
                <option value="" disabled>Select a course</option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Target Curriculum Unit
              </label>
              <select
                required
                value={formData.unitIdx}
                onChange={(e) => setFormData({ ...formData, unitIdx: Number(e.target.value) })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest font-semibold"
              >
                <option value="" disabled>Select a unit</option>
                {(selectedCourseObj?.syllabus || []).map((u, uIdx) => (
                  <option key={uIdx} value={uIdx}>
                    {u.unit || `Unit ${uIdx + 1}`}: {u.title}
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
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest font-semibold"
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
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Due Time
              </label>
              <input
                type="text"
                required
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                placeholder="11:59 PM"
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
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
                required={formData.rubric.length === 0}
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest"
              >
                <option value="" disabled>Select priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Instructions &amp; Deliverables
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail assignment steps, technical expectations, source material citations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-hidden focus:border-forest resize-none leading-relaxed"
            />
          </div>

          {/* Rubric Criteria Builder & Modifier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                  Evaluation Rubric &amp; Criteria Breakdown
                </label>
                <p className="text-[11px] text-charcoal-muted">
                  Add, customize, or remove criteria. Total points will update dynamically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRubricItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold cursor-pointer"
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
                    onChange={(e) => handleRubricChange(idx, 'criteria', e.target.value)}
                    placeholder="Criteria name or description"
                    className="flex-1 bg-white border border-charcoal/10 rounded-lg px-2.5 py-1.5 text-xs text-charcoal focus:outline-hidden focus:border-forest font-medium"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={r.points}
                    onChange={(e) => handleRubricChange(idx, 'points', e.target.value)}
                    className="w-20 bg-white border border-charcoal/10 rounded-lg px-2 py-1.5 text-xs text-charcoal text-center font-bold font-mono focus:outline-hidden focus:border-forest"
                  />
                  <span className="text-[11px] text-charcoal-muted font-semibold">Pts</span>
                  {formData.rubric.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRubricItem(idx)}
                      className="p-1 text-charcoal-muted hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove criterion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-charcoal-muted">
              <span>{formData.rubric.length} criteria defined</span>
              <span className="font-bold text-forest font-mono">
                Total Criteria Points: {totalRubricPoints} pts
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('assignments')}
              className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>{mode === 'edit' ? 'Save Assignment Changes' : 'Publish Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
