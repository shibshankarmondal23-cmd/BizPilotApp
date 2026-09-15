import React, { useState } from 'react';
import {
  Lock,
  Receipt,
  FileSpreadsheet,
  Briefcase,
  TrendingUp,
  Mail,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { ToolItem } from '../types';
import { Link } from '../utils/router';
import { ProfitMarginCalculator } from './tools/ProfitMarginCalculator';
import { InvoiceGenerator } from './tools/InvoiceGenerator';
import { QuoteGenerator } from './tools/QuoteGenerator';
import { ProposalGenerator } from './tools/ProposalGenerator';

interface PremiumToolsProps {
  filteredTools: ToolItem[];
  onOpenUpgradeModal: (toolName?: string) => void;
  activePremiumToolId?: string;
  onSelectPremiumTool?: (id: string) => void;
  onNotify?: (msg: string) => void;
}

const PREMIUM_SLUG_MAP: Record<string, string> = {
  'profit-margin': 'profit-margin-calculator',
  'invoice-gen': 'invoice-generator',
  'quote-gen': 'quote-generator',
  'proposal-gen': 'proposal-generator',
};

export const PremiumToolsSection: React.FC<PremiumToolsProps> = ({
  filteredTools,
  onOpenUpgradeModal,
  activePremiumToolId: controlledActiveId,
  onSelectPremiumTool: controlledOnSelect,
  onNotify = () => {},
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>('invoice-gen');
  const activeToolId = controlledActiveId || internalActiveId;

  const handleSelectTool = (id: string) => {
    if (controlledOnSelect) {
      controlledOnSelect(id);
    } else {
      setInternalActiveId(id);
    }

    // Scroll to interactive workspace
    setTimeout(() => {
      const el = document.getElementById('active-premium-tool-workspace');
      if (el) {
        const offset = 80;
        const elPosition = el.getBoundingClientRect().top;
        const offsetPosition = elPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const premiumTools = filteredTools.filter((t) => t.isPremium);

  const getPremiumIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-indigo-600" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-teal-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-violet-600" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-emerald-600" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Helper to identify the 4 premium tools available for interactive use
  const isPreviewable = (toolId: string) => {
    return (
      toolId === 'profit-margin' ||
      toolId === 'invoice-gen' ||
      toolId === 'quote-gen' ||
      toolId === 'proposal-gen'
    );
  };

  return (
    <section className="py-12 md:py-16 bg-white border-t border-slate-200/70" id="premium-tools-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-200/70">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Premium Business Suite</span>
              <span className="text-amber-400">•</span>
              <span className="font-extrabold text-amber-800">First Month $5 Deal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Premium Business Tools
            </h2>
            <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-2xl">
              Advanced generators and client communication suites built to streamline contracts, client proposals, and marketing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => onOpenUpgradeModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Unlock All Tools ($5 Special)</span>
            </button>
          </div>
        </div>

        {/* Premium Tools Cards Grid */}
        {premiumTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumTools.map((tool) => {
              const previewReady = isPreviewable(tool.id);
              const isActive = activeToolId === tool.id;

              return (
                <div
                  key={tool.id}
                  id={`premium-card-${tool.id}`}
                  onClick={() => {
                    if (previewReady) {
                      handleSelectTool(tool.id);
                    } else {
                      onOpenUpgradeModal(tool.name);
                    }
                  }}
                  className={`group relative rounded-3xl p-6 sm:p-7 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isActive && previewReady
                      ? 'bg-white border-blue-500 shadow-lg ring-2 ring-blue-500/20'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200/90 hover:border-blue-400/80 hover:shadow-md'
                  }`}
                >
                  {/* Top Row */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                        {getPremiumIcon(tool.iconName)}
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5">
                        {previewReady ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>PREVIEW READY</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs font-black tracking-wide shadow-2xs">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>PREMIUM</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>

                    <p className="text-xs font-bold text-blue-600 mt-1">
                      {tool.tagline}
                    </p>

                    {/* Benefit-focused description */}
                    <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Feature preview bullets */}
                    <div className="mt-5 pt-3 border-t border-slate-200/70 space-y-2 text-xs text-slate-600">
                      {tool.id === 'profit-margin' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Gross profit &amp; markup multiplier formulas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>Real-time margin vs cost pricing analytics</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>100% private in-browser calculations</span>
                          </div>
                        </>
                      ) : tool.id === 'quote-gen' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Binding project estimates &amp; deposit terms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>Zero server uploads • 100% private</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Downloadable branded quote PDF</span>
                          </div>
                        </>
                      ) : tool.id === 'proposal-gen' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Comprehensive scope &amp; milestone deliverables</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>Executive project summary &amp; signature block</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Professional presentation-ready layout</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Client-side PDF download ready</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span>Zero server uploads • 100% private</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>US Letter layout with auto-totals</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {previewReady ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTool(tool.id);
                          }}
                          id={`btn-open-preview-${tool.id}`}
                          className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 group-hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>{isActive ? 'Active in Workspace' : 'Open Tool (Preview)'}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        <div className="flex items-center justify-between mt-2.5 px-1">
                          {PREMIUM_SLUG_MAP[tool.id] ? (
                            <Link
                              href={`/tools/${PREMIUM_SLUG_MAP[tool.id]}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                            >
                              <span>Dedicated page</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          ) : <span />}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenUpgradeModal(tool.name);
                            }}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors"
                          >
                            Upgrade ($5 Deal)
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenUpgradeModal(tool.name);
                        }}
                        id={`btn-unlock-premium-${tool.id}`}
                        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Unlock Premium</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            No premium tools match your current filter. Try selecting &quot;All&quot; or searching for &quot;invoice&quot;, &quot;quote&quot;, &quot;proposal&quot;, or &quot;caption&quot;.
          </div>
        )}

        {/* Value reassurance note */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All premium generators include commercial use rights, US Letter formatting, and zero watermarks.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenUpgradeModal()}
            className="text-blue-600 hover:text-blue-700 font-bold self-start sm:self-auto cursor-pointer"
          >
            Learn about first month $5 offer &rarr;
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVE PREMIUM TOOL INTERACTIVE WORKSPACE */}
        {/* ------------------------------------------------------------- */}
        <div id="active-premium-tool-workspace" className="mt-14 pt-8 border-t border-slate-200">
          {/* Workspace Quick Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Interactive Generator Workspace
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeToolId === 'profit-margin'
                  ? 'Profit Margin Calculator'
                  : activeToolId === 'invoice-gen'
                  ? 'Invoice Generator'
                  : activeToolId === 'quote-gen'
                  ? 'Quote Generator'
                  : activeToolId === 'proposal-gen'
                  ? 'Proposal Generator'
                  : 'Document Generator'}
              </h3>
            </div>

            {/* Quick Switch Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => handleSelectTool('profit-margin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeToolId === 'profit-margin'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Profit Margin</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('invoice-gen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeToolId === 'invoice-gen'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                <span>Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('quote-gen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeToolId === 'quote-gen'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                <span>Quote</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTool('proposal-gen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeToolId === 'proposal-gen'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-violet-600" />
                <span>Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenUpgradeModal('Client Email Generator')}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                title="Locked tool - unlock with $5 deal"
              >
                <Lock className="w-3 h-3 text-amber-500" />
                <span>Email (Locked)</span>
              </button>
            </div>
          </div>

          {/* Active Tool Renderer */}
          {activeToolId === 'profit-margin' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[11px] font-black uppercase tracking-wider mb-1 border border-amber-300">
                      <span>PREMIUM CALCULATOR</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-950 font-semibold">
                      Profit Margin Calculator — Calculate sustainable pricing, gross margin &amp; markup multipliers.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onOpenUpgradeModal('Profit Margin Calculator')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    Upgrade to Premium ($5 Deal)
                  </button>
                  <Link
                    href="/pricing"
                    className="px-3.5 py-2 rounded-xl border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Pricing Plans
                  </Link>
                </div>
              </div>
              <ProfitMarginCalculator onNotify={onNotify} />
            </div>
          )}

          {activeToolId === 'invoice-gen' && (
            <InvoiceGenerator onNotify={onNotify} onOpenUpgradeModal={onOpenUpgradeModal} />
          )}

          {activeToolId === 'quote-gen' && (
            <QuoteGenerator onNotify={onNotify} onOpenUpgradeModal={onOpenUpgradeModal} />
          )}

          {activeToolId === 'proposal-gen' && (
            <ProposalGenerator onNotify={onNotify} onOpenUpgradeModal={onOpenUpgradeModal} />
          )}
        </div>
      </div>
    </section>
  );
};
