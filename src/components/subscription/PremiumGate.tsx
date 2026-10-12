import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Tag, Lock, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link, useRouter } from '../../utils/router';

interface UpgradeNoticeBannerProps {
  toolName: string;
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export const UpgradeNoticeBanner: React.FC<UpgradeNoticeBannerProps> = () => {
  return null;
};

interface PremiumAccessGateProps {
  toolId: string;
  toolName: string;
  children: React.ReactNode;
  onUpgradeClick?: () => void;
}

export const PremiumAccessGate: React.FC<PremiumAccessGateProps> = ({
  children,
}) => {
  return <>{children}</>;
};
