import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, FileText, Calculator, ShieldCheck, Printer, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { useRouter, Link } from '../utils/router';
import { useSubscription } from '../context/SubscriptionContext';
import { verifyPayment } from '../services/cashfreeClient';
import { CashfreeVerificationResponse } from '../types';

export const PaymentSuccessPage: React.FC = () => {
  const { searchParams, navigate } = useRouter();
  const { applyVerifiedEntitlement, subscription } = useSubscription();

  const orderId = searchParams?.get?.('order_id') ||
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('order_id') : null) || '';
  const planId = searchParams?.get?.('plan_id') ||
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plan_id') : null) || '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationData, setVerificationData] = useState<CashfreeVerificationResponse | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const runVerification = async () => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyPayment(orderId, planId || undefined);
      setVerificationData(res);
      if (res.verified && res.entitlement) {
        applyVerifiedEntitlement(res.entitlement);
      }
    } catch {
      setVerificationData({
        verified: false,
        order_id: orderId,
        order_status: 'UNKNOWN',
        error: 'Unable to reach payment verification server. Please refresh this page.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runVerification();
  }, [orderId, planId, retryCount]);

  const copyOrderId = () => {
    if (!orderId) return;
    navigator.clipboard?.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  // State 1: No Order ID provided (direct landing)
  if (!orderId && !subscription.isPremium) {
    return (
      <div className="py-16 md:py-24 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Payment Verification</h1>
          <p className="mt-2 text-sm text-slate-600">
            No active order identifier was detected in this session. If you recently completed a payment, please ensure the complete confirmation link was used.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              View Pricing Plans
            </Link>
            <Link
              href="/tools"
              className="py-3 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors"
            >
              Use Free Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Loading verification
  if (isLoading) {
    return (
      <div className="py-20 md:py-32 bg-slate-50 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Verifying Your Payment
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Securely confirming your transaction with Cashfree Payments. Please do not close this window...
          </p>
          <div className="mt-4 text-xs font-mono text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
            Order: {orderId}
          </div>
        </div>
      </div>
    );
  }

  // State 3: Payment Verified & Active
  const isSuccess = verificationData?.verified || subscription.isPremium;

  if (isSuccess) {
    const formattedAmount = verificationData?.amount
      ? `$${verificationData.amount.toFixed(2)} ${verificationData.currency || 'USD'}`
      : '$5.00 USD';
    const planName = verificationData?.plan_name || subscription.planName || 'BizPilot Premium';
    const expiryDate = verificationData?.entitlement?.expiresAt
      ? new Date(verificationData.entitlement.expiresAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : subscription.expiresAt
      ? new Date(subscription.expiresAt).toLocaleDateString()
      : 'Active';

    return (
      <div className="py-12 md:py-20 bg-slate-50 min-h-[80vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>/</li>
              <li className="text-slate-900 font-semibold" aria-current="page">
                Payment Confirmation
              </li>
            </ol>
          </nav>

          {/* Main Success Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
            {/* Top Success Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-4 ring-8 ring-white/10 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Payment Confirmed • All Premium Tools Unlocked</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome to BizPilot Premium!
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-50 max-w-lg mx-auto">
                Thank you for your purchase. Your payment was verified through Cashfree Payments, and your full suite access is now active.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Transaction Receipt
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer print:hidden"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6">
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">Plan Subscribed</span>
                  <span className="font-extrabold text-slate-900 text-base">{planName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">Amount Paid</span>
                  <span className="font-extrabold text-emerald-700 text-base font-mono">{formattedAmount}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">Order Reference ID</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs font-bold text-slate-800 break-all">{orderId}</span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors print:hidden cursor-pointer"
                      title="Copy Order ID"
                      aria-label="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">Access Valid Through</span>
                  <span className="font-bold text-slate-900">{expiryDate}</span>
                </div>

                {verificationData?.customer_email && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">Customer Receipt Email</span>
                    <span className="font-semibold text-slate-800">{verificationData.customer_email}</span>
                  </div>
                )}
              </div>

              {/* Unlocked Premium Tools Showcase */}
              <div className="mb-8">
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Your Unlocked Premium Tool Suite:</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/tools/invoice-generator"
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Invoice Generator</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Create and export branded client PDF invoices</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1 shrink-0" />
                  </Link>

                  <Link
                    href="/tools/quote-generator"
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>Price Quote Generator</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Itemized cost estimates with client terms</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1 shrink-0" />
                  </Link>

                  <Link
                    href="/tools/proposal-generator"
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Proposal Builder</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Complete project deliverables and terms</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1 shrink-0" />
                  </Link>

                  <Link
                    href="/tools/profit-margin-calculator"
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <Calculator className="w-4 h-4 text-amber-600" />
                        <span>Profit Margin Calculator</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Calculate exact gross margins and markups</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors mt-1 shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 print:hidden">
                <Link
                  href="/tools/invoice-generator"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Start with Invoice Generator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/tools"
                  className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors text-center"
                >
                  Browse All 8 Tools
                </Link>
              </div>

              {/* Security & Guarantee footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by 256-bit encryption • Cashfree Certified Payment Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Payment Pending or Failed
  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Payment Status: {verificationData?.order_status || 'Incomplete'}
          </h2>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            {verificationData?.error ||
              'Your transaction could not be automatically confirmed as completed. If you were charged, please allow up to 2 minutes for bank clearing or retry verification.'}
          </p>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 text-left">
            <div>Order ID: <span className="font-bold text-slate-900">{orderId}</span></div>
            <div>Status: <span className="font-bold uppercase text-amber-700">{verificationData?.order_status || 'PENDING'}</span></div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Status Again</span>
            </button>
            <Link
              href="/pricing"
              className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors text-center"
            >
              Return to Pricing Plans
            </Link>
          </div>

          <div className="mt-6 text-[11px] text-slate-400">
            Need help? Contact support with your Order ID at support@bizpilot.app
          </div>
        </div>
      </div>
    </div>
  );
};
