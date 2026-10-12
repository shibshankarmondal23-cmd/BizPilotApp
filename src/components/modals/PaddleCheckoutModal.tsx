import React from 'react';

interface PaddleCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
  onNotify?: (msg: string) => void;
}

export const PaddleCheckoutModal: React.FC<PaddleCheckoutModalProps> = () => {
  return null;
};
