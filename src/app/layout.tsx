import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastContainer } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://faxas.net'),
  title: "FAXAS | Premium Web Development Portfolio",
  description: "Transform your vision into stunning digital experiences. Explore interactive demos and learn about modern web development through live examples.",
  keywords: "web development, portfolio, React, Next.js, TypeScript, interactive demos, glassmorphic design",
  authors: [{ name: "FAXAS" }],
  creator: "FAXAS",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://faxas.net",
    siteName: "FAXAS Portfolio",
    title: "FAXAS | Premium Web Development Portfolio",
    description: "Transform your vision into stunning digital experiences. Explore interactive demos and learn about modern web development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FAXAS Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAXAS | Premium Web Development Portfolio",
    description: "Transform your vision into stunning digital experiences.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
