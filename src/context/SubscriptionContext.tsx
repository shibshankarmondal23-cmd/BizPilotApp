import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionPlanId, SubscriptionState, SubscriptionStatus } from '../types';
import {
  DEFAULT_GUEST_SUBSCRIPTION,
  canUserAccessTool,
  isToolPremium,
  isToolFree,
  ENFORCE_STRICT_PREMIUM_LOCK,
} from '../services/subscriptionService';
import { useRouter } from '../utils/router';

export interface SubscriptionContextType {
  subscription: SubscriptionState;
  status: SubscriptionStatus;
  isPremium: boolean;
  isExpired: boolean;
  isLoading: boolean;
  canAccessTool: (toolIdOrSlug: string) => boolean;
  getToolAccess: (toolIdOrSlug: string) => {
    isPremium: boolean;
    isAllowed: boolean;
    isPreviewMode: boolean;
  };
  openUpgradeModal: (toolName?: string) => void;
  openCheckoutModal: (planName?: string) => void;
  navigateToPricing: () => void;
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
  const { navigate } = useRouter();

  // Subscription state: defaults strictly to guest/free
  const [subscription, setSubscription] = useState<SubscriptionState>(DEFAULT_GUEST_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // When real authentication and backend are connected later,
    // this effect will query `/api/user/subscription` to hydrate state.
    // For now, guest users default to 'free' state as required.
    setIsLoading(false);
  }, []);

  const status: SubscriptionStatus = isLoading ? 'loading' : subscription.status;
  const isPremium = status === 'premium';
  const isExpired = status === 'expired';

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

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        status,
        isPremium,
        isExpired,
        isLoading,
        canAccessTool: checkAccess,
        getToolAccess,
        openUpgradeModal,
        openCheckoutModal,
        navigateToPricing,
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
