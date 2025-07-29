'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BarChart3,
  FileText,
  Image,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { useAuthStore } from '@/lib/store/authStore';

const moreItems = [
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'View detailed analytics and reports',
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: FileText,
    description: 'Manage blog posts and content',
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
    description: 'Upload and organize media files',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure admin preferences',
  },
  {
    label: 'Help & Support',
    href: '/admin/help',
    icon: HelpCircle,
    description: 'Get help and documentation',
  },
];

export default function MorePage() {
  const { signOut } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">More Options</h1>
        <p className="text-text-secondary mt-1">Additional tools and settings</p>
      </div>

      <div className="space-y-4">
        {moreItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <GlassPanel 
                  level="secondary" 
                  className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-accent-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{item.label}</h3>
                        <p className="text-sm text-text-secondary">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-tertiary" />
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          );
        })}

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: moreItems.length * 0.1 }}
        >
          <button
            onClick={signOut}
            className="w-full"
          >
            <GlassPanel 
              level="secondary" 
              className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-red-50/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Sign Out</h3>
                    <p className="text-sm text-text-secondary">Log out of admin panel</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </div>
            </GlassPanel>
          </button>
        </motion.div>
      </div>
    </div>
  );
}