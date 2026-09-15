import React, { useEffect } from 'react';
import { X, Sparkles, ArrowRight, Shield, TrendingUp, Receipt, FileSpreadsheet, Briefcase, Mail, Share2 } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlans: () => void;
  selectedToolName?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onViewPlans,
  selectedToolName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const premiumFeatures = [
    { name: 'Profit Margin Calculator', desc: 'Sustainable pricing targets, gross margin & markup formulas', icon: TrendingUp },
    { name: 'Invoice Generator', desc: 'Custom line items, tax rates & downloadable PDF invoices', icon: Receipt },
    { name: 'Quote Generator', desc: 'Binding project estimates with deposit requirements & terms', icon: FileSpreadsheet },
    { name: 'Proposal Generator', desc: 'Comprehensive scopes, milestones, deliverables & signature fields', icon: Briefcase },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      id="premium-upgrade-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-modal-title"
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BizPilot Premium</span>
          </div>

          <h3 id="premium-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Unlock BizPilot Premium
          </h3>

          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Get access to advanced business tools designed to save you time and simplify your everyday work.
          </p>

          {/* Special Offer Highlight Banner */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold">
            <span className="text-white font-extrabold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-md">
              New users: First month only $5.
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {selectedToolName && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                You selected <strong>{selectedToolName}</strong>. Unlock this tool and all premium business generators below.
              </span>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included In BizPilot Premium:
            </h4>
            <div className="space-y-2.5">
              {premiumFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.name} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">{feat.name}</span>
                      <span className="text-slate-500">{feat.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewPlans();
              }}
              id="modal-cta-view-plans"
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Premium Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              id="modal-cta-continue-free"
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Continue with Free Tools
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              All 4 core calculators remain 100% free with no sign-up or credit card required.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
