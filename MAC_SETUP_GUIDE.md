# 🍎 Mac Setup Guide for FAXAS.NET

This guide will walk you through setting up the FAXAS.NET project on your Mac.

## Prerequisites

### 1. Install Required Software

#### Node.js (v18 or later)
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
# https://nodejs.org/
```

#### Git
```bash
# Check if already installed
git --version

# If not installed
xcode-select --install
```

#### VS Code (recommended editor)
```bash
# Using Homebrew
brew install --cask visual-studio-code

# Or download from
# https://code.visualstudio.com/
```

## Project Setup

### 1. Clone the Repository

```bash
# Navigate to your projects directory
cd ~/Documents/Projects  # or wherever you keep your code

# Clone the repository
git clone https://github.com/yourusername/faxas.net.git
cd faxas.net/faxas_website
```

### 2. Install Dependencies

```bash
# Install all npm packages
npm install

# This may take a few minutes
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_client_email_here
FIREBASE_PRIVATE_KEY="your_private_key_here"

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_admin_email@example.com

# Optional: Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication (Google provider)
4. Create Firestore Database
5. Get your configuration from Project Settings

### 5. Run the Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
# If port 3000 is taken, it will use 3001, 3002, etc.
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### TypeScript Errors
The project currently has TypeScript errors that are ignored during build. This is temporary and will be fixed in v1.3.4.

### Slow Performance
If you experience slow performance with glass morphism effects:
1. Try using Chrome or Edge (better backdrop-filter support)
2. Disable some animations in development
3. Use a more powerful machine for development

## Development Workflow

### Branch Structure
```bash
main          # Production-ready code
develop       # Development branch
feature/*     # Feature branches
bugfix/*      # Bug fix branches
```

### Making Changes
```bash
# Create new branch
git checkout -b feature/your-feature-name

# Make changes
# Test thoroughly

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name
```

### Building for Production
```bash
# Build the project
npm run build

# Test production build locally
npm start
```

## Project Structure

```
faxas_website/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── admin/        # Admin dashboard
│   │   ├── portal/       # Lead portal
│   │   └── (auth)/       # Authentication pages
│   ├── components/       # React components
│   │   ├── admin/        # Admin-specific components
│   │   ├── ui/           # Shared UI components
│   │   └── forms/        # Form components
│   ├── lib/              # Utilities and libraries
│   │   ├── firebase/     # Firebase configuration
│   │   ├── email/        # Email templates
│   │   └── utils/        # Helper functions
│   └── types/            # TypeScript types
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
├── package.json          # Dependencies
└── tailwind.config.ts    # Tailwind configuration
```

## Testing the Application

### Key Features to Test:

1. **Public Site** - http://localhost:3000
   - Homepage animations
   - Project showcase
   - Contact form

2. **Lead Portal** - http://localhost:3000/portal
   - Google sign-in
   - Questionnaire flow
   - Dashboard

3. **Admin Dashboard** - http://localhost:3000/admin
   - Lead management
   - Real-time updates
   - Mobile responsiveness

### Test Accounts
Create test accounts using Google Sign-In or:
- Admin: Set up in Firebase Console with admin role
- Test Lead: Any Google account

## Troubleshooting

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Check Logs
```bash
# View development logs
npm run dev

# Check browser console for errors
# Open Developer Tools: Cmd + Option + I
```

### Firebase Issues
1. Check Firebase Console for quota limits
2. Verify security rules are deployed
3. Ensure all services are enabled

## Support

If you encounter issues:
1. Check the console for error messages
2. Review the MASTER_PLAN.md for known issues
3. Check TypeScript errors (many are known and temporary)
4. Create an issue in the repository

## Next Steps

After setup:
1. Review MASTER_PLAN.md for project roadmap
2. Check current version status (v1.3.3)
3. See known issues in the debugging section
4. Start with visual polish tasks (v1.3.4)

---

Happy coding! 🚀