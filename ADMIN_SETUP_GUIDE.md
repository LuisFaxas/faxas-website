# 🔐 Admin Setup Guide for FAXAS.NET

This guide will walk you through setting up admin access for your FAXAS portfolio site.

## Prerequisites

- Firebase project created and configured
- Development server running (`npm run dev`)
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step-by-Step Admin Setup

### 1️⃣ Create Your Account

1. **Start your development server**
   ```bash
   cd faxas_website
   npm run dev
   ```

2. **Navigate to registration**
   - Open: http://localhost:3000/register
   - Create an account using:
     - Email/Password, OR
     - Google Sign-in

3. **Verify your email** (if using email/password)
   - Check your inbox for verification email
   - Click the verification link

### 2️⃣ Grant Admin Access

You have three methods to make your account an admin:

#### Method A: Firebase Console (Recommended for beginners)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project: `faxas-website`

2. **Navigate to Firestore**
   - Click "Firestore Database" in the left sidebar
   - Click on the "Data" tab

3. **Find your user document**
   - Click on `users` collection
   - Find your document (look for your email)
   - Click on the document ID

4. **Add admin role**
   - Click "Add field" (+ icon)
   - Field name: `role`
   - Type: `string`
   - Value: `admin`
   - Click "Save"

![Admin Role Setup](docs/admin-role-setup.png)

#### Method B: Using Firebase Admin SDK

Create a file `scripts/make-admin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function makeAdmin(email) {
  // Get user by email
  const user = await admin.auth().getUserByEmail(email);
  
  // Set custom claims
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  
  // Update Firestore document
  await admin.firestore().collection('users').doc(user.uid).update({
    role: 'admin'
  });
  
  console.log(`Successfully made ${email} an admin!`);
}

// Replace with your email
makeAdmin('your-email@example.com')
  .then(() => process.exit(0))
  .catch(console.error);
```

Run it:
```bash
node scripts/make-admin.js
```

#### Method C: Quick Firestore Script (Development Only)

In your browser console at http://localhost:3000:

```javascript
// First, make sure you're logged in
// Then run this in the console (F12 → Console tab)

// This won't work due to security rules, but shows the concept
// You'll need to use Method A or B instead
```

### 3️⃣ Verify Admin Access

1. **Sign out completely**
   - Click your profile icon
   - Select "Sign Out"

2. **Sign back in**
   - Use the same credentials
   - This refreshes your authentication token

3. **Check admin access**
   - You should see "Admin" in the navigation
   - Go to: http://localhost:3000/admin
   - You should see the admin dashboard

### 4️⃣ Deploy Security Rules

Before going to production, deploy your security rules:

```bash
# Login to Firebase CLI
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules (for future file uploads)
firebase deploy --only storage:rules
```

## Troubleshooting

### "Access Denied" to Admin Dashboard

1. **Check role field**
   - In Firestore, ensure `role` field is exactly `admin` (lowercase)
   - No extra spaces or different casing

2. **Clear browser data**
   ```javascript
   // In browser console
   localStorage.clear();
   // Then refresh and login again
   ```

3. **Verify authentication state**
   ```javascript
   // In browser console after logging in
   const authState = JSON.parse(localStorage.getItem('auth-storage'));
   console.log('Is Admin?', authState?.state?.isAdmin);
   console.log('User Profile:', authState?.state?.userProfile);
   ```

### Permission Errors in Firestore

1. **Check if rules are deployed**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Verify in Firebase Console**
   - Go to Firestore → Rules tab
   - Ensure rules match your `firestore.rules` file

### Can't Find User in Firestore

1. **Check collection name**
   - Should be `users` (plural)
   - Case sensitive

2. **Manually create user document**
   - Collection: `users`
   - Document ID: Your user's UID (from Authentication tab)
   - Fields:
     ```
     email: "your-email@example.com"
     role: "admin"
     displayName: "Your Name"
     uid: "your-uid-here"
     ```

## Admin Features Available

Once you're an admin, you can:

1. **Dashboard** (`/admin`)
   - View lead statistics
   - See recent activity
   - Quick action buttons

2. **Lead Management** (`/admin/leads`)
   - View all leads
   - Update lead status
   - Filter and search leads
   - View lead details

3. **Future Features**
   - Project management
   - Blog post creation
   - Analytics dashboard
   - Media library

## Security Best Practices

1. **Production Setup**
   - Use Firebase Admin SDK for setting admin roles
   - Enable 2FA on your Firebase account
   - Regularly audit admin users

2. **Role Management**
   - Keep admin list minimal
   - Document who has admin access
   - Remove admin access when no longer needed

3. **Monitoring**
   - Check Firebase Auth logs regularly
   - Monitor Firestore usage
   - Set up alerts for unusual activity

## Next Steps

1. Test all admin features
2. Submit a test lead to see it in the admin panel
3. Customize the dashboard for your needs
4. Set up email notifications (Firebase Functions)

---

Need help? Check the main README or open an issue on GitHub.