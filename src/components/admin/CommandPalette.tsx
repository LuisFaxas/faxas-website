'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  FolderOpen,
  MessageSquare,
  Plus,
  Settings,
  LogOut,
  FileText,
  Download,
  ChevronRight
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass/glass-panel';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/authStore';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Command {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
  section: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      name: 'Go to Dashboard',
      icon: ChevronRight,
      action: () => router.push('/admin'),
      section: 'Navigation',
    },
    {
      id: 'nav-leads',
      name: 'View All Leads',
      icon: Users,
      action: () => router.push('/admin/leads'),
      section: 'Navigation',
    },
    {
      id: 'nav-projects',
      name: 'Browse Projects',
      icon: FolderOpen,
      action: () => router.push('/admin/projects'),
      section: 'Navigation',
    },
    {
      id: 'nav-messages',
      name: 'Check Messages',
      icon: MessageSquare,
      action: () => router.push('/admin/messages'),
      section: 'Navigation',
    },
    // Actions
    {
      id: 'action-new-lead',
      name: 'Add New Lead',
      shortcut: '⌘N',
      icon: Plus,
      action: () => router.push('/admin/leads/new'),
      section: 'Actions',
    },
    {
      id: 'action-new-project',
      name: 'Create New Project',
      icon: Plus,
      action: () => router.push('/admin/projects/new'),
      section: 'Actions',
    },
    {
      id: 'action-export',
      name: 'Export Leads to CSV',
      shortcut: '⌘E',
      icon: Download,
      action: () => {
        // Export functionality
        console.log('Exporting leads...');
      },
      section: 'Actions',
    },
    // System
    {
      id: 'system-settings',
      name: 'Settings',
      shortcut: '⌘,',
      icon: Settings,
      action: () => router.push('/admin/settings'),
      section: 'System',
    },
    {
      id: 'system-docs',
      name: 'Documentation',
      icon: FileText,
      action: () => window.open('/docs', '_blank'),
      section: 'System',
    },
    {
      id: 'system-logout',
      name: 'Sign Out',
      icon: LogOut,
      action: () => signOut(),
      section: 'System',
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.section]) acc[command.section] = [];
    acc[command.section].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onOpenChange(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filteredCommands, onOpenChange]);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[20%] mx-auto max-w-2xl z-50"
          >
            <GlassPanel level="primary" className="overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-glass-lighter">
                <Search className="w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                  autoFocus
                />
                <kbd className="text-xs px-2 py-1 rounded bg-white/10 text-text-secondary">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([section, sectionCommands]) => (
                  <div key={section} className="mb-4">
                    <h3 className="text-xs font-medium text-text-tertiary uppercase tracking-wider px-3 py-1">
                      {section}
                    </h3>
                    {sectionCommands.map((command, index) => {
                      const Icon = command.icon;
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.button
                          key={command.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            command.action();
                            onOpenChange(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                            isSelected 
                              ? "bg-gradient-to-r from-accent-blue/20 to-accent-purple/20"
                              : "hover:bg-white/10"
                          )}
                        >
                          <Icon className="w-4 h-4 text-text-secondary" />
                          <span className="flex-1 text-left text-sm text-text-primary">
                            {command.name}
                          </span>
                          {command.shortcut && (
                            <kbd className="text-xs px-2 py-0.5 rounded bg-white/10 text-text-tertiary">
                              {command.shortcut}
                            </kbd>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    No commands found
                  </div>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}