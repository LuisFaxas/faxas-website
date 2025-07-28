import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  ActionCodeSettings
} from 'firebase/auth';
import { auth } from './config';

// Auth providers
const googleProvider = new GoogleAuthProvider();

// Set auth persistence
export const setAuthPersistence = async (rememberMe: boolean) => {
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
  try {
    // Set persistence before signing in
    await setAuthPersistence(rememberMe);
    
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Log auth event
    await logAuthEvent('sign_in', { method: 'email', userId: result.user.uid });
    
    return { user: result.user, error: null };
  } catch (error: any) {
    await logAuthEvent('sign_in_failed', { method: 'email', error: error.code });
    return { user: null, error: error.message };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    
    await logAuthEvent('sign_up', { method: 'email', userId: result.user.uid });
    
    return { user: result.user, error: null };
  } catch (error: any) {
    await logAuthEvent('sign_up_failed', { method: 'email', error: error.code });
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await logAuthEvent('sign_in', { method: 'google', userId: result.user.uid });
    return { user: result.user, error: null };
  } catch (error: any) {
    await logAuthEvent('sign_in_failed', { method: 'google', error: error.code });
    return { user: null, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const userId = auth.currentUser?.uid;
    await firebaseSignOut(auth);
    if (userId) {
      await logAuthEvent('sign_out', { userId });
    }
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => auth.currentUser;

// Check if user is admin by checking Firestore role
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // First check custom claims (most reliable)
    // Force refresh to get latest claims
    const idTokenResult = await user.getIdTokenResult(true);
    if (idTokenResult.claims.admin === true) {
      return true;
    }
    
    // Then check Firestore document
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('./config');
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Magic link authentication
const actionCodeSettings: ActionCodeSettings = {
  url: typeof window !== 'undefined' ? `${window.location.origin}/login?magic=true` : 'https://faxas.net/login?magic=true',
  handleCodeInApp: true,
};

export const sendMagicLink = async (email: string) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Save email for sign-in completion
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', email);
    }
    await logAuthEvent('magic_link_sent', { method: 'email' });
    return { error: null };
  } catch (error: any) {
    await logAuthEvent('magic_link_failed', { error: error.code });
    return { error: error.message };
  }
};

export const signInWithMagicLink = async (email: string, link: string) => {
  try {
    if (isSignInWithEmailLink(auth, link)) {
      const result = await signInWithEmailLink(auth, email, link);
      // Clear email from storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('emailForSignIn');
      }
      await logAuthEvent('sign_in', { method: 'magic_link', userId: result.user.uid });
      return { user: result.user, error: null };
    }
    return { user: null, error: 'Invalid sign-in link' };
  } catch (error: any) {
    await logAuthEvent('sign_in_failed', { method: 'magic_link', error: error.code });
    return { user: null, error: error.message };
  }
};

// Auth event logging
async function logAuthEvent(eventType: string, data: Record<string, any>) {
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('./config');
    
    await addDoc(collection(db, 'auth_events'), {
      type: eventType,
      data,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      ip: null, // Would need server-side for real IP
    });
  } catch (error) {
    console.error('Error logging auth event:', error);
  }
}