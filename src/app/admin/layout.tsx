'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  // Enable keyboard shortcut for command palette
  useCommandPalette(() => setCommandPaletteOpen(true));

  return (
    <ProtectedRoute requireAdmin>
      <div className="relative min-h-screen bg-gradient-to-br from-background-start via-background-middle to-background-end">
        <AnimatedBackground />
        
        <div className="relative z-10 flex min-h-screen">
          {/* Desktop Sidebar */}
          <AdminSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block" 
          />
          
          {/* Main Content Area */}
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          )}>
            {/* Smart Header */}
            <AdminHeader 
              onCommandPalette={() => setCommandPaletteOpen(true)}
              sidebarCollapsed={sidebarCollapsed}
            />
            
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
              {children}
            </main>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <AdminBottomNav className="lg:hidden" />
        
        {/* Command Palette */}
        <CommandPalette 
          open={commandPaletteOpen} 
          onOpenChange={setCommandPaletteOpen} 
        />
      </div>
    </ProtectedRoute>
  );
}