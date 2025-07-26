# FAXAS.NET - Premium Web Development Portfolio & Lead Generation Platform

A cutting-edge developer portfolio that transforms prospects into educated clients through interactive demos, progressive learning, and stunning glassmorphic design. Built with Next.js 15, React 19, TypeScript, and Firebase.

![FAXAS Portfolio](https://faxas.net/og-image.png)

## 🚀 Project Overview

FAXAS.NET is more than a portfolio - it's a complete lead generation and client education platform that demonstrates the power of modern web development while converting visitors into clients.

### Core Philosophy
- **Educate First**: Transform technical concepts into clear business value
- **Show, Don't Tell**: Live interactive demos instead of static screenshots
- **Convert Through Understanding**: Guide visitors from problem awareness to solution adoption

## ✨ Key Features

### 🎯 Lead Generation & Conversion
- **Smart Lead Capture**: Multi-step forms with automatic lead scoring (0-100)
- **Progressive Disclosure**: Educational tooltips that adapt to user knowledge level
- **Interactive Demos**: Live examples showing React's instant updates vs traditional page reloads
- **Social Proof**: Real client results with specific ROI metrics
- **Urgency & Scarcity**: Limited availability messaging with value stacking

### 🎨 Premium Glass Morphism Design
- **Apple-Inspired Aesthetics**: Smooth glass effects with backdrop filters
- **Animated Backgrounds**: Dynamic mesh gradients and floating orbs
- **Micro-Interactions**: Ripple effects, magnetic hovers, and smooth transitions
- **Responsive Design**: Mobile-first approach with equal functionality across devices
- **Dark Mode Ready**: Prepared for future dark theme implementation

### 🔐 Authentication & Admin System
- **Firebase Auth**: Email/password and Google OAuth integration
- **Role-Based Access**: User and admin roles with protected routes
- **Admin Dashboard**: Real-time statistics, lead management, and content control
- **Secure API Routes**: Server-side validation and Firebase Admin SDK

### 📊 Educational Journey System
- **Smart Tooltips**: Three-tier explanations (simple, technical, business value)
- **Comparison Widgets**: Side-by-side old vs new technology demonstrations
- **Progress Tracking**: Monitor visitor learning journey and engagement
- **Concept Library**: Pre-configured explanations for common tech terms

### 🚀 Technical Excellence
- **Next.js 15**: Latest App Router with React 19 Server Components
- **TypeScript**: Full type safety across the application
- **Firebase Suite**: Auth, Firestore, Storage, and Admin SDK
- **Tailwind CSS**: Utility-first with custom glass morphism utilities
- **Framer Motion**: Smooth animations and page transitions
- **Zustand**: Lightweight state management for auth

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.4 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 11
- **Forms**: React Hook Form + Zod validation

### Backend & Services
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Hosting**: Vercel (recommended) or Firebase Hosting
- **Analytics**: Ready for Google Analytics/PostHog

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint with Next.js config
- **Version Control**: Git with comprehensive .gitignore
- **Environment**: Node.js 18+

## 📁 Project Structure

```
faxas_website/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── (marketing)/       # Public pages (home, about, projects)
│   │   ├── admin/             # Protected admin dashboard
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles and glass system
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   │   ├── button.tsx     # Styled button with variants
│   │   │   ├── glass-panel.tsx # Glass morphism panels
│   │   │   └── floating-tile.tsx # 3D floating cards
│   │   ├── layout/            # Layout components
│   │   │   ├── Navigation.tsx # Smart navigation with auth
│   │   │   ├── Footer.tsx     # Comprehensive footer
│   │   │   └── PageLayout.tsx # Page wrapper with animations
│   │   ├── educational/       # Learning system
│   │   │   ├── Tooltip.tsx    # Progressive tooltips
│   │   │   ├── ComparisonWidget.tsx # Before/after demos
│   │   │   └── SmartTooltip.tsx # Adaptive explanations
│   │   ├── showcase/          # Project display
│   │   │   ├── LiveDemo.tsx   # Interactive project demos
│   │   │   └── ProjectCard.tsx # Project showcase cards
│   │   └── forms/             # Form components
│   │       ├── ContactForm.tsx # General contact
│   │       └── ProjectInquiryForm.tsx # Detailed project form
│   ├── lib/
│   │   ├── firebase/          # Firebase configuration
│   │   │   ├── config.ts      # Client SDK setup
│   │   │   └── admin.ts       # Admin SDK setup
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state management
│   │   └── utils.ts           # Helper functions
│   ├── types/                 # TypeScript definitions
│   └── data/                  # Static data and content
├── public/                    # Static assets
├── .env.local.example         # Environment template
├── .gitignore                # Comprehensive ignore rules
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/LuisFaxas/faxas-website.git
   cd faxas-website/faxas_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database (start in test mode)
   - Enable Storage

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Setup

### Creating Your Admin Account

1. **Register a new account** at `/register`

2. **Grant admin access** via Firebase Console:
   - Go to Firestore Database
   - Find `users` collection
   - Find your user document
   - Add field: `role: "admin"`
   - Save the document

3. **Sign out and back in** to refresh permissions

4. **Access admin dashboard** at `/admin`

### Admin Features
- **Dashboard**: Real-time stats and metrics
- **Lead Management**: View, filter, and update lead status
- **User Management**: (Coming soon)
- **Content Management**: (Coming soon)
- **Analytics**: (Coming soon)

## 🔒 Security

### Current Implementation
- Firebase Authentication with secure tokens
- Role-based access control (RBAC)
- Protected API routes with server-side validation
- Firestore security rules for data access
- Environment variables for sensitive data

### Security Best Practices
- Never commit `.env.local` or service account keys
- Use Firebase Admin SDK only on server-side
- Implement rate limiting for API routes
- Regular security audits
- Keep dependencies updated

## 📊 Database Schema

### Firestore Collections

#### `users`
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `leads`
```typescript
{
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  score: number; // 0-100
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `contacts`
```typescript
{
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: Timestamp;
}
```

#### `projects` (To be implemented)
```typescript
{
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: boolean;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🎨 Customization

### Design System

The glassmorphic design system is defined in:
- `src/app/globals.css` - Glass effects and animations
- `tailwind.config.ts` - Color system and utilities

### Key Design Tokens
```css
/* Glass Effects */
.glass-primary - Main glass panels
.glass-secondary - Subtle glass effect
.glass-accent - Colored glass accent
.glass-light - Light glass variant

/* Colors */
--accent-blue: #3b82f6
--accent-purple: #8b5cf6
--accent-green: #10b981
--text-primary: rgba(0, 0, 0, 0.9)
--text-secondary: rgba(0, 0, 0, 0.6)
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy --only hosting
```

## 📈 Performance

### Current Metrics
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Core Web Vitals**: All green

### Optimization Strategies
- Server Components for initial load
- Dynamic imports for code splitting
- Image optimization with next/image
- Font optimization with next/font
- Minimal client-side JavaScript

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run build
npm run build
```

## 📱 Mobile Experience

- Responsive design with mobile-first approach
- Touch-optimized interactions
- Proper viewport configuration
- Mobile menu with smooth animations
- Equal functionality across all devices

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by Apple's Human Interface Guidelines
- Glass morphism trends from the design community
- Built with the amazing Next.js and React ecosystem
- Educational approach inspired by Josh W. Comeau
- Firebase for backend infrastructure

## 📞 Contact & Support

**Luis Faxas**
- Email: [hello@faxas.net](mailto:hello@faxas.net)
- Website: [https://faxas.net](https://faxas.net)
- GitHub: [@LuisFaxas](https://github.com/LuisFaxas)

---

<p align="center">
  Built with ❤️ using Next.js, React, TypeScript, and Firebase
</p>