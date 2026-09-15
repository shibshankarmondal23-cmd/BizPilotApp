import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
  Compass
} from 'lucide-react';
import { ToolSeoConfig } from '../data/seoData';
import { updateMetaTags, getToolPageSchema } from '../utils/seo';
import { Link } from '../utils/router';

// Real working tools
import { PercentageCalculator } from '../components/tools/PercentageCalculator';
import { ProfitMarginCalculator } from '../components/tools/ProfitMarginCalculator';
import { HourlyRateCalculator } from '../components/tools/HourlyRateCalculator';
import { WordCounter } from '../components/tools/WordCounter';
import { ImageResizer } from '../components/tools/ImageResizer';
import { InvoiceGenerator } from '../components/tools/InvoiceGenerator';
import { QuoteGenerator } from '../components/tools/QuoteGenerator';
import { ProposalGenerator } from '../components/tools/ProposalGenerator';

interface ToolPageProps {
  toolConfig: ToolSeoConfig;
  onNotify: (msg: string) => void;
  onOpenUpgradeModal: (toolName?: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({
  toolConfig,
  onNotify,
  onOpenUpgradeModal,
}) => {
  // Sync SEO metadata and Schema.org on mount and when toolConfig changes
  useEffect(() => {
    updateMetaTags({
      title: toolConfig.title,
      description: toolConfig.description,
      canonicalPath: toolConfig.route,
      schema: getToolPageSchema(toolConfig),
    });
  }, [toolConfig]);

  // Open FAQ accordion states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Render the appropriate active tool
  const renderToolComponent = () => {
    switch (toolConfig.toolKey) {
      case 'percentage-calc':
        return <PercentageCalculator onNotify={onNotify} />;
      case 'profit-margin':
        return <ProfitMarginCalculator onNotify={onNotify} />;
      case 'hourly-rate':
        return <HourlyRateCalculator onNotify={onNotify} />;
      case 'word-counter':
        return <WordCounter onNotify={onNotify} />;
      case 'image-resizer':
        return <ImageResizer onNotify={onNotify} />;
      case 'invoice-gen':
        return (
          <InvoiceGenerator
            onNotify={onNotify}
            onOpenUpgradeModal={() => onOpenUpgradeModal(toolConfig.name)}
          />
        );
      case 'quote-gen':
        return (
          <QuoteGenerator
            onNotify={onNotify}
            onOpenUpgradeModal={() => onOpenUpgradeModal(toolConfig.name)}
          />
        );
      case 'proposal-gen':
        return (
          <ProposalGenerator
            onNotify={onNotify}
            onOpenUpgradeModal={() => onOpenUpgradeModal(toolConfig.name)}
          />
        );
      default:
        return (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600">Tool component not found.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li>
              <Link href="/tools" className="hover:text-blue-600 transition-colors">
                Tools
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="text-slate-900 font-semibold truncate" aria-current="page">
              {toolConfig.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Tool Header Section */}
      <header className="bg-white border-b border-slate-200/80 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Category & Privacy Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4 border border-slate-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{toolConfig.category}</span>
            <span className="text-slate-300">•</span>
            <span>100% In-Browser Private</span>
          </div>

          {/* Single H1 for the Tool Page */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {toolConfig.h1}
          </h1>

          {/* Useful Introduction */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {toolConfig.introduction}
          </p>

          {/* Quick Value Indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Instant Calculations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              No Account Required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Free Client-Side Tool
            </span>
          </div>
        </div>
      </header>

      {/* Main Tool Working Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-6 lg:p-8">
          {renderToolComponent()}
        </div>

        {/* How to Use Section */}
        {toolConfig.howToUseSteps && toolConfig.howToUseSteps.length > 0 && (
          <section
            aria-labelledby="how-to-use-heading"
            className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                💡
              </span>
              <h2
                id="how-to-use-heading"
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                How to Use the {toolConfig.name}
              </h2>
            </div>
            <ol className="space-y-3 mt-4 text-sm text-slate-600">
              {toolConfig.howToUseSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Tool-Specific FAQ Section */}
        {toolConfig.faqs && toolConfig.faqs.length > 0 && (
          <section
            aria-labelledby="faq-heading"
            className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2
                id="faq-heading"
                className="text-xl font-bold text-slate-900 tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {toolConfig.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const questionId = `faq-q-${toolConfig.id}-${index}`;
                const answerId = `faq-a-${toolConfig.id}-${index}`;

                return (
                  <div
                    key={index}
                    className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related BizPilot Tools (Crucial Internal Linking) */}
        {toolConfig.relatedTools && toolConfig.relatedTools.length > 0 && (
          <section
            aria-labelledby="related-tools-heading"
            className="mt-12 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2
                  id="related-tools-heading"
                  className="text-xl font-bold text-slate-900 tracking-tight"
                >
                  Related BizPilot Tools
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combine these tools to streamline your business workflow.
                </p>
              </div>
              <Link
                href="/tools"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {toolConfig.relatedTools.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.route}
                  className="group flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {rel.name}
                      </span>
                      {rel.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {rel.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {rel.reason}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
