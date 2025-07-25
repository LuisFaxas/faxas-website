# Quick Admin Setup for faxascode@gmail.com

## Option 1: Copy Service Account Key and Run Script

1. **Copy your service account key:**
   ```cmd
   copy "C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" "service-account-key.json"
   ```

2. **Run the admin script:**
   ```cmd
   node make-faxas-admin.js
   ```

3. **Sign out and sign back in** on the website

## Option 2: Manual Setup via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **faxas-website** project
3. Navigate to **Firestore Database**
4. Click on the **users** collection
5. Find the document for faxascode@gmail.com
6. Click **Add Field** (+ icon)
7. Add:
   - Field name: `role`
   - Type: `string`
   - Value: `admin`
8. Click **Save**

## Option 3: Quick Windows Script

Just double-click: **RUN_THIS_TO_MAKE_ADMIN.bat**

## Verify Admin Access

1. Sign out from the website
2. Sign back in with faxascode@gmail.com
3. You should see "Admin" in the navigation
4. Visit http://localhost:3000/admin

That's it! You're now an admin.