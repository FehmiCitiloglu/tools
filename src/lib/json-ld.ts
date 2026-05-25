/**
 * Generate JSON-LD structured data for a software application (tool)
 */
export function generateToolJsonLd(params: {
  name: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    description: params.description,
    url: params.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    keywords: params.keywords.join(', '),
  };
}

/**
 * Generate JSON-LD for breadcrumb navigation
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD for the website/organization
 */
export function generateWebsiteJsonLd(params: {
  name: string;
  url: string;
  description: string;
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: params.name,
    url: params.url,
    description: params.description,
    publisher: {
      '@type': 'Organization',
      name: params.name,
    },
  };
}
