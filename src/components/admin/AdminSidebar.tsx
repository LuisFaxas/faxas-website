'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  FileText,
  Image,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: Users,
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
  },
  {
    label: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AdminSidebar({ collapsed = false, onToggle, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { userProfile, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-lg shadow-lg border border-glass-lighter"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-text-primary" />
        )}
      </motion.button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full transform transition-all duration-300 z-40',
          collapsed ? 'w-20' : 'w-64',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          className
        )}
      >
        <div className="h-full p-4">
          <GlassPanel level="primary" className="h-full flex flex-col relative overflow-hidden">
            {/* Collapse Toggle - Desktop Only */}
            {onToggle && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggle}
                className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple items-center justify-center shadow-lg z-10"
              >
                {collapsed ? (
                  <ChevronRight className="w-4 h-4 text-white" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-white" />
                )}
              </motion.button>
            )}
            
            {/* Header */}
            <div className={cn(
              "p-6 border-b border-glass-lighter transition-all duration-300",
              collapsed && "p-4"
            )}>
              <Link href="/admin" className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">F</span>
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="text-xl font-bold text-text-primary">FAXAS</h2>
                        <p className="text-xs text-text-secondary">Admin Panel</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-3 rounded-lg bg-glass-light overflow-hidden"
                  >
                    <p className="text-xs text-text-secondary">Logged in as</p>
                    <p className="text-sm text-text-primary font-medium truncate">
                      {userProfile?.email || 'Admin'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    title={collapsed ? item.label : undefined}
                  >
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 text-accent-blue'
                          : 'text-text-secondary hover:bg-white/10 hover:text-text-primary',
                        collapsed && 'justify-center px-3'
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive && "text-accent-blue"
                      )} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="font-medium overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && !collapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-0 w-1 h-8 bg-gradient-to-b from-accent-blue to-accent-purple rounded-l-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-glass-lighter">
              <button
                onClick={signOut}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors w-full",
                  collapsed && "justify-center px-3"
                )}
                title={collapsed ? "Sign Out" : undefined}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium overflow-hidden whitespace-nowrap"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </GlassPanel>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}