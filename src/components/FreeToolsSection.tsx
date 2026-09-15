import React, { useEffect } from 'react';
import { Percent, Clock, FileText, Image as ImageIcon, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolItem } from '../types';
import { Link } from '../utils/router';
import { PercentageCalculator } from './tools/PercentageCalculator';
import { HourlyRateCalculator } from './tools/HourlyRateCalculator';
import { WordCounter } from './tools/WordCounter';
import { ImageResizer } from './tools/ImageResizer';

interface FreeToolsSectionProps {
  filteredTools: ToolItem[];
  onNotify: (msg: string) => void;
  activeToolId: string;
  onSelectTool: (id: string) => void;
}

const TOOL_SLUG_MAP: Record<string, string> = {
  'percentage-calc': 'percentage-calculator',
  'hourly-rate': 'hourly-rate-calculator',
  'hourly-rate-calc': 'hourly-rate-calculator',
  'word-counter': 'word-counter',
  'image-resizer': 'image-resizer',
};

export const FreeToolsSection: React.FC<FreeToolsSectionProps> = ({
  filteredTools,
  onNotify,
  activeToolId,
  onSelectTool,
}) => {
  const freeTools = filteredTools.filter((t) => !t.isPremium);

  // When search or category filters change, ensure an available matching free tool is active
  useEffect(() => {
    if (freeTools.length > 0) {
      const hasActive = freeTools.some(
        (t) =>
          t.id === activeToolId ||
          (t.id === 'hourly-rate-calc' && activeToolId === 'hourly-rate') ||
          (t.id === 'hourly-rate' && activeToolId === 'hourly-rate-calc')
      );
      if (!hasActive) {
        onSelectTool(freeTools[0].id);
      }
    }
  }, [freeTools, activeToolId, onSelectTool]);

  const handleToolClick = (id: string) => {
    onSelectTool(id);
    const el = document.getElementById('active-tool-workspace');
    if (el) {
      const offset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Percent':
        return <Percent className="w-5 h-5 text-blue-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-slate-50" id="tools-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-3 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free Tools • No Sign-Up Needed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Business Tools
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            Start with useful tools you can use without a Premium subscription.
          </p>
        </div>

        {/* Free Tools Cards Grid */}
        {freeTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {freeTools.map((tool) => {
              const isActive = activeToolId === tool.id;
              return (
                <div
                  key={tool.id}
                  id={`tool-card-${tool.id}`}
                  className={`p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                    isActive
                      ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header: Icon & FREE Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        {getToolIcon(tool.iconName)}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        FREE
                      </span>
                    </div>

                    {/* Tool Name */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {tool.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {tool.tagline}
                    </p>
                  </div>

                  {/* Clear "Use Free" Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      id={`btn-use-free-${tool.id}`}
                      onClick={() => handleToolClick(tool.id)}
                      className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{isActive ? 'Use Free (Active)' : 'Use Free'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`} />
                    </button>

                    {TOOL_SLUG_MAP[tool.id] && (
                      <div className="flex items-center justify-center mt-2.5">
                        <Link
                          href={`/tools/${TOOL_SLUG_MAP[tool.id]}`}
                          className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Dedicated page</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 mb-8">
            No free tools match your search or filter. Try clearing filters or searching for &quot;calculator&quot;, &quot;rate&quot;, &quot;counter&quot;, or &quot;resizer&quot;.
          </div>
        )}

        {/* Active Tool Interactive Container */}
        <div id="active-tool-workspace" className="pt-2">
          {activeToolId === 'percentage-calc' && (
            <PercentageCalculator onNotify={onNotify} />
          )}
          {(activeToolId === 'hourly-rate' || activeToolId === 'hourly-rate-calc') && (
            <HourlyRateCalculator onNotify={onNotify} />
          )}
          {activeToolId === 'word-counter' && (
            <WordCounter onNotify={onNotify} />
          )}
          {activeToolId === 'image-resizer' && (
            <ImageResizer onNotify={onNotify} />
          )}
        </div>
      </div>
    </section>
  );
};
