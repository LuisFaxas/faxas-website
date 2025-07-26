'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, isAdmin, signOut } = useAuthStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-3' : 'py-6'
      )}
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Glassmorphism Navbar - Matching Site Theme */}
        <div className="glass-primary rounded-2xl">
          {/* Content */}
          <div className="relative flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <h1 className="text-2xl font-bold gradient-text">FAXAS</h1>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative group',
                    pathname === item.href
                      ? 'text-accent-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'text-sm font-medium transition-colors relative',
                    pathname.startsWith('/admin')
                      ? 'text-accent-purple'
                      : 'text-text-secondary hover:text-accent-purple'
                  )}
                >
                  Admin
                  {pathname.startsWith('/admin') && (
                    <motion.div
                      layoutId="admin-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-purple rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-glass-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-sm font-medium">
                    {userProfile?.displayName?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-text-primary">
                    {userProfile?.displayName || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right"
                      >
                        <div className="glass-secondary py-2 rounded-xl">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-glass-light transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                          )}
                          <Link
                            href="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-glass-light transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          <hr className="my-2 border-glass-lighter" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-glass-light transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              ) : (
                <>
                  <Link href="/login">
                    <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-glass-light hover:bg-glass-primary rounded-lg transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-blue/90 hover:to-accent-purple/90 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
          </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-glass-light transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-6 pb-4 px-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-glass-light text-accent-blue'
                        : 'text-text-secondary hover:bg-glass-light hover:text-text-primary'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                      pathname.startsWith('/admin')
                        ? 'bg-glass-light text-accent-purple'
                        : 'text-text-secondary hover:bg-glass-light hover:text-accent-purple'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <hr className="my-2 border-glass-lighter" />

                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-sm font-medium">
                        {userProfile?.displayName?.[0] || user.email?.[0] || 'U'}
                      </div>
                      <span className="text-sm text-text-primary">
                        {userProfile?.displayName || 'User'}
                      </span>
                    </div>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-text-secondary hover:bg-glass-light hover:text-text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-text-secondary hover:bg-glass-light hover:text-text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-gray-200/50">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 text-base font-semibold text-gray-700 bg-gray-100/50 hover:bg-gray-100/70 rounded-xl transition-all duration-300"
                      >
                        Sign In
                      </motion.button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl transition-all duration-300"
                      >
                        Get Started
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}