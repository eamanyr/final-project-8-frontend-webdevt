import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { ArrowLeft, Plus, Trash2, Sparkles, BookOpen, Save } from 'lucide-react';

export const CourseForm = () => {
  const { addCourse, setActiveTab, setSelectedCourseId } = useLMS();

  const [formData, setFormData] = useState({
    code: 'ART-205',
    title: '',
    category: 'Fine Arts',
    level: 'Beginner level',
    duration: '8 Weeks',
    totalLessons: 18,
    schedule: 'Tue & Thu • 10:00 AM - 12:00 PM',
    room: 'Studio Hall 3A',
    thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80',
    description: '',
    syllabus: [
      { unit: 'Unit 1', title: 'Foundations & Visual Anatomy', lessons: 6 },
      { unit: 'Unit 2', title: 'Studio Workshops & Execution', lessons: 6 },
      { unit: 'Unit 3', title: 'Critique & Portfolio Review', lessons: 6 },
    ],
  });

  const thumbnailPresets = [
    { label: 'Abstract Art', url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sketching', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Typography', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Web UI / Dev', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleAddUnit = () => {
    setFormData({
      ...formData,
      syllabus: [
        ...formData.syllabus,
        { unit: `Unit ${formData.syllabus.length + 1}`, title: 'New Unit Study', lessons: 4 },
      ],
    });
  };

  const handleRemoveUnit = (idx) => {
    setFormData({
      ...formData,
      syllabus: formData.syllabus.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill out course title and description.');
      return;
    }
    const newCourse = addCourse(formData);
    setSelectedCourseId(newCourse.id);
    setActiveTab('course-details');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Courses</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal font-heading">
              Create / Manage Course
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Publish an accredited course module to CacheUp Academy
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Course Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Course Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Ceramics & Volumetric Form"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value="Fine Arts">Fine Arts</option>
                <option value="Illustration">Illustration</option>
                <option value="Typography">Typography</option>
                <option value="Computer Science">Computer Science</option>
                <option value="UI/UX & Systems">UI/UX & Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value="Beginner level">Beginner level</option>
                <option value="Intermediate level">Intermediate level</option>
                <option value="Advanced level">Advanced level</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 10 Weeks"
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Course Description & Objectives
            </label>
            <textarea
              rows={3}
              required
              placeholder="Outline what students will learn, weekly studio exercises, and materials needed..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
            />
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Schedule Times
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g. Mon & Wed • 10:00 AM - 12:00 PM"
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Classroom / Studio Lab
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. Digital Lab 304 or Studio Hall 2"
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          {/* Cover Image Presets */}
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
              Select Cover Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {thumbnailPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setFormData({ ...formData, thumbnail: preset.url })}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                    formData.thumbnail === preset.url
                      ? 'border-forest ring-2 ring-forest/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="h-20 w-full object-cover"
                  />
                  <div className="p-1.5 bg-white text-[10px] font-semibold text-charcoal text-center">
                    {preset.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                Syllabus Units & Modules
              </label>
              <button
                type="button"
                onClick={handleAddUnit}
                className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-gold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.syllabus.map((unit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream/50 border border-charcoal/10"
                >
                  <span className="text-xs font-mono font-bold text-forest w-16">
                    {unit.unit}
                  </span>
                  <input
                    type="text"
                    value={unit.title}
                    onChange={(e) => {
                      const updated = [...formData.syllabus];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, syllabus: updated });
                    }}
                    placeholder="Unit topic title"
                    className="flex-1 bg-white border border-charcoal/10 rounded-lg px-2.5 py-1 text-xs text-charcoal focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={unit.lessons}
                    onChange={(e) => {
                      const updated = [...formData.syllabus];
                      updated[idx].lessons = parseInt(e.target.value) || 1;
                      setFormData({ ...formData, syllabus: updated });
                    }}
                    className="w-16 bg-white border border-charcoal/10 rounded-lg px-2 py-1 text-xs text-charcoal text-center"
                  />
                  <span className="text-[11px] text-charcoal-muted">Lessons</span>
                  {formData.syllabus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUnit(idx)}
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
              onClick={() => setActiveTab('courses')}
              className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Publish Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
