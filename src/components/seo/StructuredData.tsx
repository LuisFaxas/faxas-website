import Script from 'next/script';

interface StructuredDataProps {
  type: 'Organization' | 'Person' | 'WebSite' | 'Service' | 'CreativeWork';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
      strategy="beforeInteractive"
    />
  );
}

// Pre-configured structured data for the website
export const organizationSchema = {
  name: 'FAXAS.NET',
  alternateName: 'Luis Faxas Web Development',
  url: 'https://faxas.net',
  logo: 'https://faxas.net/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@faxas.net',
    contactType: 'customer service',
    areaServed: 'Worldwide',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: [
    'https://github.com/LuisFaxas',
    'https://linkedin.com/in/luisfaxas',
    'https://twitter.com/luisfaxas',
  ],
  description: 'Premium web development services transforming businesses with modern React and Next.js applications. Proven results with 276% average improvement.',
  founder: {
    '@type': 'Person',
    name: 'Luis Faxas',
    jobTitle: 'Full-Stack Developer',
    description: 'Expert in React, Next.js, and modern web technologies',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '50',
    bestRating: '5',
    worstRating: '1',
  },
};

export const websiteSchema = {
  name: 'FAXAS.NET - Premium Web Development',
  description: 'Transform your business with blazing-fast websites that convert visitors into customers. Expert React & Next.js development.',
  url: 'https://faxas.net',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://faxas.net/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const serviceSchema = {
  '@type': 'Service',
  serviceType: 'Web Development',
  provider: {
    '@type': 'Organization',
    name: 'FAXAS.NET',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Development Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Web Application Development',
          description: 'Full-stack web applications built with React, Next.js, and modern technologies',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'E-Commerce Development',
          description: 'High-converting online stores with real-time inventory management',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Optimization',
          description: 'Speed up your existing website for better conversions and SEO',
        },
      },
    ],
  },
};

export function generateProjectSchema(project: any) {
  return {
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `https://faxas.net/projects/${project.slug}`,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    creator: {
      '@type': 'Organization',
      name: 'FAXAS.NET',
    },
    keywords: project.techStack.join(', '),
    image: project.images?.[0],
    aggregateRating: project.metrics ? {
      '@type': 'AggregateRating',
      ratingValue: ((project.metrics.desktop + project.metrics.mobile) / 2).toString(),
      bestRating: '100',
      worstRating: '0',
    } : undefined,
    interactionStatistic: project.metrics?.improvement ? {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/LikeAction',
      userInteractionCount: project.metrics.improvement,
    } : undefined,
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}