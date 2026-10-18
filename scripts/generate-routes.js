import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://biz-pilot-app.vercel.app';

const TOOL_ROUTES = [
  {
    route: '/tools/image-resizer',
    name: 'Image Resizer',
    title: 'Free Image Resizer — Resize Photos Locally in Browser | BizPilot',
    description: 'Resize, scale, and compress images directly in your browser. 100% private client-side processing with aspect-ratio locking and JPG, PNG, WebP export.',
    h1: 'In-Browser Image Resizer & Compressor',
    category: 'Productivity',
    introduction: 'Resize and optimize images for business websites, client presentations, social banners, and invoice logos without sending confidential graphics to third-party cloud servers. Runs 100% locally in your browser with aspect ratio locking and lossless canvas processing.',
    howToUseSteps: [
      'Drag and drop an image (PNG, JPG, WebP) or click to browse from your device.',
      'Choose an exact target width/height or select a preset percentage scale (25%, 50%, 75%, 100%).',
      'Toggle aspect ratio locking if needed, choose your output format (PNG, JPEG, WebP), and click "Download Resized Image".'
    ],
    faqs: [
      {
        question: 'Are my images uploaded to external servers for resizing?',
        answer: 'No. BizPilot uses the modern HTML5 Canvas API in your web browser. Your private pictures and client assets never leave your computer.'
      },
      {
        question: 'Which file formats are supported for output?',
        answer: 'You can export in PNG (best for logos and graphics with transparency), JPEG (best for photos), or modern WebP (optimized for web performance).'
      },
      {
        question: 'Will resizing reduce image quality?',
        answer: 'You have direct control over quality via the compression slider. For PNG files, lossless compression is preserved. For JPEG and WebP, you can tune quality from 10% to 100%.'
      }
    ],
    relatedTools: [
      {
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Resize your business logo for clean placement in client billing documents.'
      },
      {
        name: 'Word Counter',
        route: '/tools/word-counter',
        reason: 'Pair your optimized images with concise, polished captions and copy.'
      },
      {
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Prepare optimized visual diagrams and brand assets for your project proposals.'
      }
    ]
  },
  {
    route: '/tools/invoice-generator',
    name: 'Invoice Generator',
    title: 'Free Invoice Generator — Create & Download PDF Invoices | BizPilot',
    description: 'Create and download professional PDF invoices for clients in 60 seconds. Add line items, discounts, taxes, and payment instructions. No sign-up required.',
    h1: 'Free PDF Invoice Generator',
    category: 'Business',
    introduction: 'Generate clean, print-ready PDF invoices for your freelance clients and business customers directly in your browser. Add itemized services, apply custom discounts and taxes, specify bank payment details, and export instantly with zero account registration.',
    howToUseSteps: [
      'Fill in your business details (name, email, address, phone) and your client contact information.',
      'Specify invoice number, invoice date, due date, and currency.',
      'Add line items with descriptions, quantities, and rates. Subtotals and grand totals compute automatically.',
      'Click "Download PDF" to immediately export a clean, client-ready PDF invoice.'
    ],
    faqs: [
      {
        question: 'Do I need to sign up or create an account to download an invoice?',
        answer: 'No sign-up is required. You can generate and download customized PDF invoices directly from your browser in seconds.'
      },
      {
        question: 'Are my client details or financial amounts stored on a database?',
        answer: 'No. Everything stays in your browser memory while you work on the page and generates directly into a PDF download. We do not store your client records.'
      },
      {
        question: 'Can I customize the currency and tax percentage?',
        answer: 'Yes! Choose from USD ($), EUR (€), GBP (£), CAD (CA$), and AUD (AU$), and enter your local sales tax or VAT percentage alongside any agreed discount.'
      }
    ],
    relatedTools: [
      {
        name: 'Quote Generator',
        route: '/tools/quote-generator',
        reason: 'Send preliminary cost estimates before converting agreed scopes to finalized invoices.'
      },
      {
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Determine your true billable hourly rates before populating invoice line items.'
      },
      {
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Win contracts with structured proposals, then bill your milestones with this invoice tool.'
      }
    ]
  },
  {
    route: '/tools/percentage-calculator',
    name: 'Percentage Calculator',
    title: 'Percentage Calculator — Quick Percent Amounts & Changes | BizPilot',
    description: 'Calculate percentages of any number, calculate percentage increases or decreases, and calculate discounts and tax amounts instantly in your browser.',
    h1: 'Free Online Percentage Calculator',
    category: 'Calculators',
    introduction: 'Solve common percentage calculations for business proposals, client invoices, sales tax, and profit markups in seconds. Choose from three precision modes: finding a percentage of a number, calculating percentage increase or decrease between values, or applying direct discounts and markups.',
    howToUseSteps: [
      'Choose your calculation mode: Percentage of a Number, Percentage Change, or Add/Subtract Percentage.',
      'Enter your values in the clear input fields. Results calculate instantly in real time.',
      'Copy the calculated answer or full formula expression with one click to paste into your documents.'
    ],
    faqs: [
      {
        question: 'How do I calculate a percentage discount on a client fee?',
        answer: 'Switch to the "Add/Discount %" tab. Enter your original price and the discount percentage (for example, 15%). The calculator will compute both the exact deduction amount and the final discounted price instantly.'
      },
      {
        question: 'Can I calculate sales tax and markups?',
        answer: 'Yes. In the "Add/Discount %" tab, select "Add" to see the resulting total with sales tax or markup added.'
      }
    ],
    relatedTools: [
      {
        name: 'Profit Margin Calculator',
        route: '/tools/profit-margin-calculator',
        reason: 'Determine exact markup percentages and gross margin on products or client services.'
      },
      {
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Factor in business expenses, tax margins, and billable ratios into your hourly fee.'
      }
    ]
  },
  {
    route: '/tools/profit-margin-calculator',
    name: 'Profit Margin Calculator',
    title: 'Profit Margin Calculator — Markup & Gross Margin | BizPilot',
    description: 'Calculate gross profit margin, markup percentage, and profit amounts for freelance projects, retail goods, and digital client services.',
    h1: 'Free Profit Margin & Markup Calculator',
    category: 'Calculators',
    introduction: 'Calculate exact gross margins, net profit amounts, and markup multipliers for your client projects and business services. Enter your cost of goods or contractor expenses alongside your revenue to determine healthy profitability targets.',
    howToUseSteps: [
      'Enter your total cost (direct materials, contractor fees, software licenses).',
      'Enter your selling price or client revenue figure.',
      'Instantly review your gross profit in dollars, gross profit margin %, and markup multiplier.'
    ],
    faqs: [
      {
        question: 'What is the difference between profit margin and markup?',
        answer: 'Profit margin is the percentage of total revenue that remains as profit ((Revenue - Cost) / Revenue × 100). Markup is the percentage added on top of your original cost to arrive at the selling price ((Revenue - Cost) / Cost × 100).'
      }
    ],
    relatedTools: [
      {
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Turn profitable service rates into structured client invoices.'
      },
      {
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Compute your baseline labor costs before setting profit margins.'
      }
    ]
  },
  {
    route: '/tools/hourly-rate-calculator',
    name: 'Hourly Rate Calculator',
    title: 'Hourly Rate Calculator — Set Profitable Client Rates | BizPilot',
    description: 'Calculate your ideal freelance hourly rate based on target income, business expenses, billable client hours, and tax deductions.',
    h1: 'Freelance Hourly Rate Calculator',
    category: 'Calculators',
    introduction: 'Determine what you must charge per billable hour to achieve your net personal take-home income goal after factoring in non-billable administrative time, business overhead, paid vacation weeks, and self-employment taxes.',
    howToUseSteps: [
      'Enter your desired net annual income.',
      'Enter your annual business operating expenses (software subscriptions, equipment, insurance).',
      'Set your target billable hours per week and desired vacation weeks per year.',
      'View your target minimum hourly billable rate instantly.'
    ],
    faqs: [
      {
        question: 'Why should freelancers not just divide salary by 2,000 hours?',
        answer: 'Freelancers spend 20% to 40% of their time on unbillable administration (marketing, client communication, invoicing). In addition, freelancers must pay self-employment taxes and fund their own benefits.'
      }
    ],
    relatedTools: [
      {
        name: 'Profit Margin Calculator',
        route: '/tools/profit-margin-calculator',
        reason: 'Double-check your profit margins when quoting fixed-fee retainers or package deals.'
      },
      {
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Bill clients accurately using your verified target hourly rate.'
      }
    ]
  },
  {
    route: '/tools/word-counter',
    name: 'Word Counter',
    title: 'Word Counter — Real-Time Text, Character & Reading Metrics | BizPilot',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading and speaking time in real time with our free browser text counter.',
    h1: 'Free Online Word & Character Counter',
    category: 'Productivity',
    introduction: 'Analyze document length, character volume, sentence counts, and reading or speaking durations in real time. Perfect for marketing copywriters, consultants reviewing proposal briefs, and students.',
    howToUseSteps: [
      'Type or paste your text into the clean editing workspace.',
      'Metrics update instantly: total words, characters (with & without spaces), sentences, and paragraphs.',
      'Check estimated speaking and reading times for presentations and speeches.'
    ],
    faqs: [
      {
        question: 'Does the Word Counter store my text on a server?',
        answer: 'No. All text parsing happens directly inside your browser memory using JavaScript regular expressions. Your writing remains private.'
      }
    ],
    relatedTools: [
      {
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Polish proposal executive summaries for maximum impact and readability.'
      },
      {
        name: 'Image Resizer',
        route: '/tools/image-resizer',
        reason: 'Format visual assets alongside your finalized written copy.'
      }
    ]
  },
  {
    route: '/tools/quote-generator',
    name: 'Quote Generator',
    title: 'Free Business Quote Generator — PDF Quote Template | BizPilot',
    description: 'Free business quote generator for freelancers and contractors. Create customizable price quote templates with line items, terms, and instant PDF download.',
    h1: 'Free Business Quote Generator',
    category: 'Business',
    introduction: 'Create professional price quotes and project estimates in minutes with BizPilot\'s free business quote generator. Customize clean price quote templates with itemized services, tax rates, validity windows, and approval signature blocks—all generated privately in your browser with instant PDF export.',
    howToUseSteps: [
      'Enter your business details, client contact info, quote number, and date of issue.',
      'Set a quote validity period (e.g. 14–30 days) to lock in rates and protect against scope creep.',
      'Add itemized goods or services with descriptions, quantities, and unit rates. Subtotals and taxes calculate automatically.',
      'Specify acceptance terms, deposit expectations, or client project notes.',
      'Download your client-ready PDF quote complete with an approval signature block.'
    ],
    guideSection: {
      title: 'Guide: How to Create Professional Business Quotes',
      items: [
        {
          heading: 'What Every Business Quote Should Include',
          description: 'A complete quote should feature your business branding, client contact info, a unique quote number, issue and expiration dates, an itemized list of deliverables with unit rates, subtotal/tax/discount calculations, and explicit acceptance terms with a client signature line.'
        },
        {
          heading: 'Quote vs. Estimate vs. Invoice: Key Differences',
          description: 'A price quote is a fixed-price commitment agreed upon before work starts and becomes binding upon client signature. An estimate is a rough, non-binding ballpark figure when exact project requirements are uncertain. An invoice is a payment demand issued after deliverables or milestones are fulfilled.'
        },
        {
          heading: 'Why Expiration Dates Protect Your Business',
          description: 'Setting a 14 to 30 day validity window on price quotes protects freelancers and contractors from rising third-party expenses, material inflation, and scheduling conflicts, while giving prospects a clear timeline to commit to the project.'
        }
      ]
    },
    faqs: [
      {
        question: 'What is the difference between a quote and an invoice?',
        answer: 'A price quote is sent before starting work to outline estimated costs, deliverables, and payment terms for client agreement. An invoice is issued after work is completed (or at agreed project milestones) to collect payment with remittance instructions.'
      },
      {
        question: 'What should a professional business quote include?',
        answer: 'A professional business quote should include your company details, client contact information, unique quote number, issue and expiration dates, itemized services with quantities and unit prices, subtotal, applicable taxes or discounts, and a formal client approval signature section.'
      },
      {
        question: 'How long should a business price quote remain valid?',
        answer: 'Most independent contractors and businesses specify a validity window of 14 to 30 days. Setting an expiration date protects you against supplier price changes, material inflation, and scope drift before a project is confirmed.'
      },
      {
        question: 'Does this price quote template include a client signature line?',
        answer: 'Yes. BizPilot\'s quote template automatically formats a formal acceptance section with client signature and date fields for approval before project commencement.'
      },
      {
        question: 'Can I customize this price quote template with my own currency and terms?',
        answer: 'Yes. You can choose from major currencies (USD, EUR, GBP, CAD, AUD), apply custom sales tax or VAT rates, include promotional discounts, and specify milestone payment terms.'
      },
      {
        question: 'Are my quote details, rates, or client information stored on a server?',
        answer: 'No. All calculations, data entry, and PDF exports are processed 100% locally inside your web browser. No confidential client names, project scopes, or pricing figures are stored on external databases.'
      }
    ],
    relatedTools: [
      {
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Expand your quote into a full strategic project proposal with detailed milestones.'
      },
      {
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Turn approved quotes into deposit invoices or final payment requests.'
      },
      {
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Use your target hourly billable rate to calculate itemized labor hours accurately.'
      }
    ]
  },
  {
    route: '/tools/proposal-generator',
    name: 'Proposal Generator',
    title: 'Free Proposal Generator — Win Client Project Contracts | BizPilot',
    description: 'Build comprehensive client project proposals with executive summaries, scope of work, deliverables, investment pricing, and signing lines.',
    h1: 'Client Project Proposal Generator',
    category: 'Business',
    introduction: 'Draft structured, client-winning business proposals in minutes. Define executive summaries, problem statements, detailed deliverables, milestones, and formal agreement sign-off blocks formatted for print and PDF export.',
    howToUseSteps: [
      'Enter your proposal title, client name, and company information.',
      'Define project objectives, scope of work, and phased deliverables.',
      'Outline milestone pricing, payment schedule, and terms.',
      'Download a presentation-ready client proposal PDF.'
    ],
    faqs: [
      {
        question: 'Is this proposal legally binding?',
        answer: 'When signed by both parties, project proposals that contain clear scopes, fees, and acceptance terms can serve as contracts or work orders.'
      }
    ],
    relatedTools: [
      {
        name: 'Quote Generator',
        route: '/tools/quote-generator',
        reason: 'Generate itemized cost schedules to include with your proposal.'
      },
      {
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Bill agreed project deposit amounts upon proposal signing.'
      }
    ]
  }
];

