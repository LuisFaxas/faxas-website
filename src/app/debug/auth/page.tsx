'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { PageLayout } from '@/components/layout/PageLayout';

export default function AuthDebugPage() {
  const { user, userProfile, isAdmin, isAuthenticated } = useAuthStore();
  const [firestoreData, setFirestoreData] = useState<any>(null);
  const [customClaims, setCustomClaims] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthDetails();
  }, [user]);

  const checkAuthDetails = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get Firestore data
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setFirestoreData(userDoc.data());
      }

      // Get custom claims
      const idTokenResult = await user.getIdTokenResult();
      setCustomClaims(idTokenResult.claims);
    } catch (error) {
      console.error('Error fetching auth details:', error);
      toast.error('Error', 'Failed to fetch auth details');
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdmin = async () => {
    if (!user) return;

    try {
      // This won't work from client-side due to security, but shows what needs to be done
      toast.info(
        'Manual Step Required',
        'Go to Firebase Console → Firestore → users → [your-uid] → Add field: role = "admin"'
      );
      
      // Open Firebase console in new tab
      window.open('https://console.firebase.google.com/project/faxas-website/firestore/data/~2Fusers', '_blank');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const refreshAuth = async () => {
    setLoading(true);
    try {
      // Force token refresh
      const currentUser = getCurrentUser();
      if (currentUser) {
        await currentUser.getIdToken(true);
        await checkAuthDetails();
        toast.success('Refreshed', 'Authentication state refreshed');
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      toast.error('Error', 'Failed to refresh auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Information</h1>

        <div className="space-y-6">
          {/* Current Auth State */}
          <GlassPanel className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Authenticated:</span>{' '}
                {isAuthenticated ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <span className="font-medium">Is Admin:</span>{' '}
                {isAdmin ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user?.email || 'Not signed in'}
              </div>
              <div>
                <span className="font-medium">UID:</span> {user?.uid || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Email Verified:</span>{' '}
                {user?.emailVerified ? '✅ Yes' : '❌ No'}
              </div>
            </div>
          </GlassPanel>

          {/* Firestore User Document */}
          <GlassPanel className="p-6">
            <h2 className="text-xl font-semibold mb-4">Firestore User Document</h2>
            {loading ? (
              <p>Loading...</p>
            ) : firestoreData ? (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(firestoreData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No Firestore document found</p>
            )}
          </GlassPanel>

          {/* Custom Claims */}
          <GlassPanel className="p-6">
            <h2 className="text-xl font-semibold mb-4">Custom Claims (Token)</h2>
            {loading ? (
              <p>Loading...</p>
            ) : customClaims ? (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(customClaims, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No custom claims</p>
            )}
          </GlassPanel>

          {/* Actions */}
          <GlassPanel className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              <div>
                <Button onClick={refreshAuth} disabled={!user || loading}>
                  Refresh Auth State
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Force refresh authentication token and check admin status
                </p>
              </div>

              {!isAdmin && (
                <div>
                  <Button onClick={makeUserAdmin} variant="primary" disabled={!user}>
                    Make Me Admin
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Opens Firebase Console where you can add role = "admin" to your user document
                  </p>
                </div>
              )}
            </div>
          </GlassPanel>

          {/* Instructions */}
          <GlassPanel className="p-6">
            <h2 className="text-xl font-semibold mb-4">How to Make Yourself Admin</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Make Me Admin" button above to open Firebase Console</li>
              <li>Find your user document (search by your UID: {user?.uid})</li>
              <li>Click on the document to open it</li>
              <li>Click "Add field" button</li>
              <li>Add field name: <code className="bg-gray-200 px-1">role</code></li>
              <li>Set type to: <code className="bg-gray-200 px-1">string</code></li>
              <li>Set value to: <code className="bg-gray-200 px-1">admin</code></li>
              <li>Click Save</li>
              <li>Come back here and click "Refresh Auth State"</li>
              <li>You should now see "Is Admin: ✅ Yes"</li>
            </ol>
          </GlassPanel>
        </div>
      </div>
    </PageLayout>
  );
}