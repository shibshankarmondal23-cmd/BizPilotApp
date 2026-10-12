import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueProposition } from './components/ValueProposition';
import { ToolSearchAndFilter } from './components/ToolSearchAndFilter';
import { FreeToolsSection } from './components/FreeToolsSection';
import { PremiumToolsSection } from './components/PremiumToolsSection';
import { TrustSection } from './components/TrustSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

import { PremiumModal } from './components/modals/PremiumModal';
import { PaddleCheckoutModal } from './components/modals/PaddleCheckoutModal';
import { InfoModal } from './components/modals/InfoModal';
import { Toast } from './components/Toast';
import { initializePaddle } from './services/paddleClient';

import { ALL_TOOLS } from './data/toolsData';
import { ToolCategory, InfoModalType } from './types';
import { RouterProvider, useRouter, Link } from './utils/router';
import { updateMetaTags, getHomepageSchema, getPageSchema } from './utils/seo';
import { TOOL_SEO_PAGES } from './data/seoData';
import { ToolPage } from './pages/ToolPage';
import { ToolsHubPage } from './pages/ToolsHubPage';
import { LegalPage, LegalPageType } from './pages/LegalPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';
import { SubscriptionProvider } from './context/SubscriptionContext';

function AppContent() {
  const { pathname, navigate } = useRouter();

  // Search & Filter State (for Homepage)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');

  // Modals state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [selectedPremiumTool, setSelectedPremiumTool] = useState<string | undefined>(undefined);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<string | undefined>(undefined);

  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  // Active free tool selection
  const [activeFreeToolId, setActiveFreeToolId] = useState<string>('percentage-calc');

  // Active premium tool selection
  const [activePremiumToolId, setActivePremiumToolId] = useState<string>('invoice-gen');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-initialize Paddle.js for instant checkout overlay launch
  useEffect(() => {
    initializePaddle().catch(() => {
      // Non-fatal if offline
    });
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Filter tools based on query and category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        tool.name.toLowerCase().includes(q) ||
        tool.tagline.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenUpgradeModal = () => {
    if (normalizedPath === '/') {
      scrollToSection('generators-section');
    } else {
      navigate('/tools');
    }
  };

  const handleExploreFree = () => {
    scrollToSection('tools-section');
  };

  const handleValuePropSelectCategory = (cat: 'Business' | 'Calculators' | 'Productivity' | 'Marketing') => {
    setSelectedCategory(cat);
    scrollToSection('tools-filter-bar');
  };

  // Route matching logic
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  // Handle SEO metadata for homepage and pricing route
  useEffect(() => {
    if (normalizedPath === '/') {
      updateMetaTags({
        title: 'BizPilot — Free Business Tools for Freelancers & Small Businesses',
        description: 'BizPilot provides practical business calculators, productivity tools, invoice, quote and proposal generators for freelancers, solopreneurs and small businesses.',
        canonicalPath: '/',
        schema: getHomepageSchema(),
      });
    } else if (normalizedPath === '/pricing') {
      updateMetaTags({
        title: 'BizPilot Tools — Free Business Tools & Generators',
        description: 'Explore BizPilot free business calculators, productivity utilities, and client document generators with zero fees.',
        canonicalPath: '/tools',
        schema: getPageSchema(
          'BizPilot Tools',
          '/tools',
          'Explore BizPilot free business tools and calculators designed for freelancers and small businesses.'
        ),
      });
    } else if (normalizedPath === '/payment-success' || normalizedPath === '/payment-cancelled') {
      updateMetaTags({
        title: 'BizPilot — Free Business Tools',
        description: 'BizPilot provides free in-browser business calculators and document generators.',
        canonicalPath: '/tools',
      });
    }
  }, [normalizedPath]);

  // Handle hash scrolling if navigating with anchor
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = 80;
          const elPosition = el.getBoundingClientRect().top;
          const offsetPosition = elPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Determine which page content to render
  const renderMainContent = () => {
    // 1. Dedicated Tool Route: /tools/:toolSlug
    if (normalizedPath.startsWith('/tools/') && normalizedPath !== '/tools') {
      const slug = normalizedPath.replace(/^\/tools\//, '');
      const toolConfig = TOOL_SEO_PAGES[slug];
      if (toolConfig) {
        return (
          <ToolPage
            toolConfig={toolConfig}
            onNotify={showNotification}
            onOpenUpgradeModal={handleOpenUpgradeModal}
          />
        );
      }
      // If tool slug not found, render tools hub directory
      return <ToolsHubPage onOpenUpgradeModal={handleOpenUpgradeModal} />;
    }

    // 2. Tools Hub Catalog: /tools
    if (normalizedPath === '/tools') {
      return <ToolsHubPage onOpenUpgradeModal={handleOpenUpgradeModal} />;
    }

    // 3. Legal & Information Pages: /privacy, /terms, /disclaimer, /contact, /about
    if (['/privacy', '/terms', '/disclaimer', '/contact', '/about'].includes(normalizedPath)) {
      const pageType = normalizedPath.replace('/', '') as LegalPageType;
      return <LegalPage type={pageType} onNotify={showNotification} />;
    }

    // 4. Pricing / Payment Return Routes: Route to Tools directory
    if (['/pricing', '/payment-success', '/payment-cancelled'].includes(normalizedPath)) {
      return <ToolsHubPage onOpenUpgradeModal={handleOpenUpgradeModal} />;
    }

    // 5. Default: Full Homepage
    return (
      <>
        {/* Hero Section */}
        <Hero
          onExploreFree={handleExploreFree}
          onUnlockPremium={() => handleOpenUpgradeModal()}
        />

        {/* Value Proposition (4 Cards) */}
        <ValueProposition onSelectCategory={handleValuePropSelectCategory} />

        {/* Filter & Search Bar + Tools Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <ToolSearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalCount={ALL_TOOLS.length}
            filteredCount={filteredTools.length}
          />
        </div>

        {/* Free Tools Section (Working interactive tools) */}
        <FreeToolsSection
          filteredTools={filteredTools}
          onNotify={showNotification}
          activeToolId={activeFreeToolId}
          onSelectTool={setActiveFreeToolId}
        />

        {/* Document Generators & Margin Analysis */}
        <PremiumToolsSection
          filteredTools={filteredTools}
          onOpenUpgradeModal={handleOpenUpgradeModal}
          activePremiumToolId={activePremiumToolId}
          onSelectPremiumTool={setActivePremiumToolId}
          onNotify={showNotification}
        />

        {/* Trust Section */}
        <TrustSection />

        {/* FAQ Section (9 accordions) */}
        <FaqSection />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden">
      {/* 1. Header / Navigation */}
      <Navbar
        onOpenPremium={() => handleOpenUpgradeModal()}
        onExploreFree={() => {
          if (normalizedPath === '/') {
            handleExploreFree();
          } else {
            navigate('/tools');
          }
        }}
      />

      <main className="flex-1" id="main-content">
        {renderMainContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onViewPlans={() => {
          setIsPremiumModalOpen(false);
          handleOpenUpgradeModal();
        }}
        selectedToolName={selectedPremiumTool}
      />

      <PaddleCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedPlanName={selectedPlanForCheckout}
        onNotify={showNotification}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </RouterProvider>
  );
}
