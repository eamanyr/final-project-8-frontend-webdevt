import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Bell,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Filter,
  X,
  Send,
  Sparkles
} from 'lucide-react';

export const Announcements = () => {
  const {
    announcements,
    courses,
    currentUser,
    addAnnouncement,
    markAnnouncementAsRead,
    deleteAnnouncement,
  } = useLMS();

  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    courseId: 'all',
    priority: 'Normal',
    content: '',
  });

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const filtered = announcements.filter((a) => {
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    addAnnouncement(formData);
    setShowCreateModal(false);
    setFormData({ title: '', courseId: 'all', priority: 'Normal', content: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Official Academy Communications
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Announcements & Bulletins
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Campus notices, exhibition schedules, studio deadlines, and technical bulletins
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-charcoal-muted">Filter by Priority:</span>
        {['all', 'Urgent', 'Normal', 'Info'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
              filterPriority === p
                ? 'bg-charcoal text-cream shadow-xs font-bold'
                : 'bg-white border border-charcoal/10 text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {p === 'all' ? 'All Priority' : p}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isUrgent = item.priority === 'Urgent';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                isUrgent
                  ? 'border-amber-300 bg-amber-50/20 shadow-sm'
                  : 'border-charcoal/10 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.authorAvatar}
                    alt=""
                    className="w-11 h-11 rounded-2xl object-cover border border-charcoal/10 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded-md">
                        {item.courseName}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isUrgent
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cream text-charcoal border border-charcoal/10'
                        }`}
                      >
                        {item.priority}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                      )}
                    </div>

                    <h3 className="text-base font-bold font-heading text-charcoal mt-1.5">
                      {item.title}
                    </h3>

                    <p className="text-xs text-charcoal-muted mt-0.5">
                      Published by <strong className="text-charcoal">{item.authorName}</strong> ({item.authorRole}) • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                  {!item.isRead && (
                    <button
                      onClick={() => markAnnouncementAsRead(item.id)}
                      className="px-3 py-1 rounded-xl bg-cream border border-charcoal/15 text-[11px] font-semibold text-charcoal hover:bg-white transition-colors"
                    >
                      Mark as read
                    </button>
                  )}

                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => deleteAnnouncement(item.id)}
                      className="p-1.5 rounded-lg text-charcoal-muted hover:text-red-600 hover:bg-red-50"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-charcoal/10 text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {item.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-charcoal/15 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 mb-4">
              <h3 className="text-base font-bold font-heading text-charcoal">
                Post Academy Announcement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Target Audience / Course
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="all">All Academy Cohorts & Faculty</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Bulletin Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Change: Studio Critiques Moved to Friday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Priority Tag
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Info">Informational</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type bulletin text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-muted hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
