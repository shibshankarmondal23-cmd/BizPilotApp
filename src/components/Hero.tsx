import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Lock, CheckCircle2, Calculator, Receipt, TrendingUp } from 'lucide-react';

interface HeroProps {
  onExploreFree: () => void;
  onUnlockPremium: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreFree, onUnlockPremium }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-slate-100" id="hero-section">
      {/* Subtle modern geometric background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-12 left-1/3 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl"></div>
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-slate-100/80 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
          <span className="tracking-wide">BizPilot</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium">Your Business, Simplified.</span>
        </div>

        {/* Headline - Single Clear Homepage H1 */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Free Business Tools for{' '}
          <span className="text-blue-600 inline-block">
            Freelancers &amp; Small Businesses
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Practical calculators, productivity tools, invoice, quote and proposal generators for freelancers, solopreneurs and small businesses.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={onExploreFree}
            id="hero-cta-explore-free"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-md hover:shadow-blue-600/20 transition-all cursor-pointer"
          >
            <span>Explore Free Tools</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </button>

          <button
            type="button"
            onClick={onUnlockPremium}
            id="hero-cta-unlock-premium"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300 text-base font-bold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Unlock Premium — First Month $5</span>
          </button>
        </div>

        {/* Trust & Value Message */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No complicated setup. Start with free tools.</span>
        </div>

        {/* Interactive App Preview Showcase Box */}
        <div className="mt-12 max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-slate-900">BizPilot Toolbox Workspace</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-emerald-700 font-bold text-[11px]">
                5 Free Tools Active
              </span>
              <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md text-blue-700 font-bold text-[11px]">
                Intro: First Month $5
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Hourly Rate Model</span>
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg font-black text-slate-900">$85.00 / hr</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Based on $85k goal &amp; overhead</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Profit Margin</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-black text-slate-900">40.0% Margin</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Healthy gross revenue ratio</div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Privacy Standard</span>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-lg font-black text-slate-900">100% Local</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Zero server uploads or tracking</div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Fast Calculations</span>
              <span className="text-slate-500">No account required</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">100% Client-Side</span>
              <span className="text-slate-500">Safe in your browser</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">For Freelancers</span>
              <span className="text-slate-500">Solos &amp; small business</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">5 Free Forever Tools</span>
              <span className="text-slate-500">Instant use anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
