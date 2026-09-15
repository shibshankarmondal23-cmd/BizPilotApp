import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Tag, Lock, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link, useRouter } from '../../utils/router';

interface UpgradeNoticeBannerProps {
  toolName: string;
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export const UpgradeNoticeBanner: React.FC<UpgradeNoticeBannerProps> = ({
  toolName,
  onUpgradeClick,
  compact = false,
}) => {
  const { navigate } = useRouter();
  const { isPremium, status } = useSubscription();

  if (isPremium) {
    return (
      <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Premium Access Active: Full unlimited usage of {toolName}.
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          Active Plan
        </span>
      </div>
    );
  }

  const handleAction = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate('/pricing');
    }
  };

  if (compact) {
    return (
      <div className="p-3 px-4 rounded-xl bg-amber-50/90 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{toolName}</strong> is part of BizPilot Premium.
          </span>
          <span className="hidden sm:inline text-amber-700">•</span>
          <span className="hidden sm:inline font-bold text-amber-800">
            First month only $5
          </span>
        </div>
        <button
          type="button"
          onClick={handleAction}
          className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
        >
          <span>Upgrade to Premium</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      id={`upgrade-banner-${toolName.toLowerCase().replace(/\s+/g, '-')}`}
      className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50/95 via-amber-50/70 to-blue-50/90 border border-amber-200/90 shadow-xs mb-6 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-amber-300">
                <Tag className="w-3 h-3" />
                PREMIUM TOOL
              </span>
              <span className="text-xs font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                First month $5 promotional deal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              You are using <strong>{toolName}</strong>. Upgrade to unlock full suite exports, professional client documents, and priority features.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleAction}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Upgrade to Premium ($5 Deal)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <Link
            href="/pricing"
            className="px-3.5 py-2.5 rounded-xl border border-amber-300 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors whitespace-nowrap"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
};

interface PremiumAccessGateProps {
  toolId: string;
  toolName: string;
  children: React.ReactNode;
  onUpgradeClick?: () => void;
}

export const PremiumAccessGate: React.FC<PremiumAccessGateProps> = ({
  toolId,
  toolName,
  children,
  onUpgradeClick,
}) => {
  const { isPremium } = useSubscription();

  return (
    <div className="relative">
      {!isPremium && (
        <UpgradeNoticeBanner toolName={toolName} onUpgradeClick={onUpgradeClick} />
      )}
      {children}
    </div>
  );
};
