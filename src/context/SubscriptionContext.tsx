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

  // Subscription state: initialize from localStorage if active, otherwise default to guest/free
  const [subscription, setSubscription] = useState<SubscriptionState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bizpilot_subscription');
        if (saved) {
          const parsed: SubscriptionState = JSON.parse(saved);
          if (isSubscriptionActive(parsed)) {
            return {
              ...parsed,
              isPremium: true,
            };
          }
        }
      } catch {
        // Fallback to default guest
      }
    }
    return DEFAULT_GUEST_SUBSCRIPTION;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to refresh state from real server endpoint
  const refreshSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/subscription/status');
      if (res.ok) {
        const data = await res.json();
        if (data && data.status) {
          const updated = {
            ...data,
            isPremium: isSubscriptionActive(data),
          };
          setSubscription(updated);
          if (typeof window !== 'undefined' && updated.isPremium) {
            localStorage.setItem('bizpilot_subscription', JSON.stringify(updated));
          }
        }
      }
    } catch {
      // Offline / server pending: remain securely in default guest free tier
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check URL parameters for real checkout return (e.g. ?order_id=biz_... or ?session_id=...)
  useEffect(() => {
    const orderId = searchParams?.get?.('order_id') ||
      searchParams?.get?.('orderId') ||
      searchParams?.get?.('session_id') ||
      (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('order_id') : null);

    if (orderId) {
      setIsLoading(true);
      // Verify payment with Cashfree payment provider
      paymentProvider.verifyPaymentSession(orderId).then((res) => {
        if (res.verified && res.entitlement) {
          const activeSub: SubscriptionState = {
            ...res.entitlement,
            isPremium: isSubscriptionActive(res.entitlement),
          };
          setSubscription(activeSub);
          if (typeof window !== 'undefined') {
            localStorage.setItem('bizpilot_subscription', JSON.stringify(activeSub));
          }
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
    const updated: SubscriptionState = {
      ...entitlement,
      isPremium: isSubscriptionActive(entitlement),
    };
    setSubscription(updated);
    if (typeof window !== 'undefined' && updated.isPremium) {
      try {
        localStorage.setItem('bizpilot_subscription', JSON.stringify(updated));
      } catch {
        // Storage unavailable or disabled
      }
    }
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
