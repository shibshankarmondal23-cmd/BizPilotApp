import React, { useState } from 'react';
import {
  Briefcase,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calendar,
  FileText
} from 'lucide-react';
import { ProposalData } from '../../types';
import { generateProposalPDF } from '../../utils/pdfGenerator';

interface Props {
  onNotify?: (msg: string) => void;
  onOpenUpgradeModal?: () => void;
}

const DEFAULT_PROPOSAL: ProposalData = {
  businessName: 'Stratagem Growth Partners',
  contactName: 'Marcus Vance, Principal Strategist',
  businessEmail: 'marcus@stratagemgrowth.io',
  businessPhone: '(555) 492-3110',
  clientName: 'Elena Rostova, VP of Operations',
  companyName: 'AeroLine Dynamics Inc.',
  clientEmail: 'e.rostova@aerolinedynamics.com',
  proposalTitle: 'Enterprise Workflow Modernization & Automation Initiative',
  proposalDate: new Date().toISOString().split('T')[0],
  currency: 'USD',
  projectDescription:
    'A comprehensive 8-week advisory and operational overhaul designed to eliminate cross-departmental communication bottlenecks, reduce manual invoice reconciliations by 70%, and automate daily project reporting across AeroLine Dynamics core operations.',
  scopeOfWork:
    '1. Discovery & Audit: Conduct 6 stakeholder interviews, audit existing CRM/ERP toolchains, and document pain points.\n2. Architecture & Solution Blueprint: Formulate unified automation workflows and integration schemas.\n3. Implementation & Testing: Configure automated sync pipelines, custom business logic rules, and alert triggers in staging.\n4. Staff Onboarding: Provide hands-on group workshops and record step-by-step video training for operations team.',
  deliverables:
    '• Comprehensive Operational Audit & Bottleneck Heatmap Report\n• Production-ready Automated Workflow Integrations\n• Administrator & User SOP Playbook (PDF + Markdown)\n• 4 Live Training Sessions with full screen recording repository\n• 30 Days of Dedicated Post-Launch Hypercare & Technical Support',
  timeline:
    '• Weeks 1–2: Discovery, Stakeholder Audit & Requirements Sign-off\n• Weeks 3–5: System Architecture & Workflow Pipeline Buildout\n• Weeks 6–7: User Acceptance Testing, Security Hardening & Dry Runs\n• Week 8: Production Cutover, Team Training & Official Handoff',
  pricing:
    'Total Engagement Investment: $14,500 USD (Fixed-fee comprehensive package covering all 4 phases, deliverables, and 30-day post-launch hypercare).',
  paymentTerms:
    '• 40% initial deposit ($5,800) upon contract execution prior to project kickoff.\n• 30% milestone payment ($4,350) upon completion and demonstration of Phase 2 blueprint.\n• 30% final balance ($4,350) due upon production deployment and training completion (Net 15).',
  additionalNotes:
    'This proposal remains valid for 30 calendar days from the issue date. Any expansions to the agreed deliverables outside the defined scope of work will be estimated and billed separately through written change orders.',
};

