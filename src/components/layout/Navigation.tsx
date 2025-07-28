'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, isAdmin, signOut } = useAuthStore();
  
  const navItems = [
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    ...(user ? [{ href: '/portal', label: 'Portal', accent: 'accent-green' }] : []),
  ];
  
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
                    pathname.startsWith(item.href)
                      ? (item.accent ? `text-${item.accent}` : 'text-accent-blue')
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {item.label}
                  {pathname.startsWith(item.href) && (
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

        {/* Mobile Menu - Slide-out Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop with Progressive Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 md:hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                  backdropFilter: 'blur(8px)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Slide-out Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                }}
                className="fixed top-0 left-0 bottom-0 w-80 z-50 md:hidden"
              >
                {/* Menu Container */}
                <div className="h-full flex flex-col">
                  {/* Glass Panel */}
                  <div className="h-full glass-primary border-r border-white/20 shadow-2xl">
                    
                    {/* Header Section */}
                    <div className="px-6 py-8 border-b border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.h1 
                            className="text-2xl font-bold gradient-text"
                            whileTap={{ scale: 0.95 }}
                          >
                            FAXAS
                          </motion.h1>
                        </Link>
                        <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <X className="w-6 h-6 text-text-primary" />
                        </button>
                      </div>
                      
                      {/* User Section at Top */}
                      {user ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-white/5"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {userProfile?.displayName?.[0] || user.email?.[0] || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {userProfile?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                              {user.email}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-center"
                        >
                          <p className="text-sm text-text-secondary mb-3">
                            Welcome to FAXAS
                          </p>
                          <div className="flex space-x-2">
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex-1"
                            >
                              <button className="w-full px-4 py-2 text-sm font-medium text-text-primary bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200">
                                Sign In
                              </button>
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex-1"
                            >
                              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg transition-all duration-200">
                                Sign Up
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Navigation Section */}
                    <div className="flex-1 px-6 py-6">
                      <nav className="space-y-2">
                        {navItems.map((item, index) => {
                          const isActive = pathname === item.href;
                          return (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + (index * 0.05) }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  'group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden',
                                  isActive
                                    ? 'text-accent-blue bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-accent-blue/20'
                                    : 'text-text-primary hover:bg-white/10 hover:text-accent-blue'
                                )}
                              >
                                {/* Active indicator */}
                                {isActive && (
                                  <motion.div
                                    layoutId="mobile-sidebar-indicator"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-blue to-accent-purple rounded-r-full"
                                  />
                                )}
                                
                                {/* Content */}
                                <div className="flex items-center space-x-4 relative z-10">
                                  <div className={cn(
                                    'w-2 h-2 rounded-full transition-all duration-200',
                                    isActive 
                                      ? 'bg-accent-blue scale-100' 
                                      : 'bg-text-secondary/40 scale-75 group-hover:bg-accent-blue group-hover:scale-100'
                                  )} />
                                  <span className="flex-1">{item.label}</span>
                                </div>
                                
                                {/* Hover effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  initial={false}
                                />
                              </Link>
                            </motion.div>
                          );
                        })}
                        
                        {/* Admin Link */}
                        {isAdmin && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (navItems.length * 0.05) }}
                            className="pt-4 border-t border-white/10"
                          >
                            <Link
                              href="/admin"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                'group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden',
                                pathname.startsWith('/admin')
                                  ? 'text-accent-purple bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20'
                                  : 'text-text-primary hover:bg-white/10 hover:text-accent-purple'
                              )}
                            >
                              {pathname.startsWith('/admin') && (
                                <motion.div
                                  layoutId="mobile-sidebar-admin-indicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-purple to-accent-pink rounded-r-full"
                                />
                              )}
                              
                              <div className="flex items-center space-x-4 relative z-10">
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="flex-1">Admin Dashboard</span>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                      </nav>
                    </div>

                    {/* Footer Section */}
                    {user && (
                      <div className="px-6 py-4 border-t border-white/10">
                        <div className="flex space-x-2">
                          <Link
                            href="/settings"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-white/10 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}