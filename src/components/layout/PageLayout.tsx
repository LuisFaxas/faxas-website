import { Navigation } from './Navigation';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Footer } from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

export function PageLayout({ children, showBackground = true }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      {showBackground && <AnimatedBackground />}
      <Navigation />
      <main className="relative z-10 pt-20 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}