import React from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface FreeVsPremiumProps {
  onExploreFree: () => void;
  onOpenPremium: () => void;
}

export const FreeVsPremiumSection: React.FC<FreeVsPremiumProps> = ({
  onExploreFree,
  onOpenPremium,
}) => {
  const comparisonFeatures = [
    { name: 'Percentage Calculator (3 Modes & Tax/Tips)', free: true, premium: true },
    { name: 'Profit Margin & Markup Calculator', free: true, premium: true },
    { name: 'Hourly Rate & Overhead Calculator', free: true, premium: true },
    { name: 'Real-time Word & Character Counter', free: true, premium: true },
    { name: 'Local In-Browser Image Resizer', free: true, premium: true },
    { name: 'Zero Sign-Up Required for Core Tools', free: true, premium: true },
    { name: '100% In-Browser Privacy (Zero Cloud Uploads)', free: true, premium: true },
    { name: 'Professional Invoice Generator (PDF Export)', free: false, premium: true },
    { name: 'Binding Project Quote & Estimate Generator', free: false, premium: true },
    { name: 'Client Proposal & Deliverables Generator', free: false, premium: true },
    { name: 'Client Email Script & Response Templates', free: false, premium: true },
    { name: 'Social Media Marketing Caption Generator', free: false, premium: true },
    { name: 'Future Premium Tools & Advanced Features', free: false, premium: true },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200/70" id="comparison-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3 border border-slate-200">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Clear &amp; Transparent Differences</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Free vs. Premium
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Start with our 5 core tools for free. Upgrade to Premium whenever you need advanced business document generation and client communication scripts.
          </p>
        </div>

        {/* Side-by-side Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* FREE Plan Card */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
                  FREE
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">$0</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">5 Core Tools</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Essential calculators and productivity utilities designed for fast everyday business math with zero login or setup.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200/80 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Included Free Tools:
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Percentage Calculator (Amounts, changes &amp; sales tax)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profit Margin Calculator (Gross profit &amp; markup %)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hourly Rate Calculator (Billable targets &amp; overhead)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Word Counter (Reading/speaking speed &amp; character count)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Image Resizer (100% local in-browser canvas processing)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <button
                type="button"
                onClick={onExploreFree}
                id="comparison-btn-explore-free"
                className="w-full min-h-[44px] py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Use Free Tools</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>

          {/* PREMIUM Plan Card */}
          <div className="relative bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500 shadow-xl flex flex-col justify-between overflow-hidden">
            {/* Ambient blur glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>PREMIUM</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-300 font-mono">First Month $5</span>
                  <div className="text-[11px] text-slate-400 font-medium">Then $9.99/mo or $59.99/yr</div>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white">Advanced Business Tools</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Advanced document creators, legal scopes, and client communication workflows + priority access to all future premium features.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Included Premium Features:
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>All 5 Free Tools with unlimited calculations</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Invoice Generator (PDF invoices with tax &amp; payment terms)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Quote Generator (Professional estimates &amp; milestone deposits)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Proposal Generator (Comprehensive client project scopes)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Client Email Generator (Follow-ups, scope creep &amp; payments)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Social Media Caption Generator (Marketing hooks &amp; angles)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Priority access to future premium tool updates</span>
                </div>
              </div>
            </div>

            <div className="relative mt-8 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={onOpenPremium}
                id="comparison-btn-unlock-premium"
                className="w-full min-h-[44px] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Unlock Premium — First Month $5</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature-by-feature Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <th className="py-4 px-4 sm:px-6 font-bold">Feature &amp; Capability</th>
                <th className="py-4 px-4 sm:px-6 font-bold text-center w-36 sm:w-48 bg-slate-100/60">
                  FREE (5 Tools)
                </th>
                <th className="py-4 px-4 sm:px-6 font-bold text-center w-36 sm:w-48 bg-blue-50/70 text-blue-900">
                  PREMIUM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonFeatures.map((feat) => (
                <tr key={feat.name} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-medium text-slate-700">
                    {feat.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-center bg-slate-100/30">
                    {feat.free ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-center bg-blue-50/30">
                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Core free tools have zero time limits, zero quotas, and require no account.</span>
        </div>
      </div>
    </section>
  );
};
