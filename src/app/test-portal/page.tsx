'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TestPortalPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Portal Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Auth Status:</h2>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>User: {user ? user.email : 'Not logged in'}</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold mb-2">Test Portal Access:</h2>
            
            <Button
              onClick={() => router.push('/portal')}
              variant="primary"
            >
              Go to /portal (should redirect to onboarding if not logged in)
            </Button>

            <Button
              onClick={() => router.push('/portal/onboarding')}
              variant="secondary"
            >
              Go directly to /portal/onboarding
            </Button>

            <Button
              onClick={() => router.push('/portal/dashboard')}
              variant="secondary"
            >
              Go to /portal/dashboard (requires auth)
            </Button>

            {user && (
              <Button
                onClick={() => signOut()}
                variant="secondary"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}