// Centralized site configuration
// Change site name here and it updates everywhere!

export const siteConfig = {
  // Main branding
  name: "FAXAS",
  // Alternative names to consider:
  // name: "Full-Stacked",
  // name: "Faxas Media",
  
  tagline: {
    en: "Premium Web Development Portfolio",
    es: "Portafolio de Desarrollo Web Premium"
  },
  
  // Site URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://faxas.net",
  
  // Contact information
  contact: {
    email: "contact@faxas.net",
    phone: "+1 (555) 123-4567", // Update with your real number
  },
  
  // Social media
  social: {
    twitter: "@faxas",
    linkedin: "faxas",
    github: "LuisFaxas",
  },
  
  // Default language
  defaultLocale: "en",
  locales: ["en", "es"] as const,
  
  // Metadata helpers
  metadata: {
    title: (page?: string, locale: "en" | "es" = "en") => {
      const baseTitle = siteConfig.name;
      if (!page) return `${baseTitle} | ${siteConfig.tagline[locale]}`;
      return `${page} | ${baseTitle}`;
    },
    
    description: {
      en: "Transform your vision into stunning digital experiences. Explore interactive demos and learn about modern web development through live examples.",
      es: "Transforma tu visión en experiencias digitales impresionantes. Explora demos interactivas y aprende sobre desarrollo web moderno a través de ejemplos en vivo."
    },
    
    keywords: {
      en: ["web development", "portfolio", "React", "Next.js", "TypeScript", "interactive demos", "glassmorphic design"],
      es: ["desarrollo web", "portafolio", "React", "Next.js", "TypeScript", "demos interactivas", "diseño glassmórfico"]
    }
  },
  
  // Company info for structured data
  company: {
    legalName: "FAXAS Web Development LLC", // Update with your legal entity
    foundingDate: "2023",
    founders: ["Luis Faxas"],
  }
};

export type SiteConfig = typeof siteConfig;
export type Locale = typeof siteConfig.locales[number];