export const ProposalGenerator: React.FC<Props> = ({ onNotify, onOpenUpgradeModal }) => {
  const [data, setData] = useState<ProposalData>(DEFAULT_PROPOSAL);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleReset = () => {
    setData({
      businessName: '',
      contactName: '',
      businessEmail: '',
      businessPhone: '',
      clientName: '',
      companyName: '',
      clientEmail: '',
      proposalTitle: '',
      proposalDate: new Date().toISOString().split('T')[0],
      currency: 'USD',
      projectDescription: '',
      scopeOfWork: '',
      deliverables: '',
      timeline: '',
      pricing: '',
      paymentTerms: '',
      additionalNotes: '',
    });
    if (onNotify) onNotify('Proposal form reset to blank');
  };

  const handleLoadSample = () => {
    setData(DEFAULT_PROPOSAL);
    if (onNotify) onNotify('Loaded sample project proposal');
  };

  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      generateProposalPDF(data);
      setIsGeneratingPdf(false);
      if (onNotify) onNotify(`Proposal "${data.proposalTitle || 'Project Proposal'}" downloaded as PDF!`);
    } catch (err) {
      setIsGeneratingPdf(false);
      console.error('Error generating Proposal PDF:', err);
      if (onNotify) onNotify('Failed to generate PDF. Please verify proposal contents.');
    }
  };

  return (
    <div id="proposal-generator-tool" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <Briefcase className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Proposal Generator</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Premium preview — checkout coming soon.
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Structure persuasive, high-value client project proposals. Your proposal is generated in your browser.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            Sample Proposal
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            {showLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showLivePreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Compiling PDF…' : 'Download Proposal'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className={showLivePreview ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {/* Section 1: Business Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-600"></span>
              Business Details (Prepared By)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Business Name</label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="e.g. Stratagem Growth Partners"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Name &amp; Title</label>
                <input
                  type="text"
                  value={data.contactName}
                  onChange={(e) => setData({ ...data, contactName: e.target.value })}
                  placeholder="e.g. Marcus Vance, Lead Consultant"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => setData({ ...data, businessEmail: e.target.value })}
                  placeholder="contact@yourbusiness.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.businessPhone}
                  onChange={(e) => setData({ ...data, businessPhone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client Details */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Client Details (Prepared For)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Name</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  placeholder="e.g. AeroLine Dynamics Inc."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Email</label>
                <input
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  placeholder="client@aeroline.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Project Title & Date */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Project Overview
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={data.proposalTitle}
                  onChange={(e) => setData({ ...data, proposalTitle: e.target.value })}
                  placeholder="e.g. Enterprise Workflow Modernization Initiative"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Proposal Date</label>
                <input
                  type="date"
                  value={data.proposalDate}
                  onChange={(e) => setData({ ...data, proposalDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Project Description &amp; Objectives</label>
              <textarea
                rows={3}
                value={data.projectDescription}
                onChange={(e) => setData({ ...data, projectDescription: e.target.value })}
                placeholder="High-level executive summary of what this project aims to accomplish..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Scope & Deliverables */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Scope of Work &amp; Deliverables
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Scope of Work</label>
              <textarea
                rows={4}
                value={data.scopeOfWork}
                onChange={(e) => setData({ ...data, scopeOfWork: e.target.value })}
                placeholder="Key phases, technical tasks, or activities involved..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tangible Deliverables</label>
              <textarea
                rows={3}
                value={data.deliverables}
                onChange={(e) => setData({ ...data, deliverables: e.target.value })}
                placeholder="Bullet points of concrete assets, reports, or deliverables..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Section 5: Timeline, Pricing & Payment */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Timeline &amp; Investment
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Timeline &amp; Milestones</label>
              <textarea
                rows={3}
                value={data.timeline}
                onChange={(e) => setData({ ...data, timeline: e.target.value })}
                placeholder="Key weeks, sprints, or milestone completion dates..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pricing / Investment</label>
              <textarea
                rows={2}
                value={data.pricing}
                onChange={(e) => setData({ ...data, pricing: e.target.value })}
                placeholder="Total engagement fee, fixed project cost, or hourly retainers..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Terms</label>
              <textarea
                rows={2}
                value={data.paymentTerms}
                onChange={(e) => setData({ ...data, paymentTerms: e.target.value })}
                placeholder="Deposit schedule, milestone invoices, payment method instructions..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Additional Notes &amp; Conditions</label>
              <textarea
                rows={2}
                value={data.additionalNotes}
                onChange={(e) => setData({ ...data, additionalNotes: e.target.value })}
                placeholder="Validity terms, assumptions, client feedback turnaround rules..."
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-violet-500 outline-none bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* In-Browser Privacy Note */}
          <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100 flex items-center justify-between gap-3 text-xs text-violet-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0" />
              <span>
                <strong>Confidential &amp; Secure:</strong> Your proposal is generated in your browser. Client pricing and strategic scopes are never sent to external servers.
              </span>
            </div>
            {onOpenUpgradeModal && (
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="text-xs font-bold text-violet-700 hover:text-violet-800 underline shrink-0 cursor-pointer"
              >
                $5 early access info
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        {showLivePreview && (
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Proposal Preview</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{data.proposalDate}</span>
              </div>

              {/* Sheet preview */}
              <div className="mt-5 bg-white text-slate-900 rounded-2xl p-5 shadow-sm text-xs space-y-3.5 max-h-[600px] overflow-y-auto">
                <div className="bg-slate-900 text-white p-4 rounded-xl">
                  <span className="text-[9px] font-bold text-blue-300 tracking-wider uppercase block">Project Proposal</span>
                  <h5 className="font-extrabold text-sm text-white mt-1 leading-snug">
                    {data.proposalTitle || 'Proposal Title'}
                  </h5>
                  <p className="text-[10px] text-slate-300 mt-2">
                    Prepared for: {data.clientName || 'Client'} {data.companyName ? `(${data.companyName})` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">By</span>
                    <span className="font-semibold text-slate-800">{data.businessName || 'Your Business'}</span>
                    <p className="text-slate-500 truncate">{data.contactName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block">For</span>
                    <span className="font-semibold text-slate-800">{data.companyName || data.clientName}</span>
                    <p className="text-slate-500 truncate">{data.clientEmail}</p>
                  </div>
                </div>

                {data.projectDescription && (
                  <div>
                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                      1. Project Objective
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-3 mt-0.5">{data.projectDescription}</p>
                  </div>
                )}

                {data.scopeOfWork && (
                  <div>
                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">
                      2. Scope of Work
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-3 whitespace-pre-line mt-0.5">{data.scopeOfWork}</p>
                  </div>
                )}

                {data.pricing && (
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Investment &amp; Pricing
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{data.pricing}</p>
                  </div>
                )}

                {data.paymentTerms && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Payment Terms
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{data.paymentTerms}</p>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Compiling PDF…' : 'Download Proposal (PDF)'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  Formatted for formal executive presentation &amp; signature.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
