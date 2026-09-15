import React, { useState, useEffect } from 'react';
import {
  Compass,
  ChevronRight,
  Shield,
  FileText,
  AlertTriangle,
  Mail,
  Send,
  CheckCircle2,
  Lock,
  ServerOff,
  UserCheck
} from 'lucide-react';
import { updateMetaTags, getPageSchema } from '../utils/seo';
import { Link } from '../utils/router';

export type LegalPageType = 'privacy' | 'terms' | 'disclaimer' | 'contact' | 'about';

interface LegalPageProps {
  type: LegalPageType;
  onNotify?: (msg: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNotify }) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Feedback or Suggestion');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Configure SEO metadata based on page type
  useEffect(() => {
    let title = 'BizPilot';
    let description = '';
    let canonicalPath = '/';

    switch (type) {
      case 'privacy':
        title = 'Privacy Policy — In-Browser Data Processing | BizPilot';
        description = 'Read the BizPilot Privacy Policy. Learn how our calculators and document generators process data 100% locally in your browser with zero tracking.';
        canonicalPath = '/privacy';
        break;
      case 'terms':
        title = 'Terms of Use — Service Terms & Guidelines | BizPilot';
        description = 'Review the terms of use for BizPilot free and premium business calculation and document generation tools.';
        canonicalPath = '/terms';
        break;
      case 'disclaimer':
        title = 'Disclaimer — Financial & Legal Information Notice | BizPilot';
        description = 'Important legal and financial disclaimer regarding business calculations, estimates, and document templates provided on BizPilot.';
        canonicalPath = '/disclaimer';
        break;
      case 'contact':
        title = 'Contact BizPilot — Get in Touch & Feedback | BizPilot';
        description = 'Have questions, feedback, or a feature request for BizPilot? Contact our support team directly.';
        canonicalPath = '/contact';
        break;
      case 'about':
        title = 'About BizPilot — Lightweight Business Utilities | BizPilot';
        description = 'Learn about BizPilot mission to provide fast, privacy-focused business calculators and client document generators for independent operators.';
        canonicalPath = '/about';
        break;
    }

    updateMetaTags({
      title,
      description,
      canonicalPath,
      schema: getPageSchema(title, canonicalPath, description)
    });
  }, [type]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onNotify) {
      onNotify('Your message was received! Thank you for contacting BizPilot.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-slate-900 font-semibold capitalize truncate" aria-current="page">
              {type === 'terms' ? 'Terms of Use' : type === 'privacy' ? 'Privacy Policy' : type}
            </li>
          </ol>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 md:p-12">
          {/* Privacy Policy */}
          {type === 'privacy' && (
            <article className="prose prose-slate max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-200/60">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Privacy-First Philosophy</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400 mb-8">Last Updated: September 15, 2026</p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-8 leading-relaxed">
                <strong>Editable Notice:</strong> This privacy document reflects BizPilot's current technical architecture. Update the contact email (<code className="text-blue-600">privacy@example.com</code>) with your verified operating address when deploying for your legal jurisdiction.
              </div>

              <section className="space-y-6 text-sm text-slate-600 leading-relaxed">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">1. In-Browser Client-Side Processing</h2>
                  <p>
                    BizPilot is built on a client-side architecture. When you enter calculations into our Percentage Calculator, Profit Margin Calculator, Hourly Rate Calculator, or input client invoices and proposals, all mathematical computation and PDF compilation happens 100% locally in your device's web browser memory.
                  </p>
                  <p className="mt-2">
                    Your financial figures, business names, customer names, hourly rates, project scopes, and uploaded photos are <strong>never uploaded to or stored on an external server</strong>.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Do Not Collect</h2>
                  <ul className="list-disc pl-5 space-y-1.5 mt-2">
                    <li>We do not collect or store client invoice or proposal data.</li>
                    <li>We do not store uploaded images (all resizing and compression runs through the browser HTML5 Canvas API).</li>
                    <li>We do not sell, rent, or monetize personal or business calculation data.</li>
                    <li>We do not employ invasive cross-site tracking cookies.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">3. Local Storage</h2>
                  <p>
                    BizPilot may use standard web browser local storage (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">localStorage</code>) strictly to preserve user interface preferences (such as dismissed notices or active view settings). You can clear this data at any time through your browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">4. Third-Party Hosting &amp; Infrastructure</h2>
                  <p>
                    Standard static web requests are routed through secure cloud infrastructure (such as Cloud Run or modern CDN edge networks). These servers log standard technical network headers (such as IP address and user-agent string) solely for DDoS mitigation, load balancing, and network security.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">5. Privacy Contact &amp; Inquiries</h2>
                  <p>
                    If you have questions regarding this Privacy Policy, please reach out via our contact page or email us at:
                  </p>
                  <p className="mt-2 font-mono text-xs bg-slate-100 p-3 rounded-lg border border-slate-200 inline-block">
                    privacy@example.com [Placeholder — replace with your operating email]
                  </p>
                </div>
              </section>
            </article>
          )}

          {/* Terms of Use */}
          {type === 'terms' && (
            <article className="prose prose-slate max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-200/60">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Service Agreement</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Terms of Use
              </h1>
              <p className="text-xs text-slate-400 mb-8">Last Updated: September 15, 2026</p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-8 leading-relaxed">
                <strong>Notice:</strong> These terms govern the use of BizPilot tools and document generators. Please adapt specific terms and governing jurisdiction prior to commercial deployment.
              </div>

              <section className="space-y-6 text-sm text-slate-600 leading-relaxed">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using BizPilot ("the Service"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should discontinue use of the tools.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">2. Informational &amp; Estimation Utility Only</h2>
                  <p>
                    BizPilot provides business calculators, productivity utilities, and PDF generation templates for general planning and informational purposes only. The outputs of these tools do not constitute certified tax, accounting, financial, or legal advice.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">3. User Responsibility for Generated Documents</h2>
                  <p>
                    You are solely responsible for verifying the mathematical accuracy, legal compliance, tax liabilities, and terms included on any invoice, price quote, or proposal document generated using BizPilot before delivering it to third parties or clients.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">4. Intellectual Property &amp; User Content</h2>
                  <p>
                    All branding, interface designs, code, and calculation algorithms of BizPilot belong to the operators of BizPilot. However, all text, client names, line items, and documents you produce using the tools remain 100% your own property.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">5. Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by applicable law, BizPilot and its contributors shall not be liable for any indirect, incidental, or consequential damages resulting from calculation discrepancies, lost business agreements, or reliance on tool outputs.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">6. Contact Information</h2>
                  <p className="mt-2 font-mono text-xs bg-slate-100 p-3 rounded-lg border border-slate-200 inline-block">
                    legal@example.com [Placeholder — replace with your operating email]
                  </p>
                </div>
              </section>
            </article>
          )}

          {/* Disclaimer */}
          {type === 'disclaimer' && (
            <article className="prose prose-slate max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-4 border border-amber-200/60">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Notice &amp; Disclaimer</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Financial &amp; Legal Disclaimer
              </h1>
              <p className="text-xs text-slate-400 mb-8">Last Updated: September 15, 2026</p>

              <section className="space-y-6 text-sm text-slate-600 leading-relaxed">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">No Professional Advice</h2>
                  <p>
                    The tools, calculators, templates, articles, and formulas provided by BizPilot are intended strictly for educational, informational, and operational convenience. BizPilot is not a certified public accounting firm (CPA), financial advisory firm, or legal practice.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Tax and Regulatory Variation</h2>
                  <p>
                    Tax laws, sales tax obligations, VAT thresholds, self-employment levies, and invoicing regulations vary substantially by country, state, and municipality. Always consult with a qualified accountant or certified legal advisor before finalizing business tax filings or binding contracts.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Formula Accuracy &amp; Client Agreement</h2>
                  <p>
                    While our calculation logic adheres to standard business mathematical formulas (gross margins, markup ratios, percentage differentials, and compound totals), users must independently confirm numerical results before sending commercial invoices or binding commitments to clients.
                  </p>
                </div>
              </section>
            </article>
          )}

          {/* About Page */}
          {type === 'about' && (
            <article className="prose prose-slate max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-200/60">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Our Mission</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                About BizPilot
              </h1>
              <p className="text-base text-slate-600 mb-8">
                “Your Business, Simplified.” Fast, lightweight, and private productivity utilities built for modern freelancers, solopreneurs, and small business operators.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Lock className="w-5 h-5 text-blue-600 mb-2" />
                  <h2 className="text-sm font-bold text-slate-900">Zero Server Tracking</h2>
                  <p className="text-xs text-slate-500 mt-1">Calculations and document data stay strictly in your local browser.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <ServerOff className="w-5 h-5 text-emerald-600 mb-2" />
                  <h2 className="text-sm font-bold text-slate-900">No Forced Sign-Ups</h2>
                  <p className="text-xs text-slate-500 mt-1">Immediate access to calculations without password walls or paywalls.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <UserCheck className="w-5 h-5 text-amber-600 mb-2" />
                  <h2 className="text-sm font-bold text-slate-900">Built for Independence</h2>
                  <p className="text-xs text-slate-500 mt-1">Tailored for independent creators, consultants, and service providers.</p>
                </div>
              </div>

              <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <h2 className="text-lg font-bold text-slate-900">Why We Built BizPilot</h2>
                <p>
                  Most business software has become bloated with mandatory subscriptions, complex setup workflows, and invasive tracking cookies. Independent operators often just need a reliable tool to calculate a freelance hourly rate, determine project profit margins, resize a logo, or generate a professional PDF invoice for a client.
                </p>
                <p>
                  BizPilot delivers focused, standalone tools that work instantly without requiring credit card registration or software downloads.
                </p>
              </section>
            </article>
          )}

          {/* Contact Page */}
          {type === 'contact' && (
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-200/60">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Get In Touch</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                Contact BizPilot
              </h1>
              <p className="text-base text-slate-600 mb-8">
                Have questions, feature suggestions, or feedback about our tools? Send us a message below.
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-900">Thank you for your message!</h2>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    We appreciate your feedback and suggestions. Our team reviews all incoming communications.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setContactMessage('');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="contact-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white outline-none transition-all"
                    >
                      <option value="Feedback or Suggestion">Feedback or Tool Suggestion</option>
                      <option value="Bug Report">Report a Calculation or Tool Bug</option>
                      <option value="Commercial Inquiry">Business / Commercial Inquiry</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Share your thoughts or describe the feature you would like to see..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white outline-none transition-all resize-y"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      Editable placeholder contact: <code className="text-slate-600">contact@example.com</code>
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
