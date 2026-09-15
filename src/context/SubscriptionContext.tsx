import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SubscriptionPlanId, SubscriptionState, SubscriptionStatus, SubscriptionTier } from '../types';
import {
  DEFAULT_GUEST_SUBSCRIPTION,
  canUserAccessTool,
  isToolPremium,
  isToolFree,
  isSubscriptionActive,
  isSubscriptionExpired,
  getSubscriptionTierLabel,
  getSubscriptionStatusLabel,
  ENFORCE_STRICT_PREMIUM_LOCK,
  paymentProvider,
} from '../services/subscriptionService';
import { useRouter } from '../utils/router';

export interface SubscriptionContextType {
  subscription: SubscriptionState;
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  isPremium: boolean;
  isActive: boolean;
  isCancelled: boolean;
  isExpired: boolean;
  isLoading: boolean;
  tierLabel: string;
  statusDetails: { label: string; badgeClass: string };
  canAccessTool: (toolIdOrSlug: string) => boolean;
  getToolAccess: (toolIdOrSlug: string) => {
    isPremium: boolean;
    isAllowed: boolean;
    isPreviewMode: boolean;
  };
  openUpgradeModal: (toolName?: string) => void;
  openCheckoutModal: (planName?: string) => void;
  navigateToPricing: () => void;
  applyVerifiedEntitlement: (entitlement: SubscriptionState) => void;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
  onOpenUpgradeModal?: (toolName?: string) => void;
  onOpenCheckoutModal?: (planName?: string) => void;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
  onOpenUpgradeModal,
  onOpenCheckoutModal,
}) => {
  const { navigate, searchParams } = useRouter();

  // Subscription state: defaults strictly to guest/free with zero assumption of premium
  const [subscription, setSubscription] = useState<SubscriptionState>(DEFAULT_GUEST_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to refresh state from real server endpoint
  const refreshSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      // Calls server route in production: /api/subscription/status
      const res = await fetch('/api/subscription/status');
      if (res.ok) {
        const data = await res.json();
        if (data && data.status) {
          setSubscription({
            ...data,
            isPremium: isSubscriptionActive(data),
          });
        }
      }
    } catch {
      // Offline / server pending: remain securely in default guest free tier
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check URL parameters for real checkout return (e.g. ?session_id=cs_...)
  useEffect(() => {
    const sessionId = searchParams?.get?.('session_id') || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') : null);
    if (sessionId) {
      setIsLoading(true);
      // Verify payment with the server adapter
      paymentProvider.verifyPaymentSession(sessionId).then((res) => {
        if (res.verified && res.entitlement) {
          setSubscription({
            ...res.entitlement,
            isPremium: isSubscriptionActive(res.entitlement),
          });
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  }, [searchParams]);

  const status: SubscriptionStatus = isLoading ? 'loading' : subscription.status;
  const tier: SubscriptionTier = subscription.tier || 'free';
  const isPremium = isSubscriptionActive(subscription);
  const isActive = status === 'active';
  const isCancelled = status === 'cancelled';
  const isExpired = isSubscriptionExpired(subscription);
  const tierLabel = getSubscriptionTierLabel(tier);
  const statusDetails = getSubscriptionStatusLabel(status);

  const checkAccess = (toolIdOrSlug: string): boolean => {
    return canUserAccessTool(toolIdOrSlug, subscription);
  };

  const getToolAccess = (toolIdOrSlug: string) => {
    const isPrem = isToolPremium(toolIdOrSlug);
    const isFree = isToolFree(toolIdOrSlug);
    const isAllowed = canUserAccessTool(toolIdOrSlug, subscription);
    const isPreviewMode = isPrem && !isPremium && !ENFORCE_STRICT_PREMIUM_LOCK;

    return {
      isPremium: isPrem,
      isAllowed,
      isPreviewMode,
    };
  };

  const openUpgradeModal = (toolName?: string) => {
    if (onOpenUpgradeModal) {
      onOpenUpgradeModal(toolName);
    } else {
      navigate('/pricing');
    }
  };

  const openCheckoutModal = (planName?: string) => {
    if (onOpenCheckoutModal) {
      onOpenCheckoutModal(planName);
    } else {
      navigate('/pricing');
    }
  };

  const navigateToPricing = () => {
    navigate('/pricing');
  };

  const applyVerifiedEntitlement = (entitlement: SubscriptionState) => {
    setSubscription({
      ...entitlement,
      isPremium: isSubscriptionActive(entitlement),
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        status,
        tier,
        isPremium,
        isActive,
        isCancelled,
        isExpired,
        isLoading,
        tierLabel,
        statusDetails,
        canAccessTool: checkAccess,
        getToolAccess,
        openUpgradeModal,
        openCheckoutModal,
        navigateToPricing,
        applyVerifiedEntitlement,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
