export interface RelatedToolLink {
  id: string;
  name: string;
  route: string;
  reason: string;
  badge?: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolSeoConfig {
  id: string;
  route: string;
  toolKey: string; // matches ALL_TOOLS id
  name: string;
  title: string;
  description: string;
  h1: string;
  introduction: string;
  category: 'Calculators' | 'Productivity' | 'Business' | 'Marketing';
  isPremium?: boolean;
  relatedTools: RelatedToolLink[];
  faqs: ToolFaq[];
  howToUseSteps: string[];
}

export const TOOL_SEO_PAGES: Record<string, ToolSeoConfig> = {
  'percentage-calculator': {
    id: 'percentage-calculator',
    route: '/tools/percentage-calculator',
    toolKey: 'percentage-calc',
    name: 'Percentage Calculator',
    title: 'Percentage Calculator — Quick Percent Amounts & Changes | BizPilot',
    description: 'Calculate percentages of any number, calculate percentage increases or decreases, and calculate discounts and tax amounts instantly in your browser.',
    h1: 'Free Online Percentage Calculator',
    introduction: 'Solve common percentage calculations for business proposals, client invoices, sales tax, and profit markups in seconds. Choose from three precision modes: finding a percentage of a number, calculating percentage increase or decrease between values, or applying direct discounts and markups.',
    category: 'Calculators',
    isPremium: false,
    howToUseSteps: [
      'Choose your calculation mode: Percentage of a Number, Percentage Change, or Add/Subtract Percentage.',
      'Enter your values in the clear input fields. Results calculate instantly in real time.',
      'Copy the calculated answer or full formula expression with one click to paste into your documents.'
    ],
    relatedTools: [
      {
        id: 'profit-margin',
        name: 'Profit Margin Calculator',
        route: '/tools/profit-margin-calculator',
        reason: 'Determine exact markup percentages and gross margin on products or client services.',
      },
      {
        id: 'hourly-rate',
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Factor in business expenses, tax margins, and billable ratios into your hourly fee.',
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Apply calculated percentages, custom discounts, and tax rates directly onto PDF invoices.',
        badge: 'Popular'
      }
    ],
    faqs: [
      {
        question: 'How do I calculate a percentage discount on a client fee?',
        answer: 'Switch to the "Add/Discount %" tab. Enter your original price and the discount percentage (for example, 15%). The calculator will compute both the exact deduction amount and the final discounted price instantly.'
      },
      {
        question: 'What is the difference between percentage change and percentage point difference?',
        answer: 'Percentage change measures the relative difference between an original value and a new value ((New - Old) / Old × 100). Percentage point difference refers to the simple arithmetic difference between two percentage rates (e.g., from 10% to 15% is a 5 percentage point change, but a 50% increase).'
      },
      {
        question: 'Are my calculation numbers stored or uploaded anywhere?',
        answer: 'No. BizPilot runs all calculations entirely inside your local browser. No data, numbers, or inputs are ever transmitted to an external server or saved in cookies.'
      }
    ]
  },

  'profit-margin-calculator': {
    id: 'profit-margin-calculator',
    route: '/tools/profit-margin-calculator',
    toolKey: 'profit-margin',
    name: 'Profit Margin Calculator',
    title: 'Profit Margin Calculator — Gross Margin & Markup Tool | BizPilot',
    description: 'Calculate gross margin, markup percentage, and profit from your cost and revenue figures. Price your products and client services sustainably.',
    h1: 'Profit Margin & Markup Calculator',
    introduction: 'Accurately compute gross profit margins, markup multipliers, and net cash margins to ensure your freelance projects, consulting engagements, and client deliverables remain sustainably profitable after accounting for direct costs.',
    category: 'Calculators',
    isPremium: false,
    howToUseSteps: [
      'Enter your total project or product cost (labor, software, materials, sub-contractors).',
      'Enter your selling price or client revenue figure.',
      'Review your Gross Profit, Profit Margin percentage, and Markup percentage instantly.'
    ],
    relatedTools: [
      {
        id: 'hourly-rate',
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Translate your target profit margins into a sustainable freelance hourly rate.',
        badge: 'Recommended'
      },
      {
        id: 'percentage-calculator',
        name: 'Percentage Calculator',
        route: '/tools/percentage-calculator',
        reason: 'Calculate component discounts, sales tax, or expense markups individually.',
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Generate professional invoices reflecting your profitable pricing structure.',
      }
    ],
    faqs: [
      {
        question: 'What is the difference between profit margin and markup percentage?',
        answer: 'Profit margin is the percentage of total revenue that remains as profit ((Revenue - Cost) / Revenue × 100). Markup is the percentage added on top of your original cost to arrive at the selling price ((Revenue - Cost) / Cost × 100). For example, an item costing $50 sold for $100 has a 50% margin and a 100% markup.'
      },
      {
        question: 'What is considered a healthy profit margin for service businesses?',
        answer: 'Service-based businesses and independent consultants typically target a gross profit margin between 40% and 60% to safely cover administrative overhead, software, taxes, and periods between client projects.'
      },
      {
        question: 'How does this help me with client project quotes?',
        answer: 'By entering your estimated contractor, software, or labor costs and your intended quote price, you can verify before sending an estimate that you will make a healthy return rather than breaking even.'
      }
    ]
  },

  'hourly-rate-calculator': {
    id: 'hourly-rate-calculator',
    route: '/tools/hourly-rate-calculator',
    toolKey: 'hourly-rate',
    name: 'Hourly Rate Calculator',
    title: 'Freelance Hourly Rate Calculator — Calculate Billable Rate | BizPilot',
    description: 'Determine what you need to charge per hour based on your target annual income, business overhead, billable efficiency, and vacation time.',
    h1: 'Freelance Hourly Rate Calculator',
    introduction: 'Discover what you truly need to charge per hour. Factor in your take-home income goal, annual business expenses, non-billable administrative hours, and planned vacation weeks to establish an unapologetic, sustainable freelance rate.',
    category: 'Calculators',
    isPremium: false,
    howToUseSteps: [
      'Set your target annual take-home income goal.',
      'Enter your annual business operating expenses (software subscriptions, equipment, insurance).',
      'Specify your weekly working hours, planned weeks off, and your realistic billable efficiency percentage (typically 60%–75%).',
      'Receive your required hourly rate along with day rate, week rate, and billable hour breakdowns.'
    ],
    relatedTools: [
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Bill clients directly at your calculated hourly rate with itemized PDF invoices.',
        badge: 'Recommended'
      },
      {
        id: 'profit-margin',
        name: 'Profit Margin Calculator',
        route: '/tools/profit-margin-calculator',
        reason: 'Double-check your profit margins when quoting fixed-fee retainers or package deals.',
      },
      {
        id: 'quote-gen',
        name: 'Quote Generator',
        route: '/tools/quote-generator',
        reason: 'Multiply estimated project hours by your hourly rate to produce formal client estimates.',
      }
    ],
    faqs: [
      {
        question: 'Why do freelancers need to account for non-billable hours?',
        answer: 'Freelancers rarely spend 100% of their 40-hour week doing billable client work. Significant time goes to invoicing, client emails, marketing, accounting, and proposal drafting. A 60% to 75% billable ratio ensures your rates cover the full working week.'
      },
      {
        question: 'How should I factor in self-employment taxes?',
        answer: 'In the US and many countries, self-employed individuals pay additional taxes (such as FICA/Self-Employment tax) usually ranging from 25% to 35% of net profit. Include this amount in your annual income goal or overhead expenses.'
      },
      {
        question: 'Can I use this calculator if I charge per project instead of hourly?',
        answer: 'Yes! Estimate how many billable hours a project will take, then multiply that by your target hourly rate to find your minimum project price floor.'
      }
    ]
  },

