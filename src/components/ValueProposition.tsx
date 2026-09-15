import React from 'react';
import { FileEdit, Calculator, MessageSquare, TrendingUp, ArrowUpRight } from 'lucide-react';

interface ValuePropProps {
  onSelectCategory?: (category: 'Business' | 'Calculators' | 'Productivity' | 'Marketing') => void;
}

export const ValueProposition: React.FC<ValuePropProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'create-card',
      title: 'Create',
      description: 'Create professional business documents and client materials.',
      icon: FileEdit,
      accentColor: 'text-blue-600 bg-blue-50 border-blue-100',
      category: 'Business' as const,
      tag: 'Invoices & Proposals',
    },
    {
      id: 'calculate-card',
      title: 'Calculate',
      description: 'Calculate pricing, profit, margins and business numbers.',
      icon: Calculator,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      category: 'Calculators' as const,
      tag: 'Rates & Profitability',
    },
    {
      id: 'communicate-card',
      title: 'Communicate',
      description: 'Create professional client emails and business messages.',
      icon: MessageSquare,
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      category: 'Marketing' as const,
      tag: 'Client Email Scripts',
    },
    {
      id: 'grow-card',
      title: 'Grow',
      description: 'Create marketing content and ideas faster.',
      icon: TrendingUp,
      accentColor: 'text-amber-600 bg-amber-50 border-amber-100',
      category: 'Marketing' as const,
      tag: 'Social Captions & Reach',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-y border-slate-200/70" id="value-prop-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for the Speed of Independent Work
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Four pillars to simplify your day-to-day operations and help your business prosper.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                onClick={() => onSelectCategory && onSelectCategory(card.category)}
                className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.accentColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>Explore {card.title} tools</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
