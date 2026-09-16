import React from 'react';
import { ArrowLeft, RefreshCw, Shield, HelpCircle } from 'lucide-react';
import { Link } from '../utils/router';

export const PaymentCancelledPage: React.FC = () => {
  return (
    <div className="py-16 md:py-24 bg-slate-50 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <Shield className="w-8 h-8 text-slate-600" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Checkout Was Not Completed
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            No charges were made to your account. You can resume checkout at any time, or continue using our 4 free core business tools forever.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 text-left space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Did something go wrong during payment?</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Cashfree supports major credit/debit cards, UPI, and netbanking. If a bank error occurred, you can try again with a different payment method.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Checkout Again</span>
            </Link>
            <Link
              href="/tools"
              className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Free Tools</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