const STATIC_PAGES = [
  {
    route: '/tools',
    name: 'Tools Directory',
    title: 'Business Tools & Calculators for Freelancers & Small Business | BizPilot',
    description: 'Explore BizPilot tools: free business calculators (percentage, hourly rate, word counter, image resizer) and business document generators (profit margin, invoice, quote, and proposal generators).'
  },
  {
    route: '/about',
    name: 'About BizPilot',
    title: 'About BizPilot — Lightweight Business Utilities | BizPilot',
    description: 'Learn about BizPilot mission to provide fast, privacy-focused business calculators and client document generators for independent operators.'
  },
  {
    route: '/contact',
    name: 'Contact BizPilot',
    title: 'Contact BizPilot — Get in Touch & Feedback | BizPilot',
    description: 'Have questions, feedback, or a feature request for BizPilot? Contact our support team directly.'
  },
  {
    route: '/privacy',
    name: 'Privacy Policy',
    title: 'Privacy Policy — In-Browser Data Processing | BizPilot',
    description: 'Read the BizPilot Privacy Policy. Learn how our calculators and document generators process data 100% locally in your browser with zero tracking.'
  },
  {
    route: '/terms',
    name: 'Terms of Use',
    title: 'Terms of Use — Service Terms & Guidelines | BizPilot',
    description: 'Review the terms of use for BizPilot business calculation and document generation tools.'
  },
  {
    route: '/disclaimer',
    name: 'Disclaimer',
    title: 'Disclaimer — Financial & Legal Information Notice | BizPilot',
    description: 'Important legal and financial disclaimer regarding business calculations, estimates, and document templates provided on BizPilot.'
  }
];

