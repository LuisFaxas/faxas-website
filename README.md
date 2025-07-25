# FAXAS.NET - Premium Web Development Portfolio

A revolutionary developer portfolio platform that transforms prospects into educated clients through progressive learning, live interactive demos, and Apple-inspired glassmorphic design.

![FAXAS Portfolio](https://faxas.net/og-image.png)

## 🚀 Current Features (Implemented)

### ✅ Core Features
- **Authentication System** - Email/password and Google sign-in with Firebase Auth
- **Dynamic Navigation** - Auth-aware navigation with user profiles and admin links
- **Lead Capture System** - Smart forms with automatic scoring and Firestore integration
- **Admin Dashboard** - Protected admin area with real-time statistics
- **Lead Management** - Full CRUD operations for leads with filtering and status updates
- **Glassmorphic Design** - Premium Apple-inspired aesthetics with smooth animations
- **Mobile-First** - 100% responsive with mobile menu and equal functionality

### ✅ Technical Implementation
- **Next.js 14** App Router with TypeScript
- **Firebase** - Authentication, Firestore, Storage rules configured
- **Tailwind CSS v3** with custom glass morphism utilities
- **Framer Motion** for smooth page transitions and animations
- **Zustand** for global auth state management
- **React Hook Form + Zod** for form validation
- **Protected Routes** - Middleware and client-side protection

### 🔧 Current Status
- **Authentication**: ✅ Working
- **Lead Capture**: ✅ Working
- **Admin Dashboard**: ✅ Working
- **Lead Management**: ✅ Working
- **Contact Forms**: ✅ Connected to Firebase
- **Projects**: ⏳ Using sample data (needs migration)
- **Email Notifications**: ❌ Not implemented
- **File Uploads**: ❌ Not implemented

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faxas.net.git
   cd faxas.net/faxas_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Enable Storage
   - Copy your configuration to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
faxas_website/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (marketing)/       # Public routes
│   │   ├── (admin)/           # Admin routes (protected)
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   ├── showcase/          # Project showcase components
│   │   ├── educational/       # Educational system components
│   │   └── forms/             # Form components
│   ├── lib/
│   │   ├── firebase/          # Firebase configuration and services
│   │   ├── hooks/             # Custom React hooks
│   │   └── store/             # Zustand store
│   ├── types/                 # TypeScript type definitions
│   └── data/                  # Static data (sample projects)
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🔐 Admin Setup Guide

### Step 1: Create Your First Admin Account

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Register a new account**
   - Go to http://localhost:3000/register
   - Sign up with your email or use Google sign-in
   - Verify your email if using email/password

3. **Make yourself an admin** (Choose one method):

   **Method A: Using Firebase Console (Easiest)**
   ```
   1. Go to https://console.firebase.google.com
   2. Select your project (faxas-website)
   3. Navigate to Firestore Database
   4. Find the 'users' collection
   5. Find your user document (by email)
   6. Click on the document
   7. Add a new field:
      - Field name: role
      - Type: string
      - Value: admin
   8. Save the document
   ```

   **Method B: Using Firebase Admin SDK**
   ```javascript
   // Run this in a Node.js script or Cloud Function
   const admin = require('firebase-admin');
   admin.initializeApp();
   
   // Set custom claims
   admin.auth().setCustomUserClaims('YOUR_USER_UID', { admin: true });
   
   // Also update Firestore
   admin.firestore().collection('users').doc('YOUR_USER_UID').update({
     role: 'admin'
   });
   ```

4. **Test admin access**
   - Log out and log back in (important!)
   - Go to http://localhost:3000/admin
   - You should see the admin dashboard

### Step 2: Deploy Security Rules

```bash
# Make sure you're logged in to Firebase CLI
firebase login

# Deploy the rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Common Issues & Solutions

**Can't access admin dashboard?**
- Make sure you logged out and back in after setting admin role
- Check that the `role` field is exactly `admin` (case-sensitive)
- Verify in browser console: Open DevTools → Console → Type: `JSON.parse(localStorage.getItem('auth-storage'))`

**Firebase permission errors?**
- Ensure security rules are deployed
- Check Firebase Console → Firestore → Rules tab
- Verify your rules match the ones in `firestore.rules`

## 🔥 Firebase Setup

### Current Firestore Collections

1. **users** - User profiles
   ```typescript
   {
     uid: string;
     email: string;
     displayName: string;
     role: 'user' | 'admin';  // Set to 'admin' for admin access
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

2. **leads** - Contact form submissions
   ```typescript
   {
     name: string;
     email: string;
     message: string;
     score: number;         // 0-100 based on lead quality
     status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
     source: string;
     createdAt: Timestamp;
   }
   ```
   
3. **contacts** - General contact messages
   ```typescript
   {
     name: string;
     email: string;
     message: string;
     status: 'unread' | 'read';
     createdAt: Timestamp;
   }
   ```

4. **projects** - Portfolio projects (to be implemented)
   
### Security Rules Overview

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for projects
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Only authenticated users can submit leads
    match /leads/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, update: if request.auth != null && 
        request.auth.uid == userId;
      allow create: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Build the project
npm run build

# Deploy
firebase deploy
```

## 📊 Key Features Implementation

### Educational System
- Smart tooltips that adapt to user level
- Comparison widgets for before/after demonstrations
- Progress tracking for learning journey
- Concept library with business value explanations

### Lead Capture & Scoring
- Multi-step project inquiry form
- Automatic lead scoring based on budget, timeline, and engagement
- Firebase integration for real-time updates
- Email notifications (configure with Firebase Functions)

### Project Showcase
- Three-tier system: Quick Preview, Standard, and Deep Dive
- Live demos with iframe embedding
- Mobile-optimized fallbacks
- Analytics tracking for engagement

## 🎨 Customization

### Design Tokens
Edit `tailwind.config.ts` to customize:
- Colors
- Glass effects
- Animations
- Typography

### Adding Projects
1. Add project data to `src/data/projects.ts`
2. Upload media to `public/projects/`
3. Or use Firebase to manage projects dynamically

## 📈 Analytics

The platform includes:
- Page view tracking
- Project engagement metrics
- Educational content effectiveness
- Lead conversion tracking

Configure PostHog or Google Analytics by adding your keys to `.env.local`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by Apple's glassmorphic aesthetic
- Built with Next.js and the amazing React ecosystem
- Educational approach inspired by Josh W. Comeau

## 📞 Contact

**FAXAS** - [hello@faxas.net](mailto:hello@faxas.net)

Project Link: [https://github.com/yourusername/faxas.net](https://github.com/yourusername/faxas.net)

---

Built with ❤️ by FAXAS