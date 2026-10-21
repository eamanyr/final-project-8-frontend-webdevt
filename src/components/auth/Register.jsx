import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Sparkles, ArrowLeft, UserPlus, Clock } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?\d{10,13}$/;

const validate = (data) => {
  const errors = {};

  const name = data.name.trim();
  if (!name) errors.name = 'Full name is required.';
  else if (name.length < 2 || name.length > 50) errors.name = 'Name must be 2 to 50 characters.';

  const email = data.email.trim();
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email like name@example.com.';

  if (!data.password) errors.password = 'Password is required.';
  else if (data.password.length < 8) errors.password = 'Use at least 8 characters.';

  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  // Phone is optional, but if filled in it must look like a real number.
  const phone = data.phone.replace(/[\s\-().]/g, '');
  if (phone && !PHONE_REGEX.test(phone)) {
    errors.phone = 'Enter a valid number, e.g. 0917 123 4567 or +63 917 123 4567.';
  }

  return errors;
};

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-[11px] text-red-600">{message}</p> : null;

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

  const [errors, setErrors] = useState({});
  const [registeredUser, setRegisteredUser] = useState(null);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `w-full bg-cream/40 border rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 ${
      errors[field] ? 'border-red-500 focus:ring-red-200' : 'border-charcoal/15 focus:ring-forest/30'
    }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const created = await registerStudent(formData);
    if (created) setRegisteredUser(created);
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
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Rivers"
                  value={formData.name}
                  onChange={(e) => setField('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  className={inputClass('name')}
                />
                <FieldError message={errors.name} />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jordan@example.com"
                  value={formData.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  className={inputClass('email')}
                />
                <FieldError message={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => setField('password', e.target.value)}
                  aria-invalid={!!errors.password}
                  className={inputClass('password')}
                />
                <FieldError message={errors.password} />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  aria-invalid={!!errors.confirmPassword}
                  className={inputClass('confirmPassword')}
                />
                <FieldError message={errors.confirmPassword} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                  Department / Interest
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setField('department', e.target.value)}
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
                  inputMode="tel"
                  maxLength={20}
                  placeholder="e.g. 0917 123 4567"
                  value={formData.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                  className={inputClass('phone')}
                />
                <FieldError message={errors.phone} />
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
                onChange={(e) => setField('bio', e.target.value)}
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