import React, { useState } from 'react';
import { Check, Sparkles, Tag, ShieldCheck, Clock, ArrowRight, Shield, Zap, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRICING_PLANS, FREE_TIER_DETAILS, PREMIUM_KEY_BENEFITS } from '../data/toolsData';
import { Link, useRouter } from '../utils/router';
import { useSubscription } from '../context/SubscriptionContext';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const { navigate } = useRouter();
  const { status, tierLabel, statusDetails, subscription } = useSubscription();

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/70" id="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {/* Prominent $5 First-Month Promo Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs sm:text-sm font-extrabold mb-4 shadow-2xs">
            <Tag className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Special Promotional Deal: First month $5, then $9.99/month. Cancel anytime.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Clear, Transparent Pricing
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Start free with our 4 essential calculators, or upgrade to BizPilot Premium for client-ready invoices, quotes, proposals, and profit margin analysis.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free tools 100% free forever</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>First month $5 promo pricing</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Zero server document tracking</span>
            </span>
          </div>
        </div>

        {/* Current Subscription Status Bar */}
        <div className="mb-12 max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Your Current Status:</span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusDetails.badgeClass}`}>
              {status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
              {status === 'expired' ? <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> : null}
              <span>{tierLabel} • {statusDetails.label}</span>
            </span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            {status === 'active' && subscription.expiresAt
              ? `Active through ${new Date(subscription.expiresAt).toLocaleDateString()}`
              : status === 'cancelled' && subscription.expiresAt
              ? `Access retained through ${new Date(subscription.expiresAt).toLocaleDateString()}`
              : status === 'expired'
              ? 'Subscription expired — Renew below'
              : 'All 4 free tools are 100% free with no sign-up'}
          </div>
        </div>

        {/* 1. Free Plan vs Premium Plan Overview Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Free Plan Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {FREE_TIER_DETAILS.badge}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tier</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">{FREE_TIER_DETAILS.name}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {FREE_TIER_DETAILS.description}
              </p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono">{FREE_TIER_DETAILS.price}</span>
                <span className="text-sm font-semibold text-slate-500">/ forever</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1">
                {FREE_TIER_DETAILS.tagline}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Included 4 Free Tools:
                </div>
                {FREE_TIER_DETAILS.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/tools"
                className="w-full py-3.5 px-4 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>{FREE_TIER_DETAILS.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-[11px] text-slate-400 text-center mt-2">
                No sign-up or credit card required
              </div>
            </div>
          </div>

          {/* Premium Plan Highlight Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-7 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  First Month Promo: $5
                </span>
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Premium Suite</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">BizPilot Premium</h3>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                Advanced financial analysis, binding project proposals, estimates, and invoice generation. Built for solopreneurs who bill clients.
              </p>

              {/* Promotional Price Highlight Banner */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Introductory Offer</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">$5.00</span>
                    <span className="text-sm text-slate-300 font-medium">first month</span>
                  </div>
                </div>
                <div className="text-xs sm:text-right text-slate-300">
                  <span className="block font-semibold">Then $9.99 / month</span>
                  <span className="text-emerald-400 font-bold">Cancel anytime • No lock-in</span>
                </div>
              </div>

              {/* Key Benefits List */}
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Premium Capabilities:
                </div>
                {PREMIUM_KEY_BENEFITS.slice(0, 5).map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onSelectPlan('1 Month ($5 Promo)')}
                  id="btn-claim-5-promo-top"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg hover:shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Claim $5 First Month Deal</span>
                </button>
                <a
                  href="#pricing-cards-grid"
                  className="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors text-center"
                >
                  Compare All Options
                </a>
              </div>
              <div className="text-[11px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant activation • Secured by Cashfree Payments • Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. All 4 Premium Plan Options (1-Month Promo, 3-Month, 6-Month, 1-Year) */}
        <div id="pricing-cards-grid" className="pt-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Choose Your Subscription Term
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              All plans include full access to the complete Premium tool suite and client-ready document exports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => {
              const isBestValue = plan.bestValue;
              const isPopular = plan.popular;
              const isPromoMonth = plan.id === 'monthly-promo';

              return (
                <div
                  key={plan.id}
                  id={`pricing-card-${plan.id}`}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                    isPopular
                      ? 'bg-white border-2 border-emerald-500 shadow-xl ring-4 ring-emerald-500/10'
                      : isBestValue
                      ? 'bg-white border-2 border-blue-600 shadow-xl ring-4 ring-blue-600/10'
                      : isPromoMonth
                      ? 'bg-white border-2 border-amber-400 shadow-lg'
                      : 'bg-white border border-slate-200/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Badges */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-emerald-200" />
                      <span>MOST POPULAR • $24.99</span>
                    </div>
                  )}

                  {isBestValue && !isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>BEST VALUE • 12 MONTHS</span>
                    </div>
                  )}

                  {isPromoMonth && !isBestValue && !isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <Tag className="w-3 h-3" />
                      <span>FIRST MONTH $5 PROMO</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                      {plan.savings && (
                        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                          {plan.savings}
                        </span>
                      )}
                    </div>

                    {/* Price Display */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {plan.period}
                      </span>
                    </div>

                    {/* Additional price context */}
                    {isPromoMonth ? (
                      <div className="text-xs font-bold text-amber-700 mt-1">
                        Then $9.99/month • Cancel anytime
                      </div>
                    ) : plan.monthlyEquivalent ? (
                      <div className="text-xs font-bold text-blue-600 mt-1">
                        Equivalent to {plan.monthlyEquivalent}
                      </div>
                    ) : null}

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

                  {/* Plan Action CTA */}
                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan.name)}
                      id={`btn-choose-plan-${plan.id}`}
                      className={`w-full min-h-[44px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : isBestValue
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                          : isPromoMonth
                          ? 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>
                        {isPromoMonth ? 'Claim $5 First Month' : `Select ${plan.duration}`}
                      </span>
                    </button>
                    <div className="text-[11px] text-slate-500 text-center mt-2 font-medium flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant access • Secured by Cashfree</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Comprehensive Key Premium Benefits Grid */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Quality for Freelancers</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Why Upgrade to BizPilot Premium?
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Engineered specifically to save freelancers and contractors billable hours every month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Profit Margin &amp; Pricing Multipliers</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Determine sustainable margins, gross profit targets, and markup percentages before sending proposals to clients.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Professional Invoices &amp; Estimates</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Generate clean, branded PDF invoices and price quotes in seconds with itemized line items, sales tax, and terms.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">100% In-Browser Document Privacy</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your client details, hourly rates, and confidential estimates stay strictly in your browser without cloud storage risks.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Secured by Cashfree Payments. Instant activation upon checkout. All 4 core calculators remain free forever.</span>
        </div>
      </div>
    </section>
  );
};
