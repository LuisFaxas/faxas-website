import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Auth providers
const googleProvider = new GoogleAuthProvider();

// User profile interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'user' | 'admin';
  emailVerified?: boolean;
  createdAt?: any;
  updatedAt?: any;
  lastLoginAt?: any;
  preferences?: {
    newsletter?: boolean;
    notifications?: boolean;
  };
}

// Error messages
const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed.';
    case 'auth/cancelled-popup-request':
      return 'Another popup is already open.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Create or update user profile in Firestore
const createOrUpdateUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create new user profile
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user',
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      preferences: {
        newsletter: true,
        notifications: true,
      },
    };

    await setDoc(userRef, userData);
  } else {
    // Update existing user profile
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      emailVerified: user.emailVerified,
      updatedAt: serverTimestamp(),
    });
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Send verification email
    await sendEmailVerification(user);
    
    await createOrUpdateUserProfile(user);
    
    return { 
      user, 
      error: null,
      message: 'Account created! Please check your email to verify your account.'
    };
  } catch (error: any) {
    return { 
      user: null, 
      error: getErrorMessage(error.code),
      message: null
    };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await createOrUpdateUserProfile(user);
    
    return { user, error: null };
  } catch (error: any) {
    return { 
      user: null, 
      error: getErrorMessage(error.code)
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUserProfile(user);
    
    return { user, error: null };
  } catch (error: any) {
    return { 
      user: null, 
      error: getErrorMessage(error.code)
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      error: null,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error: any) {
    return { 
      error: getErrorMessage(error.code),
      message: null
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      return {
        error: null,
        message: 'Verification email sent! Check your inbox.'
      };
    }
    return {
      error: 'No user found or email already verified.',
      message: null
    };
  } catch (error: any) {
    return {
      error: getErrorMessage(error.code),
      message: null
    };
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Check if user is admin
export const isUserAdmin = async (user: User): Promise<boolean> => {
  try {
    // First check custom claims
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin) {
      return true;
    }
    
    // Then check Firestore
    const profile = await getUserProfile(user.uid);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => auth.currentUser;