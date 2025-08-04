'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminBottomNav } from '@/components/admin/AdminBottomNav';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { MobileDrawer } from '@/components/admin/MobileDrawer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { FloatingElements } from '@/components/admin/FloatingElements';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Enable keyboard shortcut for command palette
  useCommandPalette(() => setCommandPaletteOpen(true));

  return (
    <ProtectedRoute requireAdmin>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950">
        <AnimatedBackground />
        <FloatingElements />
        
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
              onMobileMenu={() => setMobileDrawerOpen(true)}
            />
            
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
              <div className="max-w-[1400px] mx-auto">
                {children}
              </div>
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
        
        {/* Mobile Drawer */}
        <MobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}