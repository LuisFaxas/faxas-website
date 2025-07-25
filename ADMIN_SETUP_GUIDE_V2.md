# 🔐 Admin Setup Guide for FAXAS.NET (Using Service Account)

This guide will walk you through setting up admin access using Firebase Admin SDK with a service account key.

## Prerequisites

- Firebase project created
- Service account key downloaded from Firebase Console
- Node.js installed

## Step 1: Set Up Service Account

1. **Download your service account key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file

2. **Place the key in your project**
   ```bash
   # Copy your service account key to the project root
   # Rename it to: service-account-key.json
   # Make sure it's in .gitignore (already added)
   ```

3. **Important**: Your service account key should be at:
   ```
   C:\1) FAXAS\CODING PROJECTS\faxas.net\faxas_website\service-account-key.json
   ```

## Step 2: Make Yourself Admin

### Method 1: Using the Setup Script (Recommended)

1. **First, create an account**
   - Go to http://localhost:3000/register
   - Sign up with your email

2. **Run the admin script**
   ```bash
   cd "C:\1) FAXAS\CODING PROJECTS\faxas.net\faxas_website"
   node scripts/make-admin.js your-email@example.com
   ```

3. **Sign out and sign back in**
   - This refreshes your authentication token
   - You should now see "Admin" in the navigation

### Method 2: Using the API Endpoint

1. **Update your .env.local**
   ```env
   ADMIN_SECRET_KEY=your-super-secret-key-here
   ```

2. **Make an API call**
   ```bash
   curl -X POST http://localhost:3000/api/admin/make-admin \
     -H "Authorization: Bearer your-super-secret-key-here" \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

### Method 3: Direct Firebase Console

1. **Go to Firebase Console**
   - Authentication → Users tab
   - Find your user and copy the UID

2. **Go to Firestore Database**
   - Create/update document in `users` collection
   - Document ID: [your-uid]
   - Add field: `role` = `admin`

## Step 3: Verify Admin Access

1. **Check your status**
   - Go to http://localhost:3000/debug/auth
   - You should see:
     - Is Admin: ✓ (in Firestore)
     - Custom Claims: admin: true (if using SDK)

2. **Access admin dashboard**
   - Navigate to http://localhost:3000/admin
   - You should see the dashboard

## Troubleshooting

### Service Account Key Not Found

```
Error: ENOENT: no such file or directory, open './service-account-key.json'
```

**Solution**: Make sure your service account key is in the project root and named correctly.

### Permission Denied

```
Error: 7 PERMISSION_DENIED: Missing or insufficient permissions
```

**Solution**: Your service account needs proper permissions. In Firebase Console:
1. Go to IAM & Admin
2. Find your service account
3. Add roles: Firebase Admin, Cloud Datastore User

### User Not Found

```
Error: No user record found for the provided email
```

**Solution**: Make sure you've created an account first at /register

## Security Notes

1. **Never commit your service account key**
   - It's already in .gitignore
   - Keep it secure

2. **In production**
   - Use environment variables for the service account
   - Or use Google Cloud Secret Manager
   - Set up proper IAM roles

3. **Admin API endpoint**
   - Change the ADMIN_SECRET_KEY to something secure
   - In production, use proper authentication

## What Admin Can Do

- **Dashboard** (`/admin`): View statistics and quick actions
- **Lead Management** (`/admin/leads`): Manage and track leads
- **Projects** (coming soon): CRUD operations for projects
- **Analytics** (coming soon): View site analytics
- **Blog** (coming soon): Create and manage blog posts

## Next Steps

1. Test the admin features
2. Submit a test contact form to see leads
3. Explore the admin dashboard
4. Set up Firebase Functions for email notifications

---

Need help? The service account method is the most reliable way to manage admin access in Firebase.