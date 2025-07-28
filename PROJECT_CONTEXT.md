# PROJECT CONTEXT - FAXAS.NET

## Quick Start for New Session

### Project Location & Access
```bash
# Project Path
C:\1) FAXAS\CODING PROJECTS\faxas.net\faxas_website

# GitHub Repository
https://github.com/LuisFaxas/faxas-website

# Local Development
cd "C:\1) FAXAS\CODING PROJECTS\faxas.net\faxas_website"
npm run dev
```

### Essential Context
- **Project**: FAXAS.NET - Premium web development portfolio & lead generation platform
- **Purpose**: Convert visitors into clients through education and interactive demos
- **Tech Stack**: Next.js 15.1.4, React 19, TypeScript, Firebase, Tailwind CSS, Framer Motion
- **Design System**: Glassmorphic design with premium aesthetics
- **Current State**: Fully functional with homepage, projects showcase, admin dashboard, authentication

### Key Files to Reference
1. **TECHNICAL_REPORT_V1.md** - Complete technical documentation with code examples
2. **README.md** - Setup instructions and feature overview
3. **src/app/globals.css** - Glass morphism design system
4. **.env.local.example** - Environment variables template

---

## Project Philosophy

**"Educate First, Sell Second"** - The site transforms complex technical concepts into clear business value propositions through:
- Interactive demos showing React vs Traditional websites
- Progressive tooltips with 3-tier explanations (simple, technical, business)
- Live demonstrations instead of static screenshots
- Lead scoring based on engagement (0-100 score)

---

## Current Implementation Status

### ✅ Completed Pages

1. **Homepage (/)** 
   - Problem-aware headline: "Your Website is Losing You Money"
   - Interactive React vs Traditional demo
   - Social proof with 276% average improvement
   - Multi-step contact form with progressive fields

2. **Projects (/projects)**
   - 6 static projects (no Firebase dependency for performance)
   - Filtering by category and search
   - GlassmorphicProjectCard components with metrics

3. **Project Details (/projects/[slug])**
   - Dynamic routing with comprehensive project info
   - Device preview (desktop/tablet/mobile)
   - Image gallery, testimonials, metrics
   - Related projects suggestions

4. **About (/about)**
   - Company values and approach
   - Technology showcase
   - Professional presentation

5. **Contact (/contact)**
   - Progressive form with optional fields
   - Lead scoring algorithm
   - Budget/timeline/project type fields

6. **Authentication**
   - Login/Register with Firebase Auth
   - Google OAuth configured
   - Role-based access (user/admin)

7. **Admin Dashboard (/admin)**
   - Protected route (requires admin role)
   - Real-time statistics
   - Lead management table
   - Quick actions grid

8. **Demo Pages**
   - E-commerce dashboard demo (/demos/ecommerce)
   - Interactive inventory management
   - Real-time updates showcase

### 🔧 Technical Architecture

```typescript
// Key Dependencies
{
  "next": "15.1.4",
  "react": "19.0.0",
  "typescript": "^5",
  "firebase": "^11.1.0",
  "firebase-admin": "^13.0.1",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^11.0.3",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "zustand": "^5.0.2"
}

// Project Structure
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Login/Register pages
│   ├── (marketing)/       # Public pages
│   ├── admin/             # Protected admin area
│   ├── api/               # API routes
│   └── demos/             # Interactive demos
├── components/
│   ├── ui/                # Base components
│   ├── layout/            # Navigation, Footer
│   ├── educational/       # Tooltips, comparisons
│   ├── showcase/          # Project cards
│   └── forms/             # Contact forms
└── lib/
    ├── firebase/          # Firebase config
    ├── store/             # Zustand stores
    └── utils.ts           # Helpers
```

### 🎨 Design System

```css
/* Glass Morphism Classes */
.glass-primary    /* Main panels - 70% opacity, 20px blur */
.glass-secondary  /* Subtle glass - 50% opacity, 12px blur */
.glass-accent     /* Gradient glass - Blue/purple tint */
.glass-light      /* Light variant - 30% opacity, 8px blur */
.glass-lighter    /* Minimal glass - 20% opacity, 4px blur */

/* Key Colors */
--accent-blue: #3b82f6;
--accent-purple: #8b5cf6;
--accent-green: #10b981;
--accent-orange: #f97316;
--accent-red: #ef4444;
```

---

## Critical Setup Information

### Firebase Configuration
1. **Required Services**: Authentication, Firestore, Storage
2. **Auth Methods**: Email/Password, Google OAuth
3. **Environment Variables** (create .env.local):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# For admin SDK (if using server-side)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Admin Access Setup
1. Register a new account at `/register`
2. In Firebase Console > Firestore > `users` collection
3. Find your user document
4. Add field: `role: "admin"`
5. Sign out and back in to access `/admin`

### Image Configuration
Next.js is configured to allow images from:
- `via.placeholder.com` (for placeholders)
- `images.unsplash.com` (for stock photos)
- `firebasestorage.googleapis.com` (for uploaded content)

---

## Current Issues & Solutions

### Known Issues
1. **Projects use static data** - Firebase integration ready but not implemented for performance
2. **No actual images** - Using placeholders, ready for real content
3. **Email notifications** - Pending Firebase Functions setup

### Recent Fixes
- ✅ Fixed Next.js Image configuration error
- ✅ Fixed navigation visibility with glass morphism
- ✅ Rebuilt homepage for conversion optimization
- ✅ Added comprehensive documentation

---

## Development Workflow

### Common Commands
```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Code Quality
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
npm run build        # Production build test

# Git
git add .
git commit -m "Your message"
git push origin main
```

### Performance Targets
- Lighthouse Score: 95+ (currently achieving 98)
- Load Time: <1s (currently 0.8s)
- Core Web Vitals: All green

---

## Next Steps & Priorities

### Immediate Tasks (from todo list)
1. **Firebase Functions** - Email notifications for new leads
2. **File Upload** - Project media to Firebase Storage
3. **Blog Section** - Content marketing with MDX
4. **Analytics Dashboard** - Enhanced admin analytics
5. **PWA Support** - Offline functionality

### Enhancement Ideas
- A/B testing framework
- Client portal for project updates
- Advanced personalization
- International support (i18n)

---

## Important Notes

1. **Always run `npm run dev` after** changing next.config.ts
2. **Test on mobile** - Site is fully responsive but always verify
3. **Check console errors** - Firebase might show auth warnings in dev
4. **Use static data** for projects to maintain performance
5. **Educational tooltips** are key to the conversion strategy

---

## Session Continuity Tips

When starting a new session, mention:
1. "I'm working on FAXAS.NET web portfolio"
2. "Check PROJECT_CONTEXT.md and TECHNICAL_REPORT_V1.md"
3. Current task you want to work on
4. Any specific issues or errors

The project follows "Educate First, Sell Second" philosophy with glassmorphic design and focuses on converting visitors through interactive demonstrations.

---

*Last Updated: January 2025*
*Next Review: When major changes occur*