  'word-counter': {
    id: 'word-counter',
    route: '/tools/word-counter',
    toolKey: 'word-counter',
    name: 'Word Counter',
    title: 'Word & Character Counter — Real-Time Text Statistics | BizPilot',
    description: 'Free real-time word counter and character counter with reading time, speaking time, sentences, and paragraph analysis for articles, proposals, and copy.',
    h1: 'Word & Character Counter',
    introduction: 'Analyze text length, word count, character density (with and without spaces), sentence structures, and estimated reading or speaking time for client proposals, marketing copy, and business emails in real time.',
    category: 'Productivity',
    isPremium: false,
    howToUseSteps: [
      'Type or paste your text directly into the main editor area.',
      'Watch words, characters, sentences, paragraphs, and reading times update dynamically.',
      'Use the sample text button for testing, or copy analyzed text with one click.'
    ],
    relatedTools: [
      {
        id: 'proposal-gen',
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Craft tight, concise scope descriptions for high-converting client proposals.',
        badge: 'Recommended'
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Review your invoice terms, payment notes, and line items for clarity.',
      },
      {
        id: 'image-resizer',
        name: 'Image Resizer',
        route: '/tools/image-resizer',
        reason: 'Resize and optimize images to accompany your written content or client assets.',
      }
    ],
    faqs: [
      {
        question: 'How are reading and speaking speeds estimated?',
        answer: 'Reading time is calculated using the standard professional average of 200 words per minute. Speaking time is calculated at 130 words per minute, typical for presentations and business pitches.'
      },
      {
        question: 'Is any of my text uploaded or stored on a server?',
        answer: 'Never. All analysis occurs locally in your web browser JavaScript runtime. We never read, store, or log your confidential text.'
      },
      {
        question: 'Can I check character counts for social media or ad copy limits?',
        answer: 'Yes. The live character count (with spaces and without spaces) makes it easy to adhere to limits for Google Ads, Meta Ads, LinkedIn posts, or email subject lines.'
      }
    ]
  },

