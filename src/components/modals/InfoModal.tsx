import React, { useEffect } from 'react';
import { X, Shield, FileText, Compass, Mail, Info, AlertCircle } from 'lucide-react';
import { InfoModalType } from '../../types';

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About BizPilot',
          subtitle: 'Your Business, Simplified.',
          icon: Compass,
          body: (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>BizPilot</strong> is an all-in-one business productivity toolbox built specifically for US freelancers, solopreneurs, creators, consultants, and small-business owners.
              </p>
              <p>
                Too many independent professionals lose hours every week switching between clunky spreadsheets, subscription apps, and complicated accounting systems just to calculate a simple profit margin, determine an hourly rate, or format a clean document.
              </p>
              <p>
                Our mission is simple: provide clean, lightweight, client-side business utilities that help you calculate, create, communicate, and grow without subscription traps or intrusive onboarding.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-1">Our Core Commitments:</h5>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Client-side privacy: calculations and image processing stay right in your browser.</li>
                  <li>No fake pricing or hidden fees.</li>
                  <li>Free tools stay free forever.</li>
                </ul>
              </div>
            </div>
          ),
        };

      case 'contact':
        return {
          title: 'Contact BizPilot Team',
          subtitle: 'We welcome feedback from independent operators',
          icon: Mail,
          body: (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Have questions about our tools, suggestions for a new calculator, or inquiries regarding our upcoming BizPilot Premium release? We’d love to hear from you.
              </p>
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="text-xs font-semibold text-blue-900">General Support &amp; Feedback:</div>
                <div className="text-sm font-mono font-bold text-blue-700">support@bizpilot.io</div>
                <div className="text-xs text-slate-500">Typical response time: Within 24 business hours (Monday–Friday).</div>
              </div>
              <p className="text-xs text-slate-500">
                BizPilot Headquarters: Wilmington, DE • Serving freelancers and solopreneurs nationwide.
              </p>
            </div>
          ),
        };

      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Last updated: January 2026',
          icon: Shield,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
              <h5 className="font-bold text-slate-900">1. Client-Side Processing</h5>
              <p>
                BizPilot is designed as a client-side web application. All calculations (Percentage, Profit Margin, Hourly Rate, and Word Count) and image processing in the Image Resizer are executed directly inside your web browser. We do NOT transmit or store your uploaded photos or numeric inputs on external servers.
              </p>
              <h5 className="font-bold text-slate-900">2. Information We Do Not Collect</h5>
              <p>
                Because BizPilot does not currently require user registration, we do not collect personal profiles, social security numbers, bank details, or client records.
              </p>
              <h5 className="font-bold text-slate-900">3. Local Storage</h5>
              <p>
                We may use browser LocalStorage strictly to remember your preferences (such as notification dismissals) on your own device.
              </p>
              <h5 className="font-bold text-slate-900">4. Third-Party Analytics</h5>
              <p>
                We may use standard, privacy-preserving performance telemetry to ensure the web application runs without errors and renders properly on mobile devices.
              </p>
            </div>
          ),
        };

      case 'terms':
        return {
          title: 'Terms of Use',
          subtitle: 'Standard terms for BizPilot utilities',
          icon: FileText,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
              <h5 className="font-bold text-slate-900">1. Acceptance of Terms</h5>
              <p>
                By accessing or using BizPilot, you agree to comply with these terms of use. The tools are intended for legitimate commercial, professional, and personal productivity purposes.
              </p>
              <h5 className="font-bold text-slate-900">2. Intended Use</h5>
              <p>
                BizPilot provides calculators and productivity utilities. Users are responsible for verifying their own contract details, tax compliance, and business records before submitting bids or contracts to third parties.
              </p>
              <h5 className="font-bold text-slate-900">3. Intellectual Property</h5>
              <p>
                The BizPilot brand, logos, and UI layout are protected intellectual property. Content generated by you (such as your own invoices or word documents) belongs entirely to you.
              </p>
            </div>
          ),
        };

      case 'disclaimer':
        return {
          title: 'Financial & Legal Disclaimer',
          subtitle: 'Informational utility disclaimer',
          icon: AlertCircle,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                BizPilot calculators (including the Hourly Rate Calculator, Profit Margin Calculator, and Percentage Calculator) provide mathematical estimations based entirely on the numeric values entered by the user.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <strong>Important Notice:</strong> BizPilot is a calculation software tool and does not provide certified financial planning, legal counsel, or certified public accounting (CPA) tax advice.
              </div>
              <p>
                Actual business profitability, tax obligations, self-employment taxes, and legal contract terms vary significantly across jurisdictions, state laws, and individual business structures (such as LLC, S-Corp, Sole Proprietorship). Always consult a certified professional regarding formal tax filings.
              </p>
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;
  const Icon = content.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      id="info-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{content.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{content.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">{content.body}</div>

        {/* Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
