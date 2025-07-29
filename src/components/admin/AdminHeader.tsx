'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Command,
  Menu,
  User,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AdminHeaderProps {
  onCommandPalette: () => void;
  sidebarCollapsed?: boolean;
}

export function AdminHeader({ onCommandPalette, sidebarCollapsed }: AdminHeaderProps) {
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
    // In production, this would update a global theme context
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-20">
      <GlassPanel level="primary" className="m-4 sm:m-6">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Greeting */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => {/* Mobile menu handled by sidebar */}}
              >
                <Menu className="w-5 h-5 text-text-primary" />
              </motion.button>
              
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl font-bold text-text-primary"
                >
                  {greeting}, {userProfile?.displayName || 'Admin'}!
                </motion.h1>
                <p className="text-sm text-text-secondary hidden sm:block">
                  Here's what's happening with your leads today
                </p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Command Palette Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCommandPalette}
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Command className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">⌘K</span>
              </motion.button>

              {/* Search Button - Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCommandPalette}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Search className="w-5 h-5 text-text-primary" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-text-primary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-text-primary" />
                )}
              </motion.button>

              {/* Profile Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {userProfile?.displayName?.charAt(0) || 'A'}
                    </span>
                  </div>
                </motion.button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48"
                  >
                    <GlassPanel level="secondary" className="p-1">
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-primary">Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-primary">Sign Out</span>
                      </button>
                    </GlassPanel>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </header>
  );
}