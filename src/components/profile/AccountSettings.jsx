import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import {
  Settings,
  Lock,
  User,
  Bell,
  Save,
  CheckCircle2,
  Shield,
  Smartphone
} from 'lucide-react';

export const AccountSettings = () => {
  const { currentUser, updateProfile, addToast } = useLMS();

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    title: currentUser?.title || '',
    department: currentUser?.department || '',
    bio: currentUser?.bio || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || '',
  });

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (passForm.newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    updateProfile({ password: passForm.newPassword });
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    addToast('Security password successfully changed!', 'success');
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

        <form onSubmit={handleSaveProfile} className="space-y-5">
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
                  onClick={() => setProfileForm({ ...profileForm, avatar: av })}
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
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Professional Title / Track
              </label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                placeholder="e.g. Visual Arts & UI Design Student"
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
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
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
              Biography & Learning Philosophy
            </label>
            <textarea
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
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

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.currentPassword}
                onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.newPassword}
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passForm.confirmPassword}
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
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
