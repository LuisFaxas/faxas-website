'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { cn } from '@/lib/utils';
import { adminTheme } from '@/components/admin/design-system';

interface AdminBottomNavProps {
  className?: string;
}

const navItems = [
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
    label: 'More',
    href: '/admin/more',
    icon: MoreHorizontal,
  },
];

export function AdminBottomNav({ className }: AdminBottomNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50", className)}>
      {/* Glass Background */}
      <div className={cn("absolute inset-0", adminTheme.glass.nav, "border-t")} />
      
      <nav className="relative flex items-center justify-around px-2 py-3 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-white/10 dark:bg-white/10 rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all",
                    !isActive && "hover:bg-white/10"
                  )}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className={cn(
                        "w-6 h-6 transition-colors",
                        isActive 
                          ? adminTheme.icon.active 
                          : adminTheme.icon.default
                      )} />
                    </motion.div>
                    <span className={cn(
                      "text-xs font-medium transition-colors",
                      isActive 
                        ? adminTheme.text.primary 
                        : adminTheme.text.tertiary
                    )}>
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>
    </div>
  );
}