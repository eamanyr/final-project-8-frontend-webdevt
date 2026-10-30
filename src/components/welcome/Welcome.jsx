import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Info, Zap, Lock, FolderOpen } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

const POINTS = [
  {
    icon: Zap,
    title: 'Instant results',
    text: 'See your scores and feedback as soon as your teacher grades your work.',
  },
  {
    icon: Lock,
    title: 'Role-based access',
    text: 'Students, teachers, and administrators each see only what they need.',
  },
  {
    icon: FolderOpen,
    title: 'Everything in one place',
    text: 'Courses, materials, assignments, and announcements live together.',
  },
];

export const Welcome = () => {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-body">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl">
            <span className="w-9 h-9 rounded-xl bg-forest text-gold flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 fill-gold" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-forest font-heading">
              Cache<span className="text-gold">Up</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#about"
              className="hidden sm:inline-block px-3 py-2 rounded-lg text-xs font-bold text-charcoal-muted hover:text-charcoal transition-colors"
            >
              About Us
            </a>
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-charcoal/5 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 sm:px-8 py-16 sm:py-28 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-charcoal-muted">Learn • Grow • CacheUp</p>

          <h1 className="mt-4 font-heading font-extrabold text-forest text-4xl sm:text-6xl tracking-tight">
            Welcome to CacheUp!
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-charcoal-muted leading-relaxed">
            Your learning journey starts here.
            <br />
            Log in or create an account to continue.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-72 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-forest text-cream text-sm font-bold hover:bg-forest-light transition-colors shadow-md shadow-forest/20"
            >
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-72 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-forest text-forest text-sm font-bold hover:bg-forest hover:text-cream transition-colors"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-xs text-charcoal-muted">
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Student accounts require administrator approval.</span>
          </p>

          <div className="mt-8">
            <a
              href="#about"
              className="text-xs font-bold text-forest underline underline-offset-4 hover:text-gold-dark transition-colors"
            >
              Learn more about CacheUp
            </a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="scroll-mt-20 bg-white border-y border-charcoal/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-extrabold text-forest text-3xl sm:text-4xl tracking-tight">
              About CacheUp
            </h2>
            <p className="mt-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">
              CacheUp is a web-based learning management system that makes schoolwork easier to
              manage. Teachers share lessons and assignments, students submit their work and check
              grades as soon as they are posted, and administrators look after accounts and access,
              all in one place.
            </p>
          </div>

          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="text-center">
                <span className="w-11 h-11 rounded-xl bg-forest/10 text-forest flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading font-bold text-charcoal text-base">{title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-charcoal-muted leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="px-5 sm:px-8 py-8 text-center text-xs text-charcoal-muted">
        CacheUp • Learn • Grow
      </footer>
    </div>
  );
};