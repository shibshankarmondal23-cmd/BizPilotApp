import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/toolsData';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First one open by default
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200/70" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Straightforward answers about BizPilot tools, free access, privacy, and plans.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                  isOpen
                    ? 'border-blue-200 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional help note */}
        <div className="mt-10 text-center text-xs text-slate-400">
          Have another question or feature request? We welcome feedback from independent operators.
        </div>
      </div>
    </section>
  );
};
