import React, { useState } from 'react';
import { useLMS } from '../../context/LMSContext';
import { X, HelpCircle, Send, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, Phone, Mail } from 'lucide-react';

export const HelpModal = () => {
  const { helpModalOpen, setHelpModalOpen, addToast } = useLMS();
  const [activeFaq, setActiveFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!helpModalOpen) return null;

  const faqs = [
    {
      q: 'How do I submit an assignment or studio project?',
      a: 'Navigate to "Assignments" in the left menu, click "Submit Work" on your active assignment, provide your submission notes or repository URL, and confirm submission. You will see celebratory confetti and an instant confirmation timestamp!'
    },
    {
      q: 'How do teachers review and grade student work?',
      a: 'Instructors can access "Submission Review" from the sidebar. You can inspect submissions, view attachments or external links, enter scores out of maximum points, provide qualitative feedback, and save the grade.'
    },
    {
      q: 'How does student registration approval work?',
      a: 'When new students register, their account enters "Pending Approval" status. Administrators can review their application details under "Registration Approvals" and approve or reject with one click.'
    },
    {
      q: 'Can I deploy this academy platform online?',
      a: 'Yes! This web application is built with Vite, React 19, and Tailwind CSS v4, optimized for seamless web hosting and cloud deployment.'
    }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      addToast('Please fill in both subject and message.', 'warning');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      addToast('Support inquiry dispatched to Academy Administration!', 'success');
      setHelpModalOpen(false);
      setSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-charcoal/15 shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => setHelpModalOpen(false)}
          className="absolute right-5 top-5 p-2 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal">
              CacheUp Help Center
            </h3>
            <p className="text-xs text-charcoal-muted">
              Frequently asked questions & 24/7 student/teacher assistance
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
            Common Questions
          </h4>
          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-charcoal/10 overflow-hidden transition-all bg-cream/40"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-charcoal hover:bg-cream transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-forest shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-charcoal-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-xs text-charcoal-muted leading-relaxed border-t border-charcoal/5 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Inquiry Form */}
        <div className="pt-4 border-t border-charcoal/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-3">
            Send Support a Message
          </h4>

          {submitted ? (
            <div className="p-4 rounded-xl bg-forest/10 border border-forest/20 text-center">
              <CheckCircle2 className="w-8 h-8 text-forest mx-auto mb-2" />
              <p className="text-sm font-bold text-forest">Message Dispatched!</p>
              <p className="text-xs text-charcoal-muted mt-1">
                A member of our academic support team will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g., Assignment upload issue or grade inquiry"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/15 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Message Details
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={3}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/15 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-forest" /> support@cacheup.edu
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest text-cream text-xs font-bold hover:bg-forest-light transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
