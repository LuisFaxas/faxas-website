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
  BarChart3,
  FileText,
  Image,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassSidebar, GlassButton, glass } from '@/components/ui/glass';
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
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle, className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuthStore();

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("relative hidden lg:block", className)}
    >
      <GlassSidebar
        position="left"
        className="h-full flex flex-col"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3",
              glass.text.primary,
              "font-bold text-xl"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">F</span>
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  FAXAS Admin
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-all duration-200",
                  isActive ? (
                    cn(
                      glass.levels.subtle.combined,
                      glass.borders.subtle,
                      "shadow-sm"
                    )
                  ) : (
                    "hover:bg-white/5"
                  ),
                  glass.text.secondary,
                  isActive && glass.text.primary
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "text-accent-blue"
                )} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
              "hover:bg-white/5 transition-colors",
              glass.text.secondary
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle */}
        {onToggle && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "absolute -right-3 top-8",
              "w-6 h-6 p-0 rounded-full",
              glass.levels.strong.combined,
              glass.borders.medium,
              glass.shadows.sm
            )}
            icon={
              collapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )
            }
          />
        )}
      </GlassSidebar>
    </motion.div>
  );
}