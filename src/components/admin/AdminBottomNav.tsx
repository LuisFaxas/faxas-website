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
    <div className={cn("fixed bottom-0 left-0 right-0 z-20", className)}>
      <GlassPanel level="primary" className="m-0 rounded-none rounded-t-[32px] border-b-0">
        <nav className="flex items-center justify-around px-2 py-2 pb-safe">
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
                  className={cn(
                    "flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all",
                    isActive 
                      ? "bg-gradient-to-br from-accent-blue/20 to-accent-purple/20" 
                      : "hover:bg-white/10"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-accent-blue" : "text-text-secondary"
                  )} />
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-accent-blue" : "text-text-secondary"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </GlassPanel>
    </div>
  );
}