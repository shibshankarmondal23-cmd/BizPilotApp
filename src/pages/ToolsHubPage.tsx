import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Compass,
  ChevronRight,
  Percent,
  TrendingUp,
  Clock,
  FileText,
  Image,
  Receipt,
  FileSpreadsheet,
  Briefcase,
  Mail,
  Share2,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { ALL_TOOLS } from '../data/toolsData';
import { TOOL_SEO_PAGES } from '../data/seoData';
import { ToolCategory } from '../types';
import { updateMetaTags, getPageSchema } from '../utils/seo';
import { Link } from '../utils/router';

interface ToolsHubPageProps {
  onOpenUpgradeModal: (toolName?: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Percent: <Percent className="w-5 h-5 text-blue-600" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-600" />,
  Clock: <Clock className="w-5 h-5 text-amber-600" />,
  FileText: <FileText className="w-5 h-5 text-indigo-600" />,
  Image: <Image className="w-5 h-5 text-purple-600" />,
  Receipt: <Receipt className="w-5 h-5 text-blue-600" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5 text-teal-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-slate-700" />,
  Mail: <Mail className="w-5 h-5 text-rose-600" />,
  Share2: <Share2 className="w-5 h-5 text-cyan-600" />
};

export const ToolsHubPage: React.FC<ToolsHubPageProps> = ({ onOpenUpgradeModal }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');

  useEffect(() => {
    updateMetaTags({
      title: 'Business Tools & Calculators for Freelancers & Small Business | BizPilot',
      description: 'Explore BizPilot tools: free business calculators (percentage, hourly rate, word counter, image resizer) and premium business tools (profit margin, invoice, quote, and proposal generators).',
      canonicalPath: '/tools',
      schema: getPageSchema(
        'Business Tools & Calculators',
        '/tools',
        'Directory of free business calculators and premium business document generators on BizPilot.'
      )
    });
  }, []);

  const categories: ToolCategory[] = ['All', 'Business', 'Calculators', 'Productivity', 'Marketing'];

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      return (
        matchesCategory &&
        (tool.name.toLowerCase().includes(q) ||
          tool.tagline.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Breadcrumbs */}
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
            <li className="text-slate-900 font-semibold truncate" aria-current="page">
              Tools Directory
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200/80 pt-12 pb-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>BizPilot Toolbox</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Business Tools &amp; Calculators for Independent Operators
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Practical calculators, productivity tools, invoice, quote and proposal generators created specifically for freelancers, solopreneurs and small businesses.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Fast Client-Side Execution
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% In-Browser Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Free Forever Essentials
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input with Proper Label */}
            <div className="relative w-full md:flex-1">
              <label htmlFor="tools-catalog-search" className="sr-only">
                Search all tools
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="tools-catalog-search"
                type="text"
                placeholder="Search tools by name, formula, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto" role="group" aria-label="Tool Categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            // Find dedicated tool SEO route if available
            const seoPage = Object.values(TOOL_SEO_PAGES).find((p) => p.toolKey === tool.id);
            const toolUrl = seoPage ? seoPage.route : `/tools#${tool.id}`;

            return (
              <div
                key={tool.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {ICON_MAP[tool.iconName] || <Sparkles className="w-5 h-5 text-blue-600" />}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        tool.isPremium
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tool.isPremium ? 'Premium Generator' : 'Free Tool'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    {tool.name}
                  </h2>

                  <p className="text-xs font-semibold text-blue-600 mb-2">
                    {tool.tagline}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Category: {tool.category}
                  </span>

                  {seoPage ? (
                    <Link
                      href={toolUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenUpgradeModal(tool.name)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      <span>Preview Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base font-bold text-slate-800">No tools matched your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try another keyword or select "All" categories.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
