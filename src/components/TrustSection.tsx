import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      title: 'Zero Bloat, Maximum Speed',
      description: 'Open the tool, enter your numbers, and get instant answers in seconds. No mandatory registrations, onboarding tours, or complex software installations.',
      icon: Cpu,
      tag: 'Speed First'
    },
    {
      title: '100% In-Browser Privacy',
      description: 'Your calculations and image files are processed strictly inside your local web browser. We never store or upload your private client documents or photos to cloud servers.',
      icon: ShieldCheck,
      tag: 'Private & Secure'
    },
    {
      title: 'Designed for Solo Operations',
      description: 'Engineered specifically for how independent consultants, designers, developers, writers, and small firms actually price projects, invoice clients, and calculate margins.',
      icon: Sliders,
      tag: 'Independent First'
    },
    {
      title: 'Honest, Transparent Model',
      description: 'Core daily utility calculators remain free forever. When you need advanced document generation, unlock our premium suite without recurring contract lock-ins.',
      icon: Sparkles,
      tag: 'Fair Pricing'
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-t border-slate-200/70" id="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-3 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Honest Business Principles</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for freelancers, solopreneurs and small businesses.
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            BizPilot eliminates bloated enterprise dashboards so you can complete daily administrative tasks in seconds and focus on client work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {point.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {point.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
