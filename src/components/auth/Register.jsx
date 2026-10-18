import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Sparkles, ArrowLeft, CheckCircle2, UserPlus, Clock } from 'lucide-react';

export const Register = () => {
  const { registerStudent, setActiveTab, switchDemoUser } = useLMS();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'School of Design & Creative Arts',
    phone: '',
    bio: '',
    notes: '',
  });

  const [registeredUser, setRegisteredUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please verify.');
      return;
    }
    const created = registerStudent(formData);
    setRegisteredUser(created);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 fill-gold" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-forest font-heading">
            Cache<span className="text-gold">Up</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-charcoal font-heading">
          Student Registration
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">
          Apply to join CacheUp Academy's premier cohort
        </p>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xl shadow-forest/5">
        {registeredUser ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              Registration Pending Approval
            </span>

            <h3 className="text-xl font-bold text-charcoal font-heading">
              Application Under Review!
            </h3>

            <p className="text-xs text-charcoal-muted mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-charcoal">{registeredUser.name}</strong>! Your application has been logged with ID{' '}
              <code className="text-forest font-semibold">{registeredUser.studentId}</code>. In accordance with CacheUp policies, an Administrator must verify and approve your registration before you can log in.
            </p>

            {/* Quick Demo shortcut to test approval */}
            <div className="mt-6 p-4 rounded-2xl bg-cream border border-gold/30 text-left">
              <p className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span>Test Approval as Admin:</span>
              </p>
              <p className="text-[11px] text-charcoal-muted mt-1 leading-snug">
                You can switch to Administrator (Marcus Vance) right now to approve this pending applicant!
              </p>
              <button
                onClick={() => {
                  switchDemoUser('admin');
                  setActiveTab('approvals');
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all text-center"
              >
                Log In as Admin to Review & Approve
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setActiveTab('login')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Rivers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Department / Interest
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="School of Design & Creative Arts">School of Design & Creative Arts</option>
                  <option value="Fine Arts & Contemporary Expression">Fine Arts & Contemporary Expression</option>
                  <option value="Digital Illustration & Concept Art">Digital Illustration & Concept Art</option>
                  <option value="Computer Science & UI Architecture">Computer Science & UI Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Applicant Bio & Academic Goals
              </label>
              <textarea
                rows={2}
                placeholder="Briefly describe your creative background and goals..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Submit Registration Application</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Already have an account? Sign in</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
