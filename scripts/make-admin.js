#!/usr/bin/env node

const admin = require('firebase-admin');
const path = require('path');

// Load service account
const serviceAccount = require('../service-account-key.json');

// Initialize admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function makeUserAdmin(email) {
  try {
    console.log(`Making ${email} an admin...`);
    
    // Get user by email
    const user = await auth.getUserByEmail(email);
    console.log(`Found user: ${user.uid}`);
    
    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('Set admin custom claim');
    
    // Update Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || email.split('@')[0],
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log('Updated Firestore user document');
    
    console.log(`\n✅ Successfully made ${email} an admin!`);
    console.log('\nIMPORTANT: The user needs to sign out and sign back in for the changes to take effect.');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/make-admin.js <email>');
  console.log('Example: node scripts/make-admin.js admin@example.com');
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('Error: Invalid email format');
  process.exit(1);
}

makeUserAdmin(email).then(() => process.exit(0));