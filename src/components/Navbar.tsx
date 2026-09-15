import React, { useState, useEffect } from 'react';
import { Compass, Menu, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useRouter } from '../utils/router';
import { useSubscription } from '../context/SubscriptionContext';

interface NavbarProps {
  onOpenPremium: () => void;
  onExploreFree: () => void;
  onOpenAbout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPremium,
  onExploreFree,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname, navigate } = useRouter();
  const { isPremium, status, tierLabel, isCancelled, isExpired } = useSubscription();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, fallbackPath: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const navOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        return;
      }
    }
    navigate(fallbackPath);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo & Tagline */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-1"
            id="brand-logo-link"
            aria-label="BizPilot Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  BizPilot
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tracking-tight leading-none hidden sm:inline">
                Your Business, Simplified.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation: Tools, Premium, Pricing, About */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <Link
              href="/tools"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  handleNavClick('tools-section', '/tools');
                }
              }}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2"
              id="nav-link-tools"
            >
              Tools
            </Link>
            <button
              type="button"
              onClick={() => handleNavClick('premium-tools-section', '/#premium-tools-section')}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2 flex items-center gap-1.5 cursor-pointer"
              id="nav-link-premium"
            >
              <span>Premium</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-900 rounded-md">
                PREMIUM
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('comparison-section', '/#comparison-section')}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2 cursor-pointer"
              id="nav-link-compare"
            >
              Free vs Premium
            </button>
            <Link
              href="/pricing"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  handleNavClick('pricing-section', '/pricing');
                }
              }}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2"
              id="nav-link-pricing"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2"
              id="nav-link-about"
            >
              About
            </Link>
          </nav>

          {/* Right Side Desktop CTA: Start Premium or Entitlement Status */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('tools-section', '/tools')}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              id="nav-cta-explore-free"
            >
              Explore Free Tools
            </button>

            {isPremium ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tierLabel} • Active</span>
              </div>
            ) : isCancelled ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Cancelled (Active)</span>
              </div>
            ) : isExpired ? (
              <button
                type="button"
                onClick={onOpenPremium}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Expired • Renew Plan</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenPremium}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl shadow-xs transition-all hover:shadow-sm cursor-pointer"
                id="nav-cta-start-premium"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Premium ($5 Promo)</span>
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {isPremium ? (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenPremium}
                className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>$5 Promo</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex flex-col space-y-1">
            <Link
              href="/tools"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  handleNavClick('tools-section', '/tools');
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Tools
            </Link>
            <button
              type="button"
              onClick={() => handleNavClick('premium-tools-section', '/#premium-tools-section')}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer"
            >
              <span>Premium</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded-md">
                PREMIUM
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('comparison-section', '/#comparison-section')}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              Free vs Premium
            </button>
            <Link
              href="/pricing"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  handleNavClick('pricing-section', '/pricing');
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left min-h-[44px] px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              Contact
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleNavClick('tools-section', '/tools')}
              className="w-full min-h-[44px] py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center cursor-pointer"
            >
              Explore Free Tools
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPremium();
              }}
              className="w-full min-h-[44px] py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Start Premium — First Month $5</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
