import Link from 'next/link';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassPanel level="primary" className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-red/20 flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-accent-red" />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Project Not Found
        </h1>
        
        <p className="text-text-secondary mb-8">
          The project you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link href="/projects">
          <Button variant="primary" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </GlassPanel>
    </div>
  );
}