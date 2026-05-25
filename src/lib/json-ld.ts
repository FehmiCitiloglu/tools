/**
 * Generate JSON-LD structured data for a software application (tool)
 */
export function generateToolJsonLd(params: {
  name: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
}): Record<string, unknown> {
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
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, unknown> {
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
 * Generate JSON-LD structured data for a blog post
 */
export function generateBlogPostJsonLd(params: {
  title: string;
  description: string;
  url: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  image: string;
  tags: string[];
  publisherName: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.image,
    datePublished: params.publishedAt.toISOString(),
    dateModified: (params.updatedAt ?? params.publishedAt).toISOString(),
    keywords: params.tags.join(', '),
    author: {
      '@type': 'Person',
      name: params.author,
    },
    publisher: {
      '@type': 'Organization',
      name: params.publisherName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
  };
}

/**
 * Combine multiple JSON-LD graphs into one script payload
 */
export function generateJsonLdGraph(items: Array<Record<string, unknown>>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map((item) => {
      const { '@context': _context, ...rest } = item;
      return rest;
    }),
  };
}

/**
 * Generate JSON-LD for the website/organization
 */
export function generateWebsiteJsonLd(params: {
  name: string;
  url: string;
  description: string;
}): Record<string, unknown> {
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