  'image-resizer': {
    id: 'image-resizer',
    route: '/tools/image-resizer',
    toolKey: 'image-resizer',
    name: 'Image Resizer',
    title: 'Free Image Resizer — Resize Photos Locally in Browser | BizPilot',
    description: 'Resize, scale, and compress images directly in your browser. 100% private client-side processing with aspect-ratio locking and JPG, PNG, WebP export.',
    h1: 'In-Browser Image Resizer & Compressor',
    introduction: 'Resize and optimize images for business websites, client presentations, social banners, and invoice logos without sending confidential graphics to third-party cloud servers. Runs 100% locally in your browser with aspect ratio locking and lossless canvas processing.',
    category: 'Productivity',
    isPremium: false,
    howToUseSteps: [
      'Drag and drop an image (PNG, JPG, WebP) or click to browse from your device.',
      'Choose an exact target width/height or select a preset percentage scale (25%, 50%, 75%, 100%).',
      'Toggle aspect ratio locking if needed, choose your output format (PNG, JPEG, WebP), and click "Download Resized Image".'
    ],
    relatedTools: [
      {
        id: 'proposal-gen',
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Prepare optimized visual diagrams and brand assets for your project proposals.',
      },
      {
        id: 'word-counter',
        name: 'Word Counter',
        route: '/tools/word-counter',
        reason: 'Pair your optimized images with concise, polished captions and copy.',
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Resize your business logo for clean placement in client billing documents.',
      }
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
    ]
  },

  'invoice-generator': {
    id: 'invoice-generator',
    route: '/tools/invoice-generator',
    toolKey: 'invoice-gen',
    name: 'Invoice Generator',
    title: 'Free Invoice Generator — Create & Download PDF Invoices | BizPilot',
    description: 'Create and download professional PDF invoices for clients in 60 seconds. Add line items, discounts, taxes, and payment instructions. No sign-up required.',
    h1: 'Free PDF Invoice Generator',
    introduction: 'Generate clean, print-ready PDF invoices for your freelance clients and business customers directly in your browser. Add itemized services, apply custom discounts and taxes, specify bank payment details, and export instantly with zero account registration.',
    category: 'Business',
    isPremium: true,
    howToUseSteps: [
      'Fill in your business details (name, email, address, phone) and your client contact information.',
      'Specify invoice number, invoice date, due date, and currency.',
      'Add line items with descriptions, quantities, and rates. Subtotals and grand totals compute automatically.',
      'Click "Download PDF" to immediately export a clean, client-ready PDF invoice.'
    ],
    relatedTools: [
      {
        id: 'quote-gen',
        name: 'Quote Generator',
        route: '/tools/quote-generator',
        reason: 'Send preliminary cost estimates before converting agreed scopes to finalized invoices.',
        badge: 'Recommended'
      },
      {
        id: 'hourly-rate',
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Determine your true billable hourly rates before populating invoice line items.',
      },
      {
        id: 'proposal-gen',
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Win contracts with structured proposals, then bill your milestones with this invoice tool.',
      }
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
    ]
  },

