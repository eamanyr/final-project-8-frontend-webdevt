import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Info,
  BookOpen,
  FileCheck2,
  GraduationCap,
  TrendingUp,
  Bell,
  ShieldCheck,
  ChevronDown,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

/* ---------- Fill these in for the Contact section ---------- */
// Leave a value as '' to hide that button.
const CONTACT = {
  email: '', // e.g. 'yourgroup@gmail.com'
  github: '', // e.g. 'https://github.com/name-of-the-group/project-name'
};

const NAV_LINKS = [
  { href: '#about', label: 'About Us' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Courses and materials',
    text: 'Browse courses, enroll, and open the lessons and learning materials your teacher shares.',
  },
  {
    icon: FileCheck2,
    title: 'Assignments',
    text: 'See instructions and deadlines, then submit your work from one place.',
  },
  {
    icon: GraduationCap,
    title: 'Grades and feedback',
    text: 'Scores and teacher feedback appear as soon as your work is graded.',
  },
  {
    icon: TrendingUp,
    title: 'Progress tracking',
    text: 'Follow how far you are in each course as you complete lessons.',
  },
  {
    icon: Bell,
    title: 'Announcements',
    text: 'Get class and academy updates in your notification panel.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-based access',
    text: 'Students, teachers, and administrators each see only the tools they need.',
  },
];

const STEPS = [
  {
    title: 'Create an account',
    text: 'Sign up as a student with your name, email, and a password.',
  },
  {
    title: 'Wait for approval',
    text: 'An administrator reviews your registration before you can log in.',
  },
  {
    title: 'Log in and enroll',
    text: 'Once approved, log in, browse the courses, and enroll.',
  },
  {
    title: 'Learn and get graded',
    text: 'Open materials, submit assignments, and check your grades and feedback.',
  },
];

const FAQS = [
  {
    q: 'Who can use CacheUp?',
    a: 'CacheUp is for students, teachers, and administrators. Each role gets its own dashboard and tools.',
  },
  {
    q: 'Why can I not log in right after signing up?',
    a: 'New student accounts must be approved by an administrator first. You can log in once your account has been approved.',
  },
  {
    q: 'How do teachers and administrators get an account?',
    a: 'Sign up creates a student account. Teacher and administrator accounts are set up by an administrator.',
  },
  {
    q: 'When can I see my grades?',
    a: 'As soon as your teacher grades a submission, the score and feedback show up in My Grades.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. CacheUp runs in your web browser.',
  },
  {
    q: 'Can I switch to dark mode?',
    a: 'Yes. Use the moon or sun button at the top of the page. CacheUp remembers your choice.',
  },
];

const SectionHeading = ({ title, text }) => (
  <div className="text-center max-w-2xl mx-auto">
    <h2 className="font-heading font-extrabold text-forest text-3xl sm:text-4xl tracking-tight">
      {title}
    </h2>
    {text && (
      <p className="mt-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">{text}</p>
    )}
  </div>
);

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
            <div className="hidden lg:flex items-center">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <ThemeToggle />
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
          <SectionHeading
            title="About CacheUp"
            text="CacheUp is a web-based learning management system that makes schoolwork easier to manage. Teachers share lessons and assignments, students submit their work and check grades as soon as they are posted, and administrators look after accounts and access, all in one place."
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <SectionHeading
            title="Features"
            text="Everything you need for classes, from the first lesson to the final grade."
          />

          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading font-bold text-charcoal text-base">{title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-20 bg-white border-y border-charcoal/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <SectionHeading title="How It Works" text="Getting started takes four steps." />

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ title, text }, index) => (
              <li key={title}>
                <span className="w-10 h-10 rounded-full bg-forest text-cream font-heading font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-heading font-bold text-charcoal text-base">{title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {text}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center text-xs sm:text-sm text-charcoal-muted">
            Teachers log in with the account an administrator gives them, then create courses, post
            materials, and grade submissions.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <SectionHeading title="Frequently Asked Questions" />

          <div className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-charcoal [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    className="w-4 h-4 shrink-0 text-forest transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-charcoal-muted leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-white border-t border-charcoal/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <SectionHeading
            title="Contact Us"
            text="Have a question about CacheUp? Get in touch with the team behind it."
          />

          {(CONTACT.email || CONTACT.github) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {CONTACT.email && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>{CONTACT.email}</span>
                </a>
              )}
              {CONTACT.github && (
                <a
                  href={CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-charcoal/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>View the project</span>
                </a>
              )}
            </div>
          )}

          <p className="mt-8 text-xs sm:text-sm text-charcoal-muted">
            Already have an account? Use the Help center in the sidebar after you log in.
          </p>
          <p className="mt-4 text-xs sm:text-sm text-charcoal-muted">
            Built by Group 8, Section C3A: Ryna Mae Obcemane, Clyde Yuan Pesigan, and Stefanie
            Mariah Suyo.
          </p>
        </div>
      </section>

      <footer className="px-5 sm:px-8 py-8 text-center text-xs text-charcoal-muted">
        CacheUp • Learn • Grow
      </footer>
    </div>
  );
};