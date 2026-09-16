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
    id: 'hourly-rate',
    name: 'Basic Hourly Rate Calculator',
    category: 'Calculators',
    tagline: 'Calculate what you should charge per hour to hit income goals',
    description: 'Factoring in billable weeks, weekly hours, and overhead expenses to establish a confident, sustainable freelance rate.',
    isPremium: false,
    iconName: 'Clock',
    badge: 'Free',
    actionLabel: 'Calculate Rate'
  },
  {
    id: 'image-resizer',
    name: 'Basic Image Resizer',
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
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    category: 'Calculators',
    tagline: 'Calculate net profit, gross margin, and markup percentages',
    description: 'Determine your profit margins, markup multipliers, and gross profits to price your goods and services sustainably.',
    isPremium: true,
    iconName: 'TrendingUp',
    badge: 'Premium',
    actionLabel: 'Upgrade to Premium'
  },
  {
    id: 'invoice-gen',
    name: 'Invoice Generator',
    category: 'Business',
    tagline: 'Generate branded PDF invoices for clients in 60 seconds',
    description: 'Professional invoice templates with line items, tax calculation, payment details, and downloadable print-ready PDFs.',
    isPremium: true,
    iconName: 'Receipt',
    badge: 'Premium',
    actionLabel: 'Upgrade to Premium'
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
    actionLabel: 'Upgrade to Premium'
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
    actionLabel: 'Upgrade to Premium'
  },
  {
    id: 'client-email-gen',
    name: 'Client Email Generator',
    category: 'Marketing',
    tagline: 'Draft polite, effective client messages in seconds',
    description: 'Pre-built, customizable business email scripts for onboarding, project scope creep, overdue invoices, and pitch follow-ups.',
    isPremium: true,
    iconName: 'Mail',
    badge: 'Upcoming Premium',
    actionLabel: 'Upcoming Tool'
  },
  {
    id: 'social-caption-gen',
    name: 'Social Media Caption Generator',
    category: 'Marketing',
    tagline: 'Create engaging social captions, hooks, and hashtags',
    description: 'Formulate scroll-stopping captions, LinkedIn thought leadership posts, and Instagram updates to market your freelance services.',
    isPremium: true,
    iconName: 'Share2',
    badge: 'Upcoming Premium',
    actionLabel: 'Upcoming Tool'
  }
];

export interface FreeTierPlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  period: string;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export const FREE_TIER_DETAILS: FreeTierPlan = {
  id: 'free',
  name: 'Free Forever',
  badge: 'Zero Account Required',
  price: '$0',
  period: 'forever',
  tagline: 'Essential everyday calculators for everyone',
  description: 'Instant, private in-browser calculators and productivity utilities with zero sign-up or credit card needed.',
  features: [
    'Percentage Calculator (amounts, % change, tips & tax)',
    'Word & Character Counter (real-time text metrics & reading times)',
    'Basic Hourly Rate Calculator (billable rate targets & overhead)',
    'Basic Image Resizer (100% local canvas resize & JPEG/PNG exports)',
    '100% In-Browser Privacy (zero server uploads or data logging)',
    'Unlimited everyday calculations with no account needed'
  ],
  ctaLabel: 'Use Free Tools Now'
};

export const PREMIUM_KEY_BENEFITS: string[] = [
  'Profit Margin & Markup Multiplier Calculator with sustainable revenue targets',
  'Professional Invoice Generator with line items, tax rates, and instant PDF download',
  'Binding Project Quote & Estimate Generator with milestone deposits and terms',
  'Client Proposal Generator with executive summary, deliverables, and signature blocks',
  'Client-ready document exports with custom business branding & zero watermarks',
  'Priority access to all new upcoming business tools and updates',
  'Commercial usage rights for your client services and business operations'
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly-promo',
    name: '1 Month ($5 Promo)',
    duration: '1 Month',
    price: '$5.00',
    promotionalPrice: '$5.00 first month',
    regularPrice: 'then $9.99/month',
    period: 'first month',
    monthlyEquivalent: '$5 first month, then $9.99/mo',
    savings: 'Introductory Offer',
    features: [
      'Full access to all 4 Premium business tools',
      '$5 for the first month',
      'Then $9.99/month afterwards',
      'Cancel anytime — zero lock-in',
      'Profit Margin, Invoices, Quotes & Proposals',
      'Full document exports with zero watermarks'
    ]
  },
  {
    id: '3-months',
    name: '3 Months',
    duration: '3 Months (Prepaid)',
    price: '$24.99',
    period: 'total',
    monthlyEquivalent: '$8.33 / month',
    popular: true,
    savings: 'Most Popular',
    features: [
      'Full access to all 4 Premium business tools',
      '$24.99 total one-time payment',
      'Prepaid 3-month access',
      'No automatic monthly renewal',
      'Save & export client invoices & proposals',
      'Priority email customer support'
    ]
  },
  {
    id: '6-months',
    name: '6 Months',
    duration: '6 Months (Prepaid)',
    price: '$44.99',
    period: 'total',
    monthlyEquivalent: '$7.50 / month',
    savings: 'Save ~25%',
    features: [
      'Full access to all 4 Premium business tools',
      '$44.99 total one-time payment',
      'Prepaid 6-month access',
      'No automatic monthly renewal',
      'Unlimited PDF document exports',
      'Priority support & upcoming tool updates'
    ]
  },
  {
    id: '1-year',
    name: '1 Year',
    duration: '12 Months (Prepaid)',
    price: '$79.99',
    period: 'total',
    monthlyEquivalent: '$6.67 / month',
    bestValue: true,
    savings: 'Best Value (Save ~33%)',
    features: [
      'Full access to all 4 Premium business tools',
      '$79.99 total one-time payment',
      'Prepaid 12-month access',
      'No automatic monthly renewal',
      'Commercial usage & branding rights',
      'All upcoming business tools & features'
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
    answer: 'Four core utility tools are 100% free to use with no account, login, or subscription required: the Percentage Calculator, Word Counter, Basic Hourly Rate Calculator, and Basic Image Resizer. Free tools remain fully usable forever with zero payment.'
  },
  {
    id: 'faq-3',
    question: '3. What do I get with Premium?',
    answer: 'BizPilot Premium unlocks our advanced business calculation and client document suite, including the Profit Margin Calculator, Invoice Generator, Quote Generator, and Proposal Generator with branded PDF exports, commercial usage rights, and unlimited calculations.'
  },
  {
    id: 'faq-4',
    question: '4. How much does BizPilot Premium cost?',
    answer: 'Our monthly subscription is $5 for the first month, then $9.99/month, with the freedom to cancel anytime. We also offer convenient prepaid plans with no auto-renewal: 3 Months for $24.99 total ($8.33/mo), 6 Months for $44.99 total ($7.50/mo), and 1 Year for $79.99 total ($6.67/mo).'
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
    question: '9. How do I upgrade to BizPilot Premium?',
    answer: 'You can upgrade directly by choosing any of our subscription plans on the pricing section. Payments are securely processed via Cashfree Payments with instant tool activation upon successful checkout.'
  }
];
