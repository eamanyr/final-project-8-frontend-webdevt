import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  Server,
  Zap
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    currentUser,
    users,
    courses,
    approveUser,
    rejectUser,
    setActiveTab,
    pendingApprovalsCount,
    refreshUsers,
  } = useLMS();

  React.useEffect(() => {
    if (refreshUsers) refreshUsers();
  }, []);

  const totalStudents = users.filter((u) => u.role === 'student' && u.status === 'approved').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const pendingUsers = users.filter((u) => u.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
            Super Administrator Control
          </span>
          <h2 className="text-2xl font-bold text-charcoal font-heading">
            System Overview & Registry
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Logged in as {currentUser?.name} • Dean of Academic Registry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('approvals')}
            className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Applications ({pendingApprovalsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="px-4 py-2 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </button>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={totalStudents}
          subtitle="Accredited learners"
          icon={GraduationCap}
          trend="+8 this week"
          trendPositive={true}
          colorScheme="forest"
          onClick={() => setActiveTab('users')}
        />
        <StatCard
          title="Faculty Members"
          value={totalTeachers}
          subtitle="Department lecturers"
          icon={Users}
          colorScheme="sage"
          onClick={() => setActiveTab('users')}
        />
        <StatCard
          title="Published Courses"
          value={courses.length}
          subtitle="Curriculum active"
          icon={BookOpen}
          colorScheme="gold"
          onClick={() => setActiveTab('courses')}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtitle="Applicants awaiting check"
          icon={UserCheck}
          trend={pendingApprovalsCount > 0 ? 'Requires Action' : 'Cleared'}
          trendPositive={pendingApprovalsCount === 0}
          colorScheme={pendingApprovalsCount > 0 ? 'gold' : 'charcoal'}
          onClick={() => setActiveTab('approvals')}
        />
      </div>

      {/* Pending Student Registrations Queue */}
      <div className="@container bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold font-heading text-charcoal">
              Pending Student Registration Approvals
            </h3>
            {pendingApprovalsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                {pendingApprovalsCount} pending
              </span>
            )}
          </div>
          <button
            onClick={() => setActiveTab('approvals')}
            className="text-xs font-bold text-forest hover:text-gold transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <span>All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-charcoal-muted text-xs">
            ✅ All student registration requests have been reviewed and approved!
          </div>
        ) : (
          <>
            {/* Narrow space: one card per applicant */}
            <ul className="@3xl:hidden space-y-3">
              {pendingUsers.map((applicant) => (
                <li
                  key={applicant.id}
                  className="p-4 rounded-2xl border border-charcoal/10 bg-cream/40"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={applicant.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-charcoal/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-charcoal truncate">
                        {applicant.name}
                      </p>
                      <p className="text-[11px] text-charcoal-muted break-all">
                        {applicant.email}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-forest shrink-0">
                      {applicant.studentId}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-medium text-charcoal">
                    {applicant.department}
                  </p>
                  <p className="mt-1 text-xs text-charcoal-muted leading-relaxed">
                    {applicant.registrationNotes || 'Submitted online student application.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => approveUser(applicant.id)}
                      className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => rejectUser(applicant.id, 'Incomplete transcripts')}
                      className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Wide space: the normal table */}
            <div className="hidden @3xl:block overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal/10 text-charcoal-muted uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pr-4 font-bold">Applicant</th>
                    <th className="pb-3 pr-4 font-bold">Department</th>
                    <th className="pb-3 pr-4 font-bold">Student App ID</th>
                    <th className="pb-3 pr-4 font-bold">Notes / Verification</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {pendingUsers.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={applicant.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-charcoal/10"
                          />
                          <div>
                            <p className="font-semibold text-charcoal">
                              {applicant.name}
                            </p>
                            <p className="text-[10px] text-charcoal-muted">
                              {applicant.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-charcoal font-medium">
                        {applicant.department}
                      </td>
                      <td className="py-3 pr-4 font-mono text-forest whitespace-nowrap">
                        {applicant.studentId}
                      </td>
                      <td className="py-3 pr-4 text-charcoal-muted max-w-xs truncate">
                        {applicant.registrationNotes || 'Submitted online student application.'}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveUser(applicant.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                            title="Approve applicant"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => rejectUser(applicant.id, 'Incomplete transcripts')}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Reject applicant"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* System Health & Vercel Edge Performance */}
      <div className="@container">
        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-sm font-bold font-heading text-charcoal flex items-center gap-2">
                <Server className="w-4 h-4 text-forest shrink-0" />
                <span>Platform Health & Infrastructure</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                Operational
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3 py-1.5 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Deployment Target</span>
                <span className="font-semibold text-charcoal text-right">Vercel Edge & Vite</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5 border-b border-charcoal/5">
                <span className="text-charcoal-muted">Local State Cache</span>
                <span className="font-semibold text-forest text-right">Synchronized (localStorage)</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5">
                <span className="text-charcoal-muted">System Security</span>
                <span className="font-semibold text-charcoal text-right">Role-Based Access Control</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-charcoal/10 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-sm font-bold font-heading text-charcoal flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold-dark shrink-0" />
                <span>Academic Integrity Policies</span>
              </h4>
              <span className="text-xs text-forest font-semibold shrink-0">Active</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              All registered courses comply with the 2026 CacheUp Accreditation Guidelines. Instructors must deliver student grades within 7 calendar days of assignment due dates.
            </p>
            <div className="mt-4 pt-3 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-charcoal-muted">Audit Version: CU-2026.4</span>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-bold text-forest hover:underline"
              >
                Post Academy Bulletin →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};