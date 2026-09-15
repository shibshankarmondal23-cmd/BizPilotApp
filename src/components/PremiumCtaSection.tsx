import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PremiumCtaProps {
  onUnlockPremium: () => void;
}

export const PremiumCtaSection: React.FC<PremiumCtaProps> = ({ onUnlockPremium }) => {
  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden" id="premium-cta-banner">
      {/* Subtle modern geometric background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Special Introductory Offer</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Stop juggling multiple tools.
        </h2>

        {/* Text */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          BizPilot brings practical business tools together so you can spend less time on repetitive tasks and more time growing your work.
        </p>

        {/* Bullet benefits */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant PDF invoices &amp; proposals</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pre-built client email scripts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No recurring software lock-in</span>
          </div>
        </div>

        {/* Button */}
        <div className="mt-10">
          <button
            type="button"
            onClick={onUnlockPremium}
            id="cta-btn-unlock-premium-banner"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
          >
            <span>Unlock Premium — First Month $5</span>
            <ArrowRight className="w-5 h-5 text-blue-200" />
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Takes 30 seconds • Cancel anytime • Free tools require zero sign-up
        </p>
      </div>
    </section>
  );
};
