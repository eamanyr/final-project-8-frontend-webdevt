import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Lock, User, Bell, Save } from 'lucide-react';

const PHONE_REGEX = /^\+?\d{10,13}$/;

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-[11px] text-red-600">{message}</p> : null;

export const AccountSettings = () => {
  const { currentUser, updateProfile } = useLMS();

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    title: currentUser?.title || '',
    department: currentUser?.department || '',
    bio: currentUser?.bio || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || '',
  });
  const [profileErrors, setProfileErrors] = useState({});

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passErrors, setPassErrors] = useState({});

  const [notifications, setNotifications] = useState({
    emailGrades: true,
    announcements: true,
    dueReminders: true,
  });

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  ];

  const inputClass = (hasError) =>
    `w-full bg-cream/40 border rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 ${
      hasError ? 'border-red-500 focus:ring-red-200' : 'border-charcoal/15 focus:ring-forest/30'
    }`;

  const setProfileField = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const setPassField = (field, value) => {
    setPassForm((prev) => ({ ...prev, [field]: value }));
    if (passErrors[field]) setPassErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};

    const name = profileForm.name.trim();
    if (!name) errors.name = 'Full name is required.';
    else if (name.length < 2 || name.length > 50) errors.name = 'Name must be 2 to 50 characters.';

    // Phone is optional, but if filled in it must look like a real number.
    const phone = profileForm.phone.trim();
    if (phone && !PHONE_REGEX.test(phone.replace(/[\s\-().]/g, ''))) {
      errors.phone = 'Enter a valid number, e.g. 0917 123 4567 or +63 917 123 4567.';
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    updateProfile({ ...profileForm, name, phone });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    const errors = {};

    if (!passForm.currentPassword) {
      errors.currentPassword = 'Enter your current password.';
    } else if (passForm.currentPassword !== currentUser?.password) {
      errors.currentPassword = 'Current password is incorrect.';
    }

    if (!passForm.newPassword) {
      errors.newPassword = 'Enter a new password.';
    } else if (passForm.newPassword.length < 8) {
      errors.newPassword = 'Use at least 8 characters.';
    } else if (passForm.newPassword === passForm.currentPassword) {
      errors.newPassword = 'New password must be different from the current one.';
    }

    if (!passForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (passForm.newPassword !== passForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setPassErrors(errors);
    if (Object.keys(errors).length > 0) return;

    updateProfile({ password: passForm.newPassword }, 'Password changed successfully!');
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal/10 shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-forest px-2.5 py-0.5 rounded-full bg-forest/10 inline-block mb-1">
          Preferences & Credentials
        </span>
        <h2 className="text-2xl font-bold text-charcoal font-heading">
          Account Settings
        </h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Update your public profile, account security, and notification settings
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-charcoal/10">
          <User className="w-5 h-5 text-forest" />
          <h3 className="text-base font-bold font-heading text-charcoal">
            Personal Information
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} noValidate className="space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
              Select Profile Picture
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {avatarOptions.map((av, idx) => (
                <img
                  key={idx}
                  src={av}
                  alt=""
                  onClick={() => setProfileField('avatar', av)}
                  className={`w-14 h-14 rounded-2xl object-cover cursor-pointer border-2 transition-all ${
                    profileForm.avatar === av
                      ? 'border-forest ring-3 ring-forest/30 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileField('name', e.target.value)}
                aria-invalid={!!profileErrors.name}
                className={`${inputClass(profileErrors.name)} font-semibold`}
              />
              <FieldError message={profileErrors.name} />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Professional Title / Track
              </label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileField('title', e.target.value)}
                placeholder="e.g. Visual Arts & UI Design Student"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Academic Department
              </label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileField('department', e.target.value)}
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                inputMode="tel"
                maxLength={20}
                value={profileForm.phone}
                onChange={(e) => setProfileField('phone', e.target.value)}
                placeholder="e.g. 0917 123 4567"
                aria-invalid={!!profileErrors.phone}
                className={inputClass(profileErrors.phone)}
              />
              <FieldError message={profileErrors.phone} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Biography & Learning Philosophy
            </label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileField('bio', e.target.value)}
              className="w-full bg-cream/40 border border-charcoal/15 rounded-xl p-3.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password & Security */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-charcoal/10">
          <Lock className="w-5 h-5 text-forest" />
          <h3 className="text-base font-bold font-heading text-charcoal">
            Password & Security
          </h3>
        </div>

        <form onSubmit={handleSavePassword} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Your current password"
                value={passForm.currentPassword}
                onChange={(e) => setPassField('currentPassword', e.target.value)}
                aria-invalid={!!passErrors.currentPassword}
                className={inputClass(passErrors.currentPassword)}
              />
              <FieldError message={passErrors.currentPassword} />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={passForm.newPassword}
                onChange={(e) => setPassField('newPassword', e.target.value)}
                aria-invalid={!!passErrors.newPassword}
                className={inputClass(passErrors.newPassword)}
              />
              <FieldError message={passErrors.newPassword} />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Repeat the new password"
                value={passForm.confirmPassword}
                onChange={(e) => setPassField('confirmPassword', e.target.value)}
                aria-invalid={!!passErrors.confirmPassword}
                className={inputClass(passErrors.confirmPassword)}
              />
              <FieldError message={passErrors.confirmPassword} />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-charcoal text-cream text-xs font-bold hover:bg-charcoal-light transition-all flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xs">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-charcoal/10">
          <Bell className="w-5 h-5 text-forest" />
          <h3 className="text-base font-bold font-heading text-charcoal">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/40 border border-charcoal/10 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-charcoal block">
                Assignment Grade Notifications
              </span>
              <span className="text-[11px] text-charcoal-muted">
                Receive instant alerts when teachers score your submissions and add critiques.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailGrades}
              onChange={(e) => setNotifications({ ...notifications, emailGrades: e.target.checked })}
              className="w-4 h-4 accent-forest"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/40 border border-charcoal/10 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-charcoal block">
                Official Campus Bulletins
              </span>
              <span className="text-[11px] text-charcoal-muted">
                Get notified of studio exhibition schedules and urgent administrative notices.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.announcements}
              onChange={(e) => setNotifications({ ...notifications, announcements: e.target.checked })}
              className="w-4 h-4 accent-forest"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-cream/40 border border-charcoal/10 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-charcoal block">
                Due Date & Submission Reminders
              </span>
              <span className="text-[11px] text-charcoal-muted">
                24-hour reminder before project deadlines and studio sessions.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifications.dueReminders}
              onChange={(e) => setNotifications({ ...notifications, dueReminders: e.target.checked })}
              className="w-4 h-4 accent-forest"
            />
          </label>
        </div>
      </div>
    </div>
  );
};