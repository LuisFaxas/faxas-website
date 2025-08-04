# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 Current Sprint: v1.3.4 - Design Refinement (Started: 2025-08-01)

### Active Issues:
- Admin dashboard too playful (excessive emojis, childish colors)
- 117+ TypeScript errors (currently ignored with `ignoreBuildErrors: true`)
- Glass morphism consistency issues (varying opacity/blur values)
- Multiple button component implementations (Button.tsx vs GlassButton.tsx)

### Recently Completed:
- ✅ v1.3.3 Mobile Admin Experience (2025-07-31)
- ✅ v1.3.2 Real-time Lead Management (2025-07-30)
- ✅ v1.3.1 Email Notifications with Resend (2025-07-29)
- ✅ v1.2 Lead Portal System (2025-07-29)

### Current Focus:
1. Professional refinement of admin UI (remove excessive emojis)
2. TypeScript error resolution (fix all 117+ errors)
3. Design system enforcement (consolidate glass morphism values)
4. Component standardization (unify button implementations)

### Known Context:
- Button visibility/contrast issues already fixed in v1.2
- Using both Button.tsx and GlassButton.tsx (needs consolidation)
- Firebase Admin SDK configured for env vars only (no service account file)
- Glass morphism design system created but not fully enforced
- Admin dashboard functional but needs visual polish

## 🚀 Full-Stacked Revival Project (Started: 2025-08-01)

### Overview:
- Modernizing legacy MERN stack social network project
- Using Hybrid Strategy: Keep MongoDB/Express/Redux, add TypeScript/Next.js
- Located in: `C:\1) FAXAS\CODING PROJECTS\faxas.net\CODING_PORTFOLIO\FULL-STACKED`
- Goal: Showcase versatility with different tech stacks in portfolio

### Key Decisions:
- Keep MongoDB (vs Firebase) to show NoSQL variety
- Keep Redux Toolkit (vs Zustand) to show state management variety  
- Migrate to Next.js from Vite for modern standards
- Create hybrid UI: Material-UI + glass morphism accents
- Add TypeScript throughout for type safety

### Current Status:
- Repositories cloned locally
- Strategy documents created (HYBRID_STRATEGY.md, IMPLEMENTATION_ROADMAP.md)
- Ready to begin Week 1: Foundation Setup

## Project Overview

FAXAS.NET is a premium web development portfolio and lead generation platform built with Next.js 15, React 19, TypeScript, and Firebase. It features a glassmorphic design system and focuses on converting visitors into clients through educational content and interactive demos.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality & Testing
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking (uses tsconfig.build.json)
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### CI/CD Commands
```bash
npm run ci           # Run type-check + tests (used in CI pipeline)
npm run ci:full      # Run full quality checks: type-check + lint + format:check + tests
```

### Documentation
```bash
npm run storybook    # Start Storybook on http://localhost:6006
npm run build-storybook # Build Storybook for production
```

## Architecture & Patterns

### File Organization
- **Next.js App Router**: All pages use the App Router pattern in `src/app/`
- **Route Groups**: `(auth)` for authentication pages, `(marketing)` for public pages
- **Components**: Organized by feature in `src/components/`
  - `ui/` - Reusable UI components with glass morphism design
  - `admin/` - Admin dashboard components
  - `educational/` - Learning system components (tooltips, comparisons)
  - `showcase/` - Project display components
  - `forms/` - Form components with Zod validation

### State Management
- **Zustand**: Global auth state in `src/lib/store/authStore.ts`
- **React Hook Form**: Form state management with Zod validation
- **Local State**: Component-level state for UI interactions

### Styling System
- **Tailwind CSS**: Utility-first with custom glass morphism utilities
- **Glass Morphism Classes**: Defined in `src/app/globals.css`
  - `.glass-primary` - Main panels (70% opacity, 20px blur)
  - `.glass-secondary` - Subtle glass (50% opacity, 12px blur)
  - `.glass-accent` - Gradient glass with blue/purple tint
  - `.glass-light` - Light variant (30% opacity, 8px blur)
  - `.glass-lighter` - Minimal glass (20% opacity, 4px blur)

### Firebase Integration
- **Client Config**: `src/lib/firebase/config.ts`
- **Admin SDK**: `src/lib/firebase/admin.ts` (server-side only)
- **Auth**: Firebase Authentication with email/password and Google OAuth
- **Database**: Cloud Firestore for leads, users, and contacts
- **Storage**: Firebase Storage for media files

### TypeScript Configuration
- **Strict Mode**: Enabled for type safety
- **Path Aliases**: `@/*` maps to `src/*`
- **Build Config**: `tsconfig.build.json` excludes test files

### Testing Strategy
- **Jest + React Testing Library**: Unit and integration tests
- **Test Files**: Co-located with components or in `__tests__` folders
- **Coverage**: Minimum 5% threshold (to be increased)
- **Mocks**: Firebase and Next.js modules mocked in tests

### Performance Optimizations
- **Server Components**: Default for initial load performance
- **Client Components**: Only when interactivity needed
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Using next/font for web fonts
- **Code Splitting**: Automatic with Next.js App Router

### Error Handling
- **Sentry Integration**: Error tracking and performance monitoring
- **Error Boundaries**: Client-side error handling
- **API Error Responses**: Consistent error format

### Security Patterns
- **Environment Variables**: All sensitive data in `.env.local`
- **Server-Side Validation**: API routes validate all inputs
- **Role-Based Access**: Admin routes protected by middleware
- **Firebase Security Rules**: Database access controlled

## Important Notes

### ESLint Configuration
- ESLint errors are ignored during builds (`ignoreDuringBuilds: true` in next.config.ts)
- Always run `npm run lint` before committing

### Image Domains
Configured remote patterns in next.config.ts for:
- `via.placeholder.com`
- `images.unsplash.com`
- `storage.googleapis.com`
- `firebasestorage.googleapis.com`
- `lh3.googleusercontent.com`

### Sentry Configuration
- Organization: `faxas-enterprise`
- Project: `javascript-nextjs`
- Tunnel route: `/monitoring` (to bypass ad blockers)

### Firebase Setup Required
1. Create Firebase project
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Enable Storage
5. Set environment variables in `.env.local`

### Admin Access
To grant admin access:
1. Register account at `/register`
2. In Firebase Console > Firestore > users collection
3. Add field `role: "admin"` to user document
4. Sign out and back in to refresh permissions

## Common Development Patterns

### Creating New Components
1. Check existing components for similar patterns
2. Use TypeScript interfaces for props
3. Apply glass morphism design system
4. Include loading and error states
5. Add tests in same directory

### API Route Pattern
```typescript
// Always validate inputs
// Return consistent error format
// Use Firebase Admin SDK for server operations
// Check authentication and authorization
```

### Form Handling
- Use React Hook Form with Zod schemas
- Show loading states during submission
- Display success/error messages
- Implement proper validation

### Glass Morphism Implementation
- Use predefined glass classes from globals.css
- Ensure proper backdrop-filter support
- Test on different backgrounds
- Consider performance on mobile devices