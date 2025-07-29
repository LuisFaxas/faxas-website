# Firebase Deployment Instructions

## Deploy Updated Firestore Rules

To deploy the updated Firestore rules that fix the permissions errors:

1. **Login to Firebase CLI** (if not already logged in):
   ```bash
   firebase login
   ```

2. **Deploy only the Firestore rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Verify the deployment**:
   - The deployment should complete successfully
   - You should see a message like "✔ Firestore rules deployed successfully"

## What was fixed:

1. **Added missing 'contacts' collection rules**:
   - The admin dashboard was trying to access a 'contacts' collection that had no rules
   - Added rules allowing admins to read/update/delete contacts
   - Anyone can create a contact (for the public contact form)

2. **Fixed React setState warning**:
   - Moved the admin login redirect logic from render phase to useEffect
   - This prevents state updates during component rendering

## After deployment:

The Firebase permissions errors in the admin dashboard should be resolved. The admin dashboard will now be able to:
- Read the contacts collection to show message count
- Access all required collections without permission errors

## Note:

The contacts collection is referenced in the admin dashboard but may not have any documents yet. This is normal and won't cause errors after the rules are deployed.