function generateToolSchema(tool, canonicalUrl) {
  const graph = [
    {
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#app`,
      'name': tool.name,
      'url': canonicalUrl,
      'applicationCategory': tool.category === 'Calculators' ? 'BusinessApplication' : 'UtilitiesApplication',
      'operatingSystem': 'Any modern web browser',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'description': tool.description,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${DOMAIN}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Tools',
          'item': `${DOMAIN}/tools`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tool.name,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      'mainEntity': tool.faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

function generateToolHtml(tool, canonicalUrl) {
  const howToHtml = tool.howToUseSteps && tool.howToUseSteps.length > 0
    ? `
      <section aria-labelledby="how-to-use-heading" class="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div class="flex items-center gap-2 mb-4">
          <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">💡</span>
          <h2 id="how-to-use-heading" class="text-lg font-bold text-slate-900 tracking-tight">How to Use the ${tool.name}</h2>
        </div>
        <ol class="space-y-3 mt-4 text-sm text-slate-600">
          ${tool.howToUseSteps.map((step, idx) => `
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs mt-0.5">${idx + 1}</span>
              <span class="leading-relaxed">${step}</span>
            </li>
          `).join('')}
        </ol>
      </section>
    `
    : '';

  const guideHtml = tool.guideSection
    ? `
      <section aria-labelledby="guide-heading" class="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div class="flex items-center gap-2 mb-6">
          <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-50 text-teal-600 font-bold text-xs">📚</span>
          <h2 id="guide-heading" class="text-xl font-bold text-slate-900 tracking-tight">${tool.guideSection.title}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${tool.guideSection.items.map((item) => `
            <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/70">
              <h3 class="text-sm font-bold text-slate-900 mb-2">${item.heading}</h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${item.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `
    : '';

  const faqHtml = tool.faqs && tool.faqs.length > 0
    ? `
      <section aria-labelledby="faq-heading" class="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div class="flex items-center gap-2 mb-6">
          <h2 id="faq-heading" class="text-xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div class="space-y-4">
          ${tool.faqs.map((faq) => `
            <div class="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
              <h3 class="text-base font-bold text-slate-900 mb-2">${faq.question}</h3>
              <p class="text-sm text-slate-600 leading-relaxed">${faq.answer}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `
    : '';

  const relatedHtml = tool.relatedTools && tool.relatedTools.length > 0
    ? `
      <section aria-labelledby="related-tools-heading" class="mt-12 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 id="related-tools-heading" class="text-xl font-bold text-slate-900 tracking-tight">Related BizPilot Tools</h2>
            <p class="text-xs text-slate-500 mt-0.5">Combine these tools to streamline your business workflow.</p>
          </div>
          <a href="/tools" class="text-xs font-bold text-blue-600 hover:text-blue-700">View All Tools →</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${tool.relatedTools.map((rel) => `
            <a href="${rel.route}" class="group flex flex-col justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div>
                <span class="text-sm font-bold text-slate-900 group-hover:text-blue-600">${rel.name}</span>
                <p class="text-xs text-slate-500 leading-relaxed mt-1">${rel.reason}</p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Open ${rel.name} →</span>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
    `
    : '';

  return `
    <div class="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <!-- Breadcrumb Bar -->
      <nav aria-label="Breadcrumb" class="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <ol class="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <li><a href="/" class="hover:text-blue-600 transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/tools" class="hover:text-blue-600 transition-colors">Tools</a></li>
            <li>/</li>
            <li class="text-slate-900 font-semibold truncate" aria-current="page">${tool.name}</li>
          </ol>
        </div>
      </nav>

      <!-- Tool Header Section -->
      <header class="bg-white border-b border-slate-200/80 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-slate-200/80 bg-slate-100/80 text-slate-700">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>${tool.category || 'Tools'}</span>
            <span class="text-slate-300">•</span>
            <span class="font-bold text-emerald-700">100% FREE</span>
            <span class="text-slate-300">•</span>
            <span>In-Browser Privacy</span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            ${tool.h1 || tool.name}
          </h1>

          <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ${tool.introduction || tool.description}
          </p>

          <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span class="inline-flex items-center gap-1.5">⚡ Instant Calculations</span>
            <span class="inline-flex items-center gap-1.5">🔒 100% Private In-Browser</span>
            <span class="inline-flex items-center gap-1.5 font-semibold text-emerald-700">✓ Free In-Browser Tool</span>
          </div>
        </div>
      </header>

      <!-- Main Tool Working Workspace & Instructions -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8 text-center">
          <div class="inline-block p-3 rounded-2xl bg-blue-50 text-blue-600 mb-3 font-bold text-sm">
            Interactive ${tool.name} Workspace
          </div>
          <p class="text-sm text-slate-600 max-w-xl mx-auto">
            ${tool.description}
          </p>
        </div>

        ${howToHtml}
        ${guideHtml}
        ${faqHtml}
        ${relatedHtml}
      </main>

      <!-- Footer Navigation -->
      <footer class="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <div class="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 mb-4">
          <a href="/tools" class="hover:text-slate-900">All Tools</a>
          <a href="/about" class="hover:text-slate-900">About</a>
          <a href="/contact" class="hover:text-slate-900">Contact</a>
          <a href="/privacy" class="hover:text-slate-900">Privacy Policy</a>
          <a href="/terms" class="hover:text-slate-900">Terms of Use</a>
          <a href="/disclaimer" class="hover:text-slate-900">Disclaimer</a>
        </div>
        <p>© 2026 BizPilot. All rights reserved. 100% client-side privacy.</p>
      </footer>
    </div>
  `;
}

const distDir = path.resolve(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

// 1. Process Tool Routes (with full semantic HTML inside #root and Schema.org JSON-LD)
for (const tool of TOOL_ROUTES) {
  const targetDir = path.join(distDir, ...tool.route.split('/'));
  fs.mkdirSync(targetDir, { recursive: true });

  const canonicalUrl = `${DOMAIN}${tool.route}`;
  const schema = generateToolSchema(tool, canonicalUrl);
  const schemaJson = JSON.stringify(schema, null, 2);
  const semanticBodyHtml = generateToolHtml(tool, canonicalUrl);

  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${tool.title}</title>`);

  // Replace Description
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${tool.description}" />`);

  // Replace Canonical Link (Absolute canonical per route)
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace Open Graph tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${tool.title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${tool.description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${tool.title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${tool.description}" />`);

  // Inject Schema.org JSON-LD before </head>
  const schemaScript = `  <script type="application/ld+json">\n${schemaJson}\n    </script>\n  </head>`;
  html = html.replace(/<\/head>/i, schemaScript);

  // Pre-render meaningful semantic HTML inside <div id="root">
  html = html.replace(/<div id="root"><\/div>/i, `<div id="root">${semanticBodyHtml}</div>`);

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`Generated static pre-rendered route: ${tool.route} -> ${targetFile}`);
}

// 2. Process Static General Pages
for (const page of STATIC_PAGES) {
  const targetDir = path.join(distDir, ...page.route.split('/'));
  fs.mkdirSync(targetDir, { recursive: true });

  const canonicalUrl = `${DOMAIN}${page.route}`;
  let html = template;

  html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${page.description}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${page.title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${page.description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${page.title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${page.description}" />`);

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`Generated static route: ${page.route} -> ${targetFile}`);
}

console.log(`Successfully generated ${TOOL_ROUTES.length + STATIC_PAGES.length} static pre-rendered routes.`);
