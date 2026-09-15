import { ToolItem, PricingPlan, FaqItem } from '../types';

export const ALL_TOOLS: ToolItem[] = [
  // Free Tools
  {
    id: 'percentage-calc',
    name: 'Percentage Calculator',
    category: 'Calculators',
    tagline: 'Instant % amounts, increases, discounts and tax calculations',
    description: 'Calculate percentages of any number, calculate rate changes, and calculate additions/deductions with precision.',
    isPremium: false,
    iconName: 'Percent',
    badge: 'Free',
    actionLabel: 'Use Calculator'
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    category: 'Calculators',
    tagline: 'Calculate net profit, gross margin, and markup percentages',
    description: 'Determine your profit margins, markup multipliers, and gross profits to price your goods and services sustainably.',
    isPremium: false,
    iconName: 'TrendingUp',
    badge: 'Free',
    actionLabel: 'Calculate Margin'
  },
  {
    id: 'hourly-rate',
    name: 'Hourly Rate Calculator',
    category: 'Calculators',
    tagline: 'Calculate what you should charge per hour to hit income goals',
    description: 'Factoring in billable weeks, weekly hours, and overhead expenses to establish a confident, sustainable freelance rate.',
    isPremium: false,
    iconName: 'Clock',
    badge: 'Free',
    actionLabel: 'Calculate Rate'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'Productivity',
    tagline: 'Real-time text stats: words, characters, sentences, and read time',
    description: 'Live text analyzer for client emails, proposals, marketing copy, and articles with character and sentence counters.',
    isPremium: false,
    iconName: 'FileText',
    badge: 'Free',
    actionLabel: 'Count Words'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    category: 'Productivity',
    tagline: 'Resize, crop, and optimize photos 100% locally in your browser',
    description: 'Safe in-browser image resizing with aspect-ratio locking. Zero server uploads; your private images never leave your computer.',
    isPremium: false,
    iconName: 'Image',
    badge: 'Free',
    actionLabel: 'Resize Image'
  },

  // Premium Tools
  {
    id: 'invoice-gen',
    name: 'Invoice Generator',
    category: 'Business',
    tagline: 'Generate branded PDF invoices for clients in 60 seconds',
    description: 'Professional invoice templates with line items, tax calculation, payment details, and downloadable print-ready PDFs.',
    isPremium: true,
    iconName: 'Receipt',
    badge: 'Premium',
    actionLabel: 'Unlock Tool'
  },
  {
    id: 'quote-gen',
    name: 'Quote Generator',
    category: 'Business',
    tagline: 'Send polished job estimates and project price quotes',
    description: 'Turn client project scopes into clear, binding price quotes with expiration dates, deposit terms, and approval workflows.',
    isPremium: true,
    iconName: 'FileSpreadsheet',
    badge: 'Premium',
    actionLabel: 'Unlock Tool'
  },
  {
    id: 'proposal-gen',
    name: 'Proposal Generator',
    category: 'Business',
    tagline: 'Win high-value client contracts with structured proposals',
    description: 'Generate comprehensive client proposals including project overview, milestones, deliverables, and signature blocks.',
    isPremium: true,
    iconName: 'Briefcase',
    badge: 'Premium',
    actionLabel: 'Unlock Tool'
  },
  {
    id: 'client-email-gen',
    name: 'Client Email Generator',
    category: 'Marketing',
    tagline: 'Draft polite, effective client messages in seconds',
    description: 'Pre-built, customizable business email scripts for onboarding, project scope creep, overdue invoices, and pitch follow-ups.',
    isPremium: true,
    iconName: 'Mail',
    badge: 'Premium',
    actionLabel: 'Unlock Tool'
  },
  {
    id: 'social-caption-gen',
    name: 'Social Media Caption Generator',
    category: 'Marketing',
    tagline: 'Create engaging social captions, hooks, and hashtags',
    description: 'Formulate scroll-stopping captions, LinkedIn thought leadership posts, and Instagram updates to market your freelance services.',
    isPremium: true,
    iconName: 'Share2',
    badge: 'Premium',
    actionLabel: 'Unlock Tool'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    duration: '1 Month',
    price: '$9.99',
    period: '/ month',
    monthlyEquivalent: '$9.99/mo',
    savings: 'Standard Flex',
    features: [
      'Full access to all 5 Premium tools',
      'Invoice & Quote PDF generation',
      'Proposal templates with custom branding',
      'Client email & caption writers',
      'Save & export project documents',
      'Priority product feature updates'
    ]
  },
  {
    id: '3-months',
    name: '3 Months',
    duration: 'Quarterly',
    price: '$24.99',
    period: '/ 3 months',
    monthlyEquivalent: '$8.33 / month',
    savings: 'Save ~17%',
    features: [
      'Full access to all 5 Premium tools',
      'Invoice & Quote PDF generation',
      'Proposal templates with custom branding',
      'Client email & caption writers',
      'Save & export project documents',
      'Priority email customer support'
    ]
  },
  {
    id: '6-months',
    name: '6 Months',
    duration: 'Bi-Annual',
    price: '$39.99',
    period: '/ 6 months',
    monthlyEquivalent: '$6.67 / month',
    popular: true,
    savings: 'Save ~33%',
    features: [
      'Full access to all 5 Premium tools',
      'Unlimited PDF document exports',
      'Proposal generator with milestone plans',
      'Advanced client message scripts',
      'Commercial usage license',
      'Priority support & feature voting'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly',
    duration: 'Annual Access',
    price: '$59.99',
    period: '/ year',
    monthlyEquivalent: '$5.00 / month',
    bestValue: true,
    savings: 'Save 50%',
    features: [
      'Full access to all 5 Premium tools',
      'Unlimited PDF document exports',
      'Custom business branding & logo embeds',
      'All upcoming 2026 business tools',
      'Fast-track feature requests',
      'Best ongoing annual rate'
    ]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '1. What is BizPilot?',
    answer: 'BizPilot is an all-in-one business productivity toolbox designed specifically for US freelancers, solopreneurs, creators, consultants, and small-business owners. It brings together practical tools to create documents, calculate critical business numbers, communicate professionally, and grow your work without complicated software.'
  },
  {
    id: 'faq-2',
    question: '2. Which tools are free?',
    answer: 'All five core utility tools are 100% free to use with no account, login, or subscription required: the Percentage Calculator, Profit Margin Calculator, Hourly Rate Calculator, Word Counter, and local Image Resizer.'
  },
  {
    id: 'faq-3',
    question: '3. What do I get with Premium?',
    answer: 'BizPilot Premium unlocks our advanced document generation and client communication suite, including the Invoice Generator, Quote Generator, Proposal Generator, Client Email Generator, and Social Media Caption Generator with branded PDF exports and unlimited document creation.'
  },
  {
    id: 'faq-4',
    question: '4. How much does BizPilot Premium cost?',
    answer: 'Our standard pricing tiers are $9.99/month, $24.99/3 months ($8.33/mo), $39.99/6 months ($6.67/mo), and $59.99/year ($5.00/mo). In addition, new users can get started with our special promotional offer: your first month is only $5.'
  },
  {
    id: 'faq-5',
    question: '5. Do I need to install anything?',
    answer: 'No installation is needed! BizPilot runs entirely inside your modern web browser on desktop, tablet, or smartphone. There are no heavy downloads, desktop apps, or browser extensions required.'
  },
  {
    id: 'faq-6',
    question: '6. Is BizPilot designed for freelancers?',
    answer: 'Yes. BizPilot was custom-built around the daily workflows of solo professionals, contractors, creators, and boutique agency owners who need quick, reliable answers for pricing, calculating profits, and writing business correspondence without paying for clunky enterprise suites.'
  },
  {
    id: 'faq-7',
    question: '7. Can I use BizPilot on my phone?',
    answer: 'Yes, BizPilot is designed with a mobile-first responsive architecture. All tools, calculators, word counters, and image editing features work smoothly across iPhones, iPads, Android devices, laptops, and desktop computers.'
  },
  {
    id: 'faq-8',
    question: '8. Are my uploaded images stored?',
    answer: 'No. When you use the Image Resizer, your image is processed entirely inside your local browser via the HTML5 Canvas API. Your files are never uploaded to our servers or stored anywhere in the cloud, guaranteeing complete privacy.'
  },
  {
    id: 'faq-9',
    question: '9. When will Premium checkout be available?',
    answer: 'We are currently completing testing on our secure payment infrastructure and compliance. Premium checkout will launch shortly. In the meantime, you can explore all five free tools immediately, and register your email to lock in your $5 introductory rate.'
  }
];
