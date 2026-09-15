import React, { useState, useEffect } from 'react';
import { X, Clock, Mail, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
  onNotify?: (msg: string) => void;
}

export const CheckoutComingSoonModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlanName,
  onNotify,
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      if (onNotify) onNotify('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
    if (onNotify) onNotify('You have been added to the $5 early access priority list!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      id="checkout-coming-soon-modal"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Clock className="w-7 h-7 text-blue-600" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>First Month $5 Deal Locked In</span>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Premium checkout will be available soon.
          </h3>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {selectedPlanName ? (
              <>
                You selected the <strong>{selectedPlanName}</strong> plan.
              </>
            ) : null}{' '}
            We are currently finalizing our secure merchant gateway and compliance. We do not accept payments until the system is 100% certified.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="text-left">
                <label htmlFor="waitlist-email-input" className="block text-xs font-semibold text-slate-600 mb-1">
                  Get notified when checkout opens &amp; claim your $5 month:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="waitlist-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email address"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-notify-checkout"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Notify Me &amp; Reserve $5 Offer
              </button>
            </form>
          ) : (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">You are on the priority list!</span>
                <span className="text-xs text-emerald-800">
                  We will email <strong>{email}</strong> the minute checkout goes live with your promotional code.
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free tools remain 100% accessible right now.</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Close &amp; Use Free Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
