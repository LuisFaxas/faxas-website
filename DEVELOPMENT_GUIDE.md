# FAXAS.NET Development Guide

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom glass morphism system
- **Animation**: Framer Motion for smooth transitions
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State**: Zustand for auth, local state for UI
- **Deployment**: Vercel (recommended) or Firebase Hosting

### Design Philosophy
1. **Educational First**: Every feature should educate visitors about modern web tech
2. **Performance Obsessed**: Sub-2 second load times, 95+ Lighthouse scores
3. **Conversion Focused**: Every element drives toward lead capture
4. **Mobile Equal**: Not mobile-friendly, but mobile-equal functionality

## 🎨 Design System

### Glass Morphism Implementation

Our glass morphism system has four variants:

```css
.glass-primary    /* Main panels - 70% opacity, 20px blur */
.glass-secondary  /* Subtle glass - 50% opacity, 12px blur */
.glass-accent     /* Gradient glass - Blue/purple tint */
.glass-light      /* Light variant - 30% opacity, 8px blur */
```

### Color Palette

```typescript
// Accent Colors
accent-blue: #3b82f6    // Primary actions, links
accent-purple: #8b5cf6  // Secondary actions, highlights
accent-green: #10b981   // Success states, positive metrics
accent-orange: #f97316  // Warnings, attention
accent-red: #ef4444     // Errors, negative states

// Text Colors
text-primary: rgba(0,0,0,0.9)     // Main content
text-secondary: rgba(0,0,0,0.6)   // Supporting text
text-tertiary: rgba(0,0,0,0.4)    // Disabled/placeholder
```

### Component Patterns

#### Floating Tiles
- 3D transform on hover
- Subtle shadow elevation
- Used for cards, metrics, features

#### Glass Panels
- Backdrop blur for depth
- Inset shadows for realism
- Border highlights for definition

#### Micro-interactions
- Button scale on press
- Ripple effects on click
- Magnetic hover on CTAs

## 🔧 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature

# Create PR on GitHub
```

### Code Standards

#### TypeScript
- Strict mode enabled
- No `any` types without justification
- Interfaces over types for objects
- Proper error handling with try/catch

#### React/Next.js
- Server Components by default
- Client Components only when needed
- Proper loading/error boundaries
- Optimistic UI updates

#### Styling
- Tailwind utilities first
- Custom CSS only when necessary
- Consistent spacing scale (4, 8, 12, 16, 24, 32)
- Mobile-first responsive design

## 🏗️ Key Components

### Educational System

#### EducationalTooltip
Progressive disclosure tooltips with three levels:
- Simple: For beginners
- Technical: For developers
- Business: ROI focused

#### ComparisonWidget
Side-by-side demos showing old vs new approaches

#### ProgressTracker
Monitors user learning journey through the site

### Lead Generation

#### ProjectInquiryForm
Multi-step form with:
- Progressive questions
- Lead scoring algorithm
- Firebase integration
- Success animations

#### Lead Scoring Formula
```typescript
score = baseScore + 
  (budget > 10000 ? 20 : 10) +
  (timeline === 'asap' ? 15 : 5) +
  (hasCompany ? 10 : 0) +
  (detailedMessage ? 15 : 5)
```

### Admin Dashboard

#### Protected Routes
- Middleware checks auth state
- Role-based access control
- Redirect to login if unauthorized

#### Lead Management
- Real-time Firestore updates
- Status workflow (new → contacted → qualified → converted)
- Filtering and search
- Export functionality (coming soon)

## 📊 Firebase Configuration

### Firestore Structure

```
users/
  {userId}/
    - email
    - displayName
    - role: 'user' | 'admin'
    - createdAt
    - updatedAt

leads/
  {leadId}/
    - name
    - email
    - company?
    - message
    - score: 0-100
    - status: 'new' | 'contacted' | 'qualified' | 'converted'
    - source: 'contact' | 'project-inquiry'
    - createdAt

projects/
  {projectId}/
    - title
    - slug
    - description
    - techStack[]
    - featured: boolean
    - images[]
    - liveUrl?
    - githubUrl?
```

### Security Rules

```javascript
// Admins can do anything
allow read, write: if request.auth.token.admin == true;

// Users can read their own data
allow read: if request.auth.uid == resource.data.uid;

// Anyone can submit leads
allow create: if true;
```

## 🚀 Performance Optimization

### Image Optimization
- Use Next.js Image component
- Lazy load below the fold
- Serve WebP with fallbacks
- Responsive srcsets

### Code Splitting
- Dynamic imports for heavy components
- Route-based splitting automatic
- Lazy load modals and tooltips

### Caching Strategy
- Static pages cached at edge
- API routes with proper headers
- Firestore offline persistence
- Service worker for PWA (coming)

## 🧪 Testing Strategy

### Unit Tests (Coming Soon)
- Jest for component testing
- React Testing Library for interactions
- Mock Firebase services

### E2E Tests (Coming Soon)
- Playwright for critical paths
- Test lead submission flow
- Test auth flows
- Test admin functionality

### Performance Testing
- Lighthouse CI in GitHub Actions
- Bundle size monitoring
- Core Web Vitals tracking

## 🐛 Common Issues & Solutions

### Firebase Auth Issues
```typescript
// Token refresh issue
if (error.code === 'auth/id-token-expired') {
  await user.getIdToken(true);
}

// Permission denied
// Check Firestore rules and user roles
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build

# Type errors
npm run type-check
```

### Styling Issues
- Check glass panel z-index stacking
- Verify backdrop-filter browser support
- Test on actual mobile devices

## 📈 Analytics & Monitoring

### Current Implementation
- Basic page view tracking
- Lead conversion tracking
- Error boundary reporting

### Planned Additions
- PostHog for product analytics
- Sentry for error monitoring
- Custom dashboard for metrics

## 🔐 Security Considerations

### Current Measures
- Environment variables for secrets
- HTTPS only in production
- Firebase security rules
- Input validation and sanitization

### Best Practices
- Never commit secrets
- Use Firebase Admin SDK server-side only
- Validate all user input
- Implement rate limiting
- Regular dependency updates

## 🚦 Deployment Checklist

### Pre-deployment
- [ ] Run type checking
- [ ] Test all forms
- [ ] Check responsive design
- [ ] Verify Firebase rules
- [ ] Update environment variables
- [ ] Test auth flows

### Post-deployment
- [ ] Verify production URLs
- [ ] Test contact forms
- [ ] Check error reporting
- [ ] Monitor performance
- [ ] Test on real devices

## 📚 Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Design Inspiration
- [Apple HIG](https://developer.apple.com/design/)
- [Glass Morphism](https://glassmorphism.com/)
- [Awwwards](https://www.awwwards.com/)

### Learning Resources
- [Josh W. Comeau](https://www.joshwcomeau.com/)
- [Kent C. Dodds](https://kentcdodds.com/)
- [Web.dev](https://web.dev/)

---

Remember: We're not just building a website, we're crafting an experience that educates and converts. Every line of code should serve this mission.