import { Firestore, enableNetwork, disableNetwork, clearIndexedDbPersistence, terminate } from 'firebase/firestore';

export async function recoverFromFirestoreError(db: Firestore, error: any) {
  console.error('Firestore error:', error);
  
  // If it's an internal assertion error, try to recover
  if (error.message?.includes('INTERNAL ASSERTION FAILED')) {
    try {
      // Try to disable and re-enable network
      await disableNetwork(db);
      await enableNetwork(db);
      console.log('Recovered from Firestore error by resetting network');
    } catch (recoveryError) {
      console.error('Failed to recover from Firestore error:', recoveryError);
      
      // As a last resort, reload the page
      if (typeof window !== 'undefined') {
        console.log('Reloading page to recover from Firestore error');
        window.location.reload();
      }
    }
  }
}

export async function clearFirestoreCache(db: Firestore) {
  try {
    await terminate(db);
    await clearIndexedDbPersistence(db);
    console.log('Firestore cache cleared');
  } catch (error) {
    console.error('Failed to clear Firestore cache:', error);
  }
}