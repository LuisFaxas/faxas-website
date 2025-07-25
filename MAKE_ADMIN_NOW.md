# 🚨 MAKE faxascode@gmail.com ADMIN NOW

You're getting "Access Denied" because faxascode@gmail.com is not set as admin yet.

## Quick Fix (Via Firebase Console - No Files Needed!)

1. **Open Firebase Console**: https://console.firebase.google.com

2. **Select**: faxas-website project

3. **Go to**: Firestore Database (left sidebar)

4. **Click**: "Data" tab

5. **Navigate to**:
   - Click `users` collection
   - Find the document for faxascode@gmail.com (it will have a long ID)

6. **Add Admin Role**:
   - Click "+ Add field" button
   - Field name: `role`
   - Type: `string`
   - Value: `admin`
   - Click "Save"

7. **Sign Out and Back In**:
   - Go back to your website
   - Sign out (if still logged in)
   - Go to /admin-login
   - Login with faxascode@gmail.com
   - You should now have admin access!

## Alternative: Using Script (Requires Service Account Key)

1. Double-click: `COPY_SERVICE_KEY.bat`
2. Then run: `node make-faxas-admin.js`

That's it! The Firebase Console method is easiest and doesn't require any files.