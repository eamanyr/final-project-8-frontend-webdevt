import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Badge } from '../common/Badge';
import {
  ShieldCheck,
  Check,
  X,
  Search,
  Clock,
  UserCheck,
  FileText,
  Mail,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const PendingApprovals = () => {
  const { users, approveUser, rejectUser, currentUser, refreshUsers } = useLMS();

  React.useEffect(() => {
    if (refreshUsers) refreshUsers();
  }, []);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Filter student applications
  const studentUsers = users.filter((u) => u.role === 'student');

  const filtered = studentUsers.filter((u) => {
    const matchesFilter = filter === 'all' || u.status === filter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenReject = (user) => {
    setSelectedApplicant(user);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedApplicant) {
      rejectUser(selectedApplicant.id, rejectReason);
      setShowRejectModal(false);
      setSelectedApplicant(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Registry Administration
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            Student Registration & Approvals
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Verify prospective student credentials and grant academy enrollment permissions
          </p>
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center bg-cream/70 rounded-full p-1 border border-charcoal/10">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-charcoal text-cream shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Pending ({users.filter((u) => u.role === 'student' && u.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'approved'
                ? 'bg-charcoal text-cream shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-charcoal text-cream shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            All Applicants
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by applicant name, email, or application ID..."
          className="w-full bg-white border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
        />
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-charcoal-muted text-xs">
            No applicant records match your selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((student) => {
              const isPending = student.status === 'pending';
              const isApproved = student.status === 'approved';

              return (
                <div
                  key={student.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-200 dark:bg-cream-dark dark:border-gold/40'
                      : isApproved
                      ? 'bg-white border-charcoal/10 dark:bg-cream-dark'
                      : 'bg-red-50/30 border-red-200 dark:bg-red-500/10 dark:border-red-400/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={student.avatar}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover border border-charcoal/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-charcoal font-heading">
                            {student.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300'
                            }`}
                          >
                            {student.status}
                          </span>
                        </div>

                        <p className="text-xs text-charcoal font-medium mt-0.5">
                          {student.department}
                        </p>
                        <p className="text-[11px] text-charcoal-muted flex items-center gap-1.5 mt-1">
                          <Mail className="w-3 h-3 text-forest" />
                          <span>{student.email}</span>
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-charcoal/10 text-forest dark:bg-cream">
                      {student.studentId}
                    </span>
                  </div>

                  {/* Bio & Application Notes */}
                  <div className="mt-4 p-3 rounded-xl bg-white/70 border border-charcoal/10 text-xs dark:bg-cream/60">
                    <p className="text-charcoal-muted leading-relaxed">
                      {student.bio || student.registrationNotes || 'No additional notes provided.'}
                    </p>
                    {student.registrationNotes && student.bio && (
                      <p className="text-[11px] text-forest font-medium mt-1 pt-1 border-t border-charcoal/5">
                        Note: {student.registrationNotes}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between">
                    <span className="text-[11px] text-charcoal-muted">
                      Applied: {student.joinedDate}
                    </span>

                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleOpenReject(student)}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-400/10"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => approveUser(student.id)}
                            className="px-4 py-1.5 rounded-xl bg-forest text-cream hover:bg-forest-light text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve Student</span>
                          </button>
                        </>
                      ) : isApproved ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 dark:text-emerald-300">
                          <Check className="w-4 h-4" /> Enrolled & Authorized
                        </span>
                      ) : (
                        <button
                          onClick={() => approveUser(student.id)}
                          className="px-3 py-1.5 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-colors"
                        >
                          Reconsider & Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs dark:bg-black/60">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-charcoal/15 shadow-2xl">
            <h3 className="text-base font-bold font-heading text-charcoal">
              Reject Student Application
            </h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Provide a reason for rejecting {selectedApplicant?.name} ({selectedApplicant?.email}).
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Incomplete identity verification or missing prerequisite course transcripts..."
              rows={3}
              className="w-full mt-4 p-3 rounded-xl border border-charcoal/15 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};