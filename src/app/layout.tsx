import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
// import { MonitoringProvider } from "@/components/providers/MonitoringProvider";
// import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ToastContainer } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// import { CookieConsent } from "@/components/CookieConsent";
import { StructuredData, organizationSchema, websiteSchema } from "@/components/seo/StructuredData";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.metadata.title(),
  description: siteConfig.metadata.description.en,
  keywords: siteConfig.metadata.keywords.en,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: `${siteConfig.name} Portfolio`,
    title: siteConfig.metadata.title(),
    description: siteConfig.metadata.description.en,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metadata.title(),
    description: siteConfig.metadata.description.en,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData type="Organization" data={organizationSchema} />
        <StructuredData type="WebSite" data={websiteSchema} />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
