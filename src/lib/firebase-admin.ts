import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  try {
    // Try different paths for the service account key
    const possiblePaths = [
      path.join(process.cwd(), 'service-account-key.json'),
      path.join(process.cwd(), 'faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json'),
      './service-account-key.json',
    ];

    let serviceAccountPath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        serviceAccountPath = p;
        break;
      }
    }

    if (!serviceAccountPath) {
      throw new Error('Service account key not found. Please ensure service-account-key.json is in the project root.');
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || serviceAccount.project_id,
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    console.error('Make sure your service account key is placed at the project root as service-account-key.json');
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Set custom claims for a user (make them admin)
export async function setAdminClaim(uid: string): Promise<void> {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    console.log(`Successfully set admin claim for user ${uid}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    throw error;
  }
}

// Remove admin claim from a user
export async function removeAdminClaim(uid: string): Promise<void> {
  try {
    await adminAuth.setCustomUserClaims(uid, { admin: false });
    console.log(`Successfully removed admin claim for user ${uid}`);
  } catch (error) {
    console.error('Error removing admin claim:', error);
    throw error;
  }
}

// Get user by email and make them admin
export async function makeUserAdminByEmail(email: string): Promise<void> {
  try {
    const user = await adminAuth.getUserByEmail(email);
    await setAdminClaim(user.uid);
    
    // Also update Firestore for consistency
    await adminDb.collection('users').doc(user.uid).set({
      email: user.email,
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log(`Successfully made ${email} an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
}

// Verify if a user is admin
export async function verifyAdminStatus(uid: string): Promise<boolean> {
  try {
    const user = await adminAuth.getUser(uid);
    return user.customClaims?.admin === true;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
}