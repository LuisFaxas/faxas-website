# Firebase Setup Instructions

## 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

## 2. Login to Firebase
```bash
firebase login
```

## 3. Initialize Firebase in the project
```bash
# Run this in the faxas_website directory
firebase init

# Select the following options:
# - Firestore
# - Storage
# - Emulators (optional but recommended for local development)
# - Select your existing project: faxas-website
# - Use the default files we've created
```

## 4. Deploy Security Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

## 5. Enable Authentication Methods
Go to Firebase Console > Authentication > Sign-in method and enable:
- Email/Password
- Google

## 6. Create Initial Admin User
After deploying, you'll need to:
1. Create a user account through the app
2. Go to Firebase Console > Firestore
3. Create a document in `users` collection with the user's UID
4. Add a field `role: "admin"` to give admin privileges

## 7. Set up Custom Claims for Admin (Optional)
You can also use Firebase Admin SDK to set custom claims:
```javascript
// This would be in a Cloud Function or server-side script
admin.auth().setCustomUserClaims(uid, { admin: true });
```

## 8. Test the Setup
Visit: http://localhost:3000/api/test-firebase

This should now work after the rules are deployed.