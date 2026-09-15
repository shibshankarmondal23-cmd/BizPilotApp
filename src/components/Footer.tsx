import React from 'react';
import { Compass, Shield } from 'lucide-react';
import { Link } from '../utils/router';

interface FooterProps {
  onNavigatePricing?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePricing }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-blue-500 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">BizPilot</span>
            </Link>

            <p className="text-sm font-semibold text-slate-300">
              “Your Business, Simplified.”
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              All-in-one business productivity toolbox that helps freelancers, solopreneurs, creators, consultants, and small businesses calculate, generate documents, and work more efficiently.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>In-browser local processing • Zero data selling</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools"
                  className="hover:text-white transition-colors"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  onClick={(e) => {
                    if (onNavigatePricing && window.location.pathname === '/') {
                      e.preventDefault();
                      onNavigatePricing();
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Legal &amp; Compliance
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>

            <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
              Calculators and business templates provide standard estimates for informational purposes only and do not constitute certified tax, legal, or financial advice.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BizPilot. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for independent business operators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
