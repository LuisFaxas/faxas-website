'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Command,
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassCard, GlassButton, glass } from '@/components/ui/glass';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AdminHeaderProps {
  onCommandPalette: () => void;
  sidebarCollapsed?: boolean;
  onMobileMenu?: () => void;
}

export function AdminHeader({ onCommandPalette, sidebarCollapsed, onMobileMenu }: AdminHeaderProps) {
  const { userProfile, signOut } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Generate time-based greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showProfileMenu && !(e.target as Element).closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <header className="sticky top-0 z-30 p-4 sm:p-6">
      <GlassCard
        level="strong"
        border="subtle"
        shadow="md"
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Greeting */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {onMobileMenu && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={onMobileMenu}
                className="lg:hidden"
                icon={<Menu className="w-5 h-5" />}
              />
            )}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className={cn("text-xl sm:text-2xl font-bold", glass.text.primary)}>
                {greeting}, {userProfile?.displayName || 'Admin'}!
              </h1>
              <p className={cn("text-sm hidden sm:block", glass.text.secondary)}>
                Here's what's happening with your leads today
              </p>
            </motion.div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Button - Desktop */}
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onCommandPalette}
              className="hidden lg:flex"
              icon={<Command className="w-4 h-4" />}
            >
              <span className="text-xs">⌘K</span>
            </GlassButton>

            {/* Search Button - Mobile */}
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onCommandPalette}
              className="lg:hidden"
              icon={<Search className="w-5 h-5" />}
            />

            {/* Notifications */}
            <GlassButton
              variant="ghost"
              size="sm"
              className="relative"
              icon={
                <>
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </>
              }
            />

            {/* Dark Mode Toggle */}
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              icon={
                darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              }
            />

            {/* Profile Menu */}
            <div className="relative profile-menu">
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-1"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              </GlassButton>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56"
                  >
                    <GlassCard
                      level="strong"
                      border="medium"
                      shadow="lg"
                      spacing="xs"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className={cn("font-medium", glass.text.primary)}>
                          {userProfile?.displayName || 'Admin User'}
                        </p>
                        <p className={cn("text-sm", glass.text.tertiary)}>
                          {userProfile?.email}
                        </p>
                      </div>
                      
                      <div className="p-1">
                        <Link
                          href="/admin/profile"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg",
                            "hover:bg-white/5 transition-colors",
                            glass.text.secondary
                          )}
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">Profile Settings</span>
                        </Link>
                        
                        <button
                          onClick={async () => {
                            setShowProfileMenu(false);
                            await signOut();
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
                            "hover:bg-white/5 transition-colors text-left",
                            glass.text.secondary
                          )}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </GlassCard>
    </header>
  );
}