# Creating Admin User Manually in Firebase

Since you don't see a `users` collection, let's create it manually.

## Steps in Firebase Console:

1. **Go to Firebase Console**: https://console.firebase.google.com

2. **Select**: faxas-website project

3. **Go to**: Authentication (left sidebar)
   - Click "Users" tab
   - Find faxascode@gmail.com
   - Copy the User UID (long string like "AbCdEfGhIjKlMnOpQrStUvWxYz")

4. **Go to**: Firestore Database (left sidebar)

5. **Create the users collection**:
   - Click "Start collection"
   - Collection ID: `users`
   - Click "Next"

6. **Create the admin document**:
   - Document ID: Paste the User UID you copied in step 3
   - Add these fields:
     ```
     Field: email        Type: string    Value: faxascode@gmail.com
     Field: role         Type: string    Value: admin
     Field: displayName  Type: string    Value: FAXAS Admin
     Field: createdAt    Type: timestamp Value: (click the clock icon)
     ```
   - Click "Save"

7. **Sign out and back in**:
   - Go to your website
   - Sign out if logged in
   - Go to /admin-login
   - Login with faxascode@gmail.com
   - You should now be admin!

## Alternative: Copy Service Account Key

If you have the service account key file:

1. Copy `faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json` to the project folder
2. Double-click `SETUP_ADMIN_NOW.bat`

This will automatically create the user document and set admin permissions.