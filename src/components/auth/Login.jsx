import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login, setActiveTab } = useLMS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Decorative Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 fill-gold" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-forest font-heading">
            Cache<span className="text-gold">Up</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-heading">
          Welcome back!
        </h2>
        <p className="text-sm text-charcoal-muted mt-1 max-w-sm mx-auto">
          Continue learning at your own pace.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-charcoal/10 shadow-xl shadow-forest/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@cacheup.edu"
                required
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo password is: password123')}
                className="text-[11px] text-forest font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-cream/40 border border-charcoal/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all shadow-md shadow-forest/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to CacheUp'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register CTA */}
        <div className="mt-6 text-center text-xs text-charcoal-muted">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="font-bold text-forest hover:text-gold transition-colors underline cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};
