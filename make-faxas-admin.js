// Quick script to make faxascode@gmail.com an admin
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ ERROR: service-account-key.json not found!');
    console.error('\nPlease copy your Firebase service account key to:');
    console.error(serviceAccountPath);
    console.error('\nFrom: C:\\Users\\MrFax\\Documents\\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json');
    process.exit(1);
  }

  const serviceAccount = require('./service-account-key.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin SDK initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

async function makeFaxasAdmin() {
  const email = 'faxascode@gmail.com';
  
  try {
    console.log(`\n🔄 Making ${email} an admin...`);
    
    // Get user by email
    const user = await auth.getUserByEmail(email);
    console.log(`✅ Found user: ${user.uid}`);
    
    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('✅ Set admin custom claim');
    
    // Update Firestore
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || 'FAXAS Admin',
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log('✅ Updated Firestore user document');
    
    console.log(`\n🎉 SUCCESS! ${email} is now an admin!`);
    console.log('\n⚠️  IMPORTANT: Please sign out and sign back in on the website for changes to take effect.\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error('\n⚠️  Make sure you have created an account with faxascode@gmail.com first!');
    }
  }
}

// Run the script
makeFaxasAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });