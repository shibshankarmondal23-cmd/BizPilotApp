import { useEffect } from 'react';
import { ToolSeoConfig } from '../data/seoData';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  type?: 'website' | 'article';
  schema?: object;
}

const DEFAULT_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-fgpo6nibsjeaaysno2syii-791957939414.asia-southeast1.run.app';

export function updateMetaTags({
  title,
  description,
  canonicalPath,
  type = 'website',
  schema,
}: SeoProps) {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  document.title = title;

  // 2. Canonical URL
  const canonicalUrl = `${DEFAULT_ORIGIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 3. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // 4. Robots
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    document.head.appendChild(metaRobots);
  }
  metaRobots.setAttribute('content', 'index, follow');

  // 5. Open Graph
  const setMetaProperty = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', title);
  setMetaProperty('og:description', description);
  setMetaProperty('og:url', canonicalUrl);
  setMetaProperty('og:type', type);
  setMetaProperty('og:site_name', 'BizPilot');

  // 6. Twitter Card
  const setMetaName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', title);
  setMetaName('twitter:description', description);

  // 7. Schema.org JSON-LD
  let schemaScript = document.getElementById('seo-json-ld');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'seo-json-ld';
    schemaScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(schemaScript);
  }

  if (schema) {
    schemaScript.textContent = JSON.stringify(schema, null, 2);
  } else {
    schemaScript.textContent = '';
  }
}

/**
 * Generate Schema.org JSON-LD for the Homepage
 */
export function getHomepageSchema(origin = DEFAULT_ORIGIN) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'url': `${origin}/`,
        'name': 'BizPilot',
        'description': 'BizPilot provides practical business calculators, productivity tools, invoice, quote and proposal generators for freelancers, solopreneurs and small businesses.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${origin}/tools?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        'name': 'BizPilot',
        'url': `${origin}/`,
        'logo': `${origin}/favicon.ico`,
        'slogan': 'Your Business, Simplified.'
      }
    ]
  };
}

/**
 * Generate Schema.org JSON-LD for a Tool Page
 */
export function getToolPageSchema(tool: ToolSeoConfig, origin = DEFAULT_ORIGIN) {
  const toolUrl = `${origin}${tool.route}`;

  const graph: object[] = [
    {
      '@type': 'WebApplication',
      '@id': `${toolUrl}#app`,
      'name': tool.name,
      'url': toolUrl,
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
      '@id': `${toolUrl}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': `${origin}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Tools',
          'item': `${origin}/tools`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tool.name,
          'item': toolUrl
        }
      ]
    }
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${toolUrl}#faq`,
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

/**
 * Generate Schema.org for Legal & Static Pages
 */
export function getPageSchema(name: string, path: string, description: string, origin = DEFAULT_ORIGIN) {
  const pageUrl = `${origin}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        'url': pageUrl,
        'name': name,
        'description': description
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': name,
            'item': pageUrl
          }
        ]
      }
    ]
  };
}

export function useSeo(props: SeoProps) {
  useEffect(() => {
    updateMetaTags(props);
  }, [props.title, props.description, props.canonicalPath, props.type]);
}
