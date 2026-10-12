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

  // Business Generators & Calculators
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    category: 'Calculators',
    tagline: 'Calculate net profit, gross margin, and markup percentages',
    description: 'Determine your profit margins, markup multipliers, and gross profits to price your goods and services sustainably.',
    isPremium: false,
    iconName: 'TrendingUp',
    badge: 'Calculator',
    actionLabel: 'Use Calculator'
  },
  {
    id: 'invoice-gen',
    name: 'Invoice Generator',
    category: 'Business',
    tagline: 'Generate branded PDF invoices for clients in 60 seconds',
    description: 'Professional invoice templates with line items, tax calculation, payment details, and downloadable print-ready PDFs.',
    isPremium: false,
    iconName: 'Receipt',
    badge: 'Generator',
    actionLabel: 'Create Invoice'
  },
  {
    id: 'quote-gen',
    name: 'Quote Generator',
    category: 'Business',
    tagline: 'Send polished job estimates and project price quotes',
    description: 'Turn client project scopes into clear, binding price quotes with expiration dates, deposit terms, and approval workflows.',
    isPremium: false,
    iconName: 'FileSpreadsheet',
    badge: 'Generator',
    actionLabel: 'Create Quote'
  },
  {
    id: 'proposal-gen',
    name: 'Proposal Generator',
    category: 'Business',
    tagline: 'Win high-value client contracts with structured proposals',
    description: 'Generate comprehensive client proposals including project overview, milestones, deliverables, and signature blocks.',
    isPremium: false,
    iconName: 'Briefcase',
    badge: 'Generator',
    actionLabel: 'Create Proposal'
  },
  {
    id: 'client-email-gen',
    name: 'Client Email Generator',
    category: 'Marketing',
    tagline: 'Draft polite, effective client messages in seconds',
    description: 'Pre-built, customizable business email scripts for onboarding, project scope creep, overdue invoices, and pitch follow-ups.',
    isPremium: false,
    iconName: 'Mail',
    badge: 'Upcoming',
    actionLabel: 'Upcoming Tool'
  },
  {
    id: 'social-caption-gen',
    name: 'Social Media Caption Generator',
    category: 'Marketing',
    tagline: 'Create engaging social captions, hooks, and hashtags',
    description: 'Formulate scroll-stopping captions, LinkedIn thought leadership posts, and Instagram updates to market your freelance services.',
    isPremium: false,
    iconName: 'Share2',
    badge: 'Upcoming',
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
  price: '',
  period: 'forever',
  tagline: 'Essential everyday calculators & generators for everyone',
  description: 'Instant, private in-browser calculators, document generators, and productivity utilities with zero sign-up or credit card needed.',
  features: [
    'Percentage Calculator (amounts, % change, tips & tax)',
    'Word & Character Counter (real-time text metrics & reading times)',
    'Basic Hourly Rate Calculator (billable rate targets & overhead)',
    'Basic Image Resizer (100% local canvas resize & JPEG/PNG exports)',
    'Profit Margin Calculator (gross margin & markup multipliers)',
    'Invoice, Quote & Proposal Generators (printable PDF exports)',
    '100% In-Browser Privacy (zero server uploads or data logging)',
    'Client-side calculations with no account needed'
  ],
  ctaLabel: 'Use Tools Now'
};

export const PREMIUM_KEY_BENEFITS: string[] = [
  'Profit Margin & Markup Multiplier Calculator with sustainable revenue targets',
  'Professional Invoice Generator with line items, tax rates, and instant PDF download',
  'Binding Project Quote & Estimate Generator with milestone deposits and terms',
  'Client Proposal Generator with executive summary, deliverables, and signature blocks',
  'Client-ready document exports with custom business branding & zero watermarks',
  'In-browser execution with complete privacy',
  'Commercial usage rights for your client services and business operations'
];

export const PRICING_PLANS: PricingPlan[] = [];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '1. What is BizPilot?',
    answer: 'BizPilot is an all-in-one business productivity toolbox designed specifically for freelancers, solopreneurs, creators, consultants, and small-business owners. It brings together practical tools to create documents, calculate critical business numbers, communicate professionally, and run your work smoothly.'
  },
  {
    id: 'faq-2',
    question: '2. Which tools are free to use?',
    answer: 'All BizPilot tools are 100% free to use with no account, login, or subscription required. You can use our calculators (Percentage, Hourly Rate, Profit Margin), document generators (Invoices, Quotes, Proposals), Word Counter, and Image Resizer with zero payment.'
  },
  {
    id: 'faq-3',
    question: '3. What capabilities does BizPilot include?',
    answer: 'BizPilot includes an integrated business calculation and document suite: Profit Margin Calculator, Invoice Generator, Quote Generator, and Proposal Generator with client-ready PDF downloads, as well as hourly rate, percentage, text analysis, and image resizing tools.'
  },
  {
    id: 'faq-4',
    question: '4. Does BizPilot require a subscription, purchase, or fee?',
    answer: 'No. BizPilot is free to use. There are no subscription fees, monthly charges, or payment requirements. All available tools run directly in your browser without requiring a credit card or upgrade.'
  },
  {
    id: 'faq-5',
    question: '5. Do I need to install anything?',
    answer: 'No installation is needed! BizPilot runs entirely inside your modern web browser on desktop, tablet, or smartphone. There are no heavy downloads, desktop apps, or browser extensions required.'
  },
  {
    id: 'faq-6',
    question: '6. Is BizPilot designed for freelancers and small businesses?',
    answer: 'Yes. BizPilot was custom-built around the daily workflows of solo professionals, contractors, creators, and boutique business owners who need quick, reliable answers for pricing, calculating profits, and creating client documents without paying for complicated software.'
  },
  {
    id: 'faq-7',
    question: '7. Can I use BizPilot on my mobile phone or tablet?',
    answer: 'Yes, BizPilot is designed with a mobile-first responsive architecture. All tools, calculators, word counters, document generators, and image editing features work smoothly across phones, tablets, laptops, and desktop computers.'
  },
  {
    id: 'faq-8',
    question: '8. Are my documents or uploaded images stored on your servers?',
    answer: 'No. All calculations, document generation, and image resizing happen locally inside your web browser. Your inputs, business numbers, client details, and files are never uploaded to remote servers or stored in the cloud, guaranteeing complete privacy.'
  },
  {
    id: 'faq-9',
    question: '9. Do I need to sign up or create an account?',
    answer: 'No account or registration is required. You can start using any tool immediately right from your web browser with complete client-side privacy.'
  }
];
