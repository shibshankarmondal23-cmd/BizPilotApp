import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://biz-pilot-app.vercel.app';

const ROUTES = [
  {
    route: '/tools',
    title: 'Business Tools & Calculators for Freelancers & Small Business | BizPilot',
    description: 'Explore all BizPilot free tools: percentage calculator, profit margin calculator, hourly rate calculator, word counter, image resizer, and document generators.'
  },
  {
    route: '/tools/percentage-calculator',
    title: 'Percentage Calculator — Quick Percent Amounts & Changes | BizPilot',
    description: 'Calculate percentages of any number, calculate percentage increases or decreases, and calculate discounts and tax amounts instantly in your browser.'
  },
  {
    route: '/tools/profit-margin-calculator',
    title: 'Profit Margin Calculator — Markup & Gross Margin | BizPilot',
    description: 'Calculate gross profit margin, markup percentage, and profit amounts for freelance projects, retail goods, and digital client services.'
  },
  {
    route: '/tools/hourly-rate-calculator',
    title: 'Freelance Hourly Rate Calculator — Set Profitable Rates | BizPilot',
    description: 'Calculate your ideal freelance hourly rate based on target income, business expenses, billable client hours, and tax deductions.'
  },
  {
    route: '/tools/word-counter',
    title: 'Word & Character Counter — Real-Time Text Analysis | BizPilot',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading and speaking time in real time with our free browser text counter.'
  },
  {
    route: '/tools/image-resizer',
    title: 'Free Image Resizer & Optimizer — In-Browser Fast Resize | BizPilot',
    description: 'Resize JPG, PNG, and WebP images by exact pixel dimensions or percentage scaling with instant JPEG compression optimization right in your browser.'
  },
  {
    route: '/tools/invoice-generator',
    title: 'Free Invoice Generator for Freelancers — PDF Export | BizPilot',
    description: 'Create professional client invoices with custom line items, tax, discounts, and payment notes. Export instantly to PDF with zero watermarks.'
  },
  {
    route: '/tools/quote-generator',
    title: 'Free Price Quote Generator for Freelancers & Contractors | BizPilot',
    description: 'Generate clean, itemized pricing estimates and project quotes with line items, expiry dates, terms, and instant PDF download.'
  },
  {
    route: '/tools/proposal-generator',
    title: 'Free Project Proposal Generator — Win Client Projects | BizPilot',
    description: 'Build comprehensive client project proposals with executive summaries, scope of work, deliverables, investment pricing, and signing lines.'
  },
  {
    route: '/pricing',
    title: 'BizPilot Pricing — Free & Premium Business Tool Plans',
    description: 'Transparent, budget-friendly pricing for freelancers and small businesses. Start free forever or upgrade to BizPilot Premium for just $5/month.'
  },
  {
    route: '/about',
    title: 'About BizPilot — Practical Business Tools for Solopreneurs',
    description: 'Learn about BizPilot\'s mission to provide fast, privacy-first business calculators and document generators for freelancers and small business owners.'
  },
  {
    route: '/contact',
    title: 'Contact BizPilot — Support & Feedback',
    description: 'Get in touch with the BizPilot team for questions, support, or tool feature requests.'
  },
  {
    route: '/privacy',
    title: 'Privacy Policy — BizPilot',
    description: 'Read BizPilot\'s privacy policy. All tools run 100% in your browser with zero storage or tracking of your financial figures and documents.'
  },
  {
    route: '/terms',
    title: 'Terms of Service — BizPilot',
    description: 'Terms of service and usage guidelines for BizPilot\'s free and premium business tools.'
  },
  {
    route: '/disclaimer',
    title: 'Financial & Tool Disclaimer — BizPilot',
    description: 'Important calculation and legal disclaimer for BizPilot tools and document generators.'
  }
];

const distDir = path.resolve(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

for (const { route, title, description } of ROUTES) {
  const targetDir = path.join(distDir, ...route.split('/'));
  fs.mkdirSync(targetDir, { recursive: true });

  const canonicalUrl = `${DOMAIN}${route}`;

  let html = template;
  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  
  // Replace Description
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);

  // Replace Canonical Link
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace Open Graph tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`Generated static fallback route: ${route} -> ${targetFile}`);
}

console.log(`Successfully generated ${ROUTES.length} static fallback routes for Vercel.`);