  'quote-generator': {
    id: 'quote-generator',
    route: '/tools/quote-generator',
    toolKey: 'quote-gen',
    name: 'Quote Generator',
    title: 'Free Quote Generator — Create Job Estimates & PDF Quotes | BizPilot',
    description: 'Generate professional price quotes and job estimates for clients. Set validity periods, payment terms, discounts, and download formatted PDFs instantly.',
    h1: 'Free Price Quote & Job Estimate Generator',
    introduction: 'Build formal price quotes and project estimates to secure client agreements before beginning work. Specify line-item deliverables, quote validity periods, deposit terms, and signature approval lines in an exportable PDF document.',
    category: 'Business',
    isPremium: true,
    howToUseSteps: [
      'Enter your business info, client info, quote number, and quote expiration period.',
      'Add itemized goods or services with descriptions, quantities, and estimated unit rates.',
      'Include acceptance terms, deposit expectations, or notes for the client.',
      'Download your formatted PDF quote ready for client review and signature.'
    ],
    relatedTools: [
      {
        id: 'proposal-gen',
        name: 'Proposal Generator',
        route: '/tools/proposal-generator',
        reason: 'Expand your quote into a full strategic project proposal with detailed milestones.',
        badge: 'Recommended'
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Turn approved quotes into deposit invoices or final payment requests.',
      },
      {
        id: 'hourly-rate',
        name: 'Hourly Rate Calculator',
        route: '/tools/hourly-rate-calculator',
        reason: 'Use your target hourly billable rate to calculate itemized labor hours accurately.',
      }
    ],
    faqs: [
      {
        question: 'What is the difference between a quote and an invoice?',
        answer: 'A price quote is sent before starting work to outline estimated costs and agree on deliverables. An invoice is issued after work is completed (or at agreed milestones) to request payment.'
      },
      {
        question: 'How long should a business quote remain valid?',
        answer: 'Most freelancers and small businesses set validity periods between 14 to 30 days. This protects you against vendor price changes and scope drift before a project is confirmed.'
      },
      {
        question: 'Does the PDF quote include an approval signature line?',
        answer: 'Yes. BizPilot quote PDFs automatically include a signature approval block with date and client signature fields for formal sign-off.'
      }
    ]
  },

  'proposal-generator': {
    id: 'proposal-generator',
    route: '/tools/proposal-generator',
    toolKey: 'proposal-gen',
    name: 'Proposal Generator',
    title: 'Free Proposal Generator — Create Client Project Proposals | BizPilot',
    description: 'Generate comprehensive client project proposals with scope of work, deliverables, timeline, milestones, and investment pricing in downloadable PDF format.',
    h1: 'Free Project Proposal Generator',
    introduction: 'Win high-value client contracts with structured, executive project proposals. Present project scope, milestones, deliverables, payment terms, and client sign-off in a beautifully styled multi-page PDF document created entirely in your browser.',
    category: 'Business',
    isPremium: true,
    howToUseSteps: [
      'Enter your business name, lead contact, and client details.',
      'Write your project description, scope of work, deliverables, and timeline milestones.',
      'Specify the total investment amount and payment terms (such as 50% deposit / 50% completion).',
      'Download a multi-page PDF proposal featuring an executive header, clean divider sections, and sign-off blocks.'
    ],
    relatedTools: [
      {
        id: 'quote-gen',
        name: 'Quote Generator',
        route: '/tools/quote-generator',
        reason: 'Provide quick standalone pricing estimates for smaller quick-turnaround jobs.',
        badge: 'Recommended'
      },
      {
        id: 'invoice-gen',
        name: 'Invoice Generator',
        route: '/tools/invoice-generator',
        reason: 'Bill your initial deposit or milestone payments once the proposal is signed.',
      },
      {
        id: 'word-counter',
        name: 'Word Counter',
        route: '/tools/word-counter',
        reason: 'Review your project description and scope text to ensure concise, professional phrasing.',
      }
    ],
    faqs: [
      {
        question: 'What essential sections should every client project proposal have?',
        answer: 'A high-converting client proposal includes an executive project overview, defined scope of work, clear deliverables, expected timeline or milestones, transparent investment pricing, and formal payment terms with acceptance sign-off.'
      },
      {
        question: 'Can I leave optional proposal sections empty?',
        answer: 'Yes. Any section left empty (such as additional notes or deliverables) is cleanly omitted from the final PDF export without leaving blank white gaps.'
      },
      {
        question: 'Are my proposals kept confidential?',
        answer: 'Completely. Generation happens 100% on your device using client-side JavaScript. No client names, proprietary project scopes, or pricing details are sent to our servers.'
      }
    ]
  }
};
