import React from 'react';
import { Check, Sparkles, Tag, ShieldCheck, Clock } from 'lucide-react';
import { PRICING_PLANS } from '../data/toolsData';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/70" id="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Prominent Intro Offer Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 shadow-2xs">
            <Tag className="w-4 h-4 text-blue-700 shrink-0" />
            <span>New users get their first month for just $5.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple Pricing. More Business Power.
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Transparent plans designed for solo founders, contractors, and growing small businesses. Cancel or switch anytime.
          </p>

          <div className="mt-3 text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Payment checkout launching soon • Reserve your $5 first month below</span>
          </div>
        </div>

        {/* 4 Pricing Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isBestValue = plan.bestValue;
            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  isBestValue
                    ? 'bg-white border-2 border-blue-600 shadow-xl ring-4 ring-blue-600/10'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* BEST VALUE Badge on Yearly Plan */}
                {isBestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>BEST VALUE</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    {plan.savings && (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                        {plan.savings}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {plan.period}
                    </span>
                  </div>

                  {/* Monthly equivalent */}
                  {plan.monthlyEquivalent && (
                    <div className="text-xs font-bold text-blue-600 mt-1">
                      Equivalent to {plan.monthlyEquivalent}
                    </div>
                  )}

                  {/* Introductory Offer Notice */}
                  <div className="mt-3 py-1.5 px-3 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>New users: First month $5</span>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      What is included:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-snug">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA: "Checkout coming soon." */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.name)}
                    id={`btn-choose-plan-${plan.id}`}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                      isBestValue
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Checkout coming soon.</span>
                  </button>
                  <div className="text-[11px] text-slate-400 text-center mt-2 font-medium">
                    Click to reserve your $5 intro offer
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No charges today. Free calculators remain 100% free with zero sign-up required.</span>
        </div>
      </div>
    </section>
  );
};
