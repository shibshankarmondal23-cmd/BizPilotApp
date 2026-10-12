import React from 'react';
import { SubscriptionPlanId } from '../../types';
import { PaddleCheckoutModal } from './PaddleCheckoutModal';

export interface CashfreeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: SubscriptionPlanId;
  selectedPlanName?: string;
  onNotify?: (msg: string) => void;
}

/**
 * Checkout modal component for BizPilot Pro subscriptions.
 * Uses Paddle.js Billing Checkout for the $9.99/month recurring price.
 */
export const CashfreeCheckoutModal: React.FC<CashfreeCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlanName,
  onNotify,
}) => {
  return (
    <PaddleCheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      selectedPlanName={selectedPlanName}
      onNotify={onNotify}
    />
  );
};
