const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

console.log('🔧 Admin Setup Script');
console.log('====================\n');

// Function to find the service account key
function findServiceAccountKey() {
  const possiblePaths = [
    path.join(process.cwd(), 'service-account-key.json'),
    path.join(process.cwd(), 'faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json'),
    'C:\\Users\\MrFax\\Documents\\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json',
    'C:\\Users\\MrFax\\Downloads\\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json',
    'C:\\Users\\MrFax\\Desktop\\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json',
  ];

  console.log('Looking for service account key...');
  
  for (const keyPath of possiblePaths) {
    if (fs.existsSync(keyPath)) {
      console.log(`✅ Found key at: ${keyPath}`);
      return keyPath;
    }
  }
  
  console.error('❌ Service account key not found!');
  console.error('\nPlease copy your key to one of these locations:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  return null;
}

async function setupAdmin() {
  // Find service account key
  const keyPath = findServiceAccountKey();
  if (!keyPath) {
    process.exit(1);
  }

  // Initialize Firebase Admin
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log('\n✅ Firebase Admin initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    process.exit(1);
  }

  const db = admin.firestore();
  const auth = admin.auth();
  const email = 'faxascode@gmail.com';

  try {
    console.log(`\n📧 Processing ${email}...`);
    
    // Try to get user from Auth
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`✅ Found user in Auth: ${user.uid}`);
    } catch (error) {
      console.log('⚠️  User not found in Auth. Have you created the account yet?');
      console.log('   Please go to http://localhost:3000/register and create the account first.');
      process.exit(1);
    }
    
    // Set custom claims
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('✅ Set admin custom claim');
    
    // Create/Update Firestore document
    const userRef = db.collection('users').doc(user.uid);
    await userRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'FAXAS Admin',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log('✅ Created/Updated user document in Firestore');
    
    // Verify the document was created
    const doc = await userRef.get();
    if (doc.exists) {
      console.log('\n📄 User document data:');
      console.log(JSON.stringify(doc.data(), null, 2));
    }
    
    console.log(`\n🎉 SUCCESS! ${email} is now an admin!`);
    console.log('\n⚠️  IMPORTANT NEXT STEPS:');
    console.log('1. Sign out from the website');
    console.log('2. Sign back in with faxascode@gmail.com');
    console.log('3. Go to /admin-login');
    console.log('4. You should now have admin access!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('\n⚠️  The account faxascode@gmail.com does not exist yet.');
      console.error('   Please create it first at: http://localhost:3000/register');
    }
  }
}

// Run the setup
setupAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });