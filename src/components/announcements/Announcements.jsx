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
  Sparkles,
  MessageSquare,
} from 'lucide-react';

const DEFAULT_REPLIES = {
  'anc-1': [
    {
      id: 'rep-1',
      authorName: 'Melissa Anderson',
      authorRole: 'student',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      date: '2026-10-14 16:20',
      content: 'So excited for the gallery showcase! Do we need to frame our canvas pieces ourselves?',
    },
    {
      id: 'rep-2',
      authorName: 'Prof. Alicia Mayer',
      authorRole: 'teacher',
      authorAvatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      date: '2026-10-14 17:05',
      content: 'The studio department will provide standard oak frames for all selected works!',
    },
  ],
  'anc-2': [
    {
      id: 'rep-3',
      authorName: 'Stella Walton',
      authorRole: 'student',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      date: '2026-10-12 18:10',
      content: 'Looking forward to the Pentagram guest lecture! Will a recording be shared afterwards?',
    },
  ],
};

export const Announcements = () => {
  const {
    announcements,
    courses,
    currentUser,
    addAnnouncement,
    markAnnouncementAsRead,
    deleteAnnouncement,
    addAnnouncementReply,
    selectedAnnouncementId,
    setSelectedAnnouncementId,
  } = useLMS();

  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    priority: '',
    content: '',
  });

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
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

  const getReplies = (item) => {
    if (!item) return [];
    return item.replies ?? DEFAULT_REPLIES[item.id] ?? [];
  };

  const selectedAnnouncement = announcements.find(
    (a) => a.id === selectedAnnouncementId
  );

  const filtered = announcements.filter((a) => {
    if (filterPriority !== 'all' && a.priority !== filterPriority) return false;
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    addAnnouncement(formData);
    setShowCreateModal(false);
    setFormData({ title: '', courseId: '', priority: '', content: '' });
  };

  const handleOpenAnnouncement = (item) => {
    if (!item.isRead) {
      markAnnouncementAsRead(item.id);
    }
    setSelectedAnnouncementId(item.id);
    setReplyText('');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedAnnouncement) return;
    const currentReplies = getReplies(selectedAnnouncement);
    addAnnouncementReply(selectedAnnouncement.id, replyText.trim(), currentReplies);
    setReplyText('');
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
          const repliesCount = getReplies(item).length;

          return (
            <div
              key={item.id}
              onClick={() => handleOpenAnnouncement(item)}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer group hover:shadow-md ${
                isUrgent
                  ? 'border-amber-300 bg-amber-50/20 shadow-sm hover:border-amber-400'
                  : 'border-charcoal/10 shadow-xs hover:border-forest/30'
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

                    <h3 className="text-base font-bold font-heading text-charcoal group-hover:text-forest transition-colors mt-1.5">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        markAnnouncementAsRead(item.id);
                      }}
                      className="px-3 py-1 rounded-xl bg-cream border border-charcoal/15 text-[11px] font-semibold text-charcoal hover:bg-white transition-colors"
                    >
                      Mark as read
                    </button>
                  )}

                  {isTeacherOrAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAnnouncement(item.id);
                      }}
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

              <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-between text-xs text-charcoal-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-forest group-hover:underline">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {repliesCount} {repliesCount === 1 ? 'Reply' : 'Replies'} • Click to view &amp; comment
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Announcement & Reply/Comment Modal */}
      {selectedAnnouncement && (
        <div
          onClick={() => setSelectedAnnouncementId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col border border-charcoal/15 shadow-2xl overflow-hidden animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-charcoal/10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={selectedAnnouncement.authorAvatar}
                  alt={selectedAnnouncement.authorName}
                  className="w-11 h-11 rounded-2xl object-cover border border-charcoal/10 shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded-md">
                      {selectedAnnouncement.courseName}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        selectedAnnouncement.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-cream text-charcoal border border-charcoal/10'
                      }`}
                    >
                      {selectedAnnouncement.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-heading text-charcoal mt-1.5">
                    {selectedAnnouncement.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Published by{' '}
                    <strong className="text-charcoal">
                      {selectedAnnouncement.authorName}
                    </strong>{' '}
                    ({selectedAnnouncement.authorRole}) • {selectedAnnouncement.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAnnouncementId(null)}
                className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body: Announcement Content + Replies */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Announcement Full Message */}
              <div className="p-4 rounded-2xl bg-cream/40 border border-charcoal/10 text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
                {selectedAnnouncement.content}
              </div>

              {/* Comments / Replies Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-forest" />
                  <span>
                    Replies &amp; Comments ({getReplies(selectedAnnouncement).length})
                  </span>
                </h4>

                {getReplies(selectedAnnouncement).length === 0 ? (
                  <p className="text-xs text-charcoal-muted py-4 text-center bg-cream/20 rounded-2xl border border-charcoal/5">
                    No comments yet. Be the first to reply to this announcement!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getReplies(selectedAnnouncement).map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3.5 rounded-2xl bg-cream/30 border border-charcoal/10 flex items-start gap-3"
                      >
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-charcoal/10 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-charcoal">
                                {reply.authorName}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-forest/10 text-forest">
                                {reply.authorRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-charcoal-muted">
                              {reply.date}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal mt-1 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input Footer */}
            <form
              onSubmit={handleSendReply}
              className="p-4 sm:px-6 bg-cream/40 border-t border-charcoal/10 flex items-center gap-2.5"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-charcoal/10 shrink-0 hidden sm:block"
              />
              <input
                type="text"
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a comment or reply to this announcement..."
                className="flex-1 bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-xs text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

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
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="" disabled>Select an audience</option>
                  <option value="all">All Academy Cohorts & Faculty</option>
                  {availableCourses.map((c) => (
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
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="" disabled>Select a priority</option>
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
