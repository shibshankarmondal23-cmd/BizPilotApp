import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, User, Phone, Sparkles, AlertCircle, Loader2, ArrowRight, CheckCircle2, Lock, Tag } from 'lucide-react';
import { SubscriptionPlanId } from '../../types';
import { initiateCashfreeCheckout } from '../../services/cashfreeClient';

interface CashfreeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanId?: SubscriptionPlanId;
  selectedPlanName?: string;
  onNotify?: (msg: string) => void;
}

interface PlanDisplay {
  id: SubscriptionPlanId;
  name: string;
  price: string;
  subtext: string;
  badge?: string;
  badgeColor?: string;
  termNote: string;
}

const PLAN_DETAILS: Record<string, PlanDisplay> = {
  'monthly-promo': {
    id: 'monthly-promo',
    name: '1 Month ($5 Promo)',
    price: '$5.00',
    subtext: 'First month introductory rate',
    badge: 'FIRST MONTH $5 PROMO',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    termNote: 'Renews at $9.99/mo after first month. Cancel anytime with zero lock-in.',
  },
  '3-months': {
    id: '3-months',
    name: '3 Months (Prepaid)',
    price: '$24.99',
    subtext: '$8.33/month equivalent',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    termNote: 'Prepaid for 3 full months of unlimited access. No automatic monthly billing.',
  },
  '6-months': {
    id: '6-months',
    name: '6 Months (Prepaid)',
    price: '$44.99',
    subtext: '$7.50/month equivalent',
    badge: 'BEST FOR PROJECTS',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    termNote: 'Prepaid for 6 full months of unlimited access. No automatic monthly billing.',
  },
  '1-year': {
    id: '1-year',
    name: '1 Year (Prepaid)',
    price: '$79.99',
    subtext: '$6.67/month equivalent',
    badge: 'BEST VALUE • 12 MONTHS',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    termNote: 'Prepaid for 12 full months of unlimited access. Maximum savings.',
  },
};

export const CashfreeCheckoutModal: React.FC<CashfreeCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId,
  selectedPlanName,
  onNotify,
}) => {
  // Determine plan
  const planKey = selectedPlanId || (
    selectedPlanName?.toLowerCase().includes('3 month') ? '3-months' :
    selectedPlanName?.toLowerCase().includes('6 month') ? '6-months' :
    selectedPlanName?.toLowerCase().includes('1 year') || selectedPlanName?.toLowerCase().includes('12 month') ? '1-year' :
    'monthly-promo'
  );

  const planInfo = PLAN_DETAILS[planKey] || PLAN_DETAILS['monthly-promo'];

  const [email, setEmail] = useState('customer@bizpilot.app');
  const [name, setName] = useState('BizPilot Subscriber');
  const [phone, setPhone] = useState('9999999999');
  const [isLoading, setIsLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<{ orderId: string; sessionId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sdkLaunched, setSdkLaunched] = useState(false);

  const startCheckout = async (userEmail?: string) => {
    setErrorMessage(null);
    setIsLoading(true);

    const targetEmail = (userEmail || email).trim() || 'customer@bizpilot.app';

    try {
      const result = await initiateCashfreeCheckout({
        planId: planInfo.id,
        planName: planInfo.name,
        customerEmail: targetEmail,
        customerName: name.trim() || 'BizPilot Subscriber',
        customerPhone: phone.trim() || '9999999999',
      });

      if (!result.success) {
        setErrorMessage(
          result.error ||
          'Unable to initialize Cashfree payment. Please verify gateway settings or try again.'
        );
        setIsLoading(false);
        return;
      }

      setOrderCreated({
        orderId: result.order_id || '',
        sessionId: result.payment_session_id,
      });
      setSdkLaunched(true);
      setIsLoading(false);

      if (onNotify) {
        onNotify(`Cashfree checkout opened for ${planInfo.name}`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during checkout setup.');
      setIsLoading(false);
    }
  };

  // Automatically trigger /api/create-order and Cashfree Web Checkout SDK when plan is selected
  useEffect(() => {
    if (isOpen) {
      setOrderCreated(null);
      setSdkLaunched(false);
      setErrorMessage(null);
      startCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, planKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await startCheckout(email);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      id="cashfree-checkout-modal"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Cashfree Secure Checkout
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full text-blue-100 hover:text-white hover:bg-blue-800/60 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Selected Plan Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Selected Plan
              </span>
              {planInfo.badge && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${planInfo.badgeColor}`}>
                  {planInfo.badge}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900">{planInfo.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{planInfo.subtext}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900 font-mono">{planInfo.price}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
              {planInfo.termNote}
            </div>
          </div>

          {/* Included Features */}
          <div className="mb-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unlocked Immediately:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profit Margin Calculator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Invoice Generator (PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Price Quote Generator</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Client Proposal Builder</span>
              </div>
            </div>
          </div>

          {/* SDK active / Order status card */}
          {sdkLaunched && orderCreated && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block font-black text-sm text-emerald-950 mb-1">
                    Cashfree Checkout Active
                  </strong>
                  <p className="text-emerald-800 leading-relaxed">
                    Order <span className="font-mono font-semibold">{orderCreated.orderId}</span> initiated. The Cashfree Web Checkout SDK modal is displayed to securely complete your payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="block font-bold mb-0.5">Checkout Notice:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="checkout-email-input" className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="checkout-email-input"
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Receipt and instant entitlement confirmation will be delivered to this email.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="checkout-name-input"
                    type="text"
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="checkout-phone-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    disabled={isLoading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9999999999"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                id="btn-confirm-cashfree-checkout"
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to Cashfree Gateway...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Pay {planInfo.price} via Cashfree</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Trust and Guarantee Badges */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Cashfree Verified Gateway</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>256-bit Encrypted</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Instant Tool Activation</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
