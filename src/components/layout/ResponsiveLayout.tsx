import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  toolbar?: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsible?: boolean;
}

/**
 * ResponsiveLayout - Modern responsive layout with sidebar and toolbar
 * - Desktop: Persistent left sidebar + top toolbar + main content
 * - Mobile: Drawer sidebar + top toolbar + main content
 * - Tablet: Collapsible sidebar
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  toolbar,
  showSidebar = true,
  sidebarCollapsible = true
}) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Toolbar */}
      {toolbar && (
        <header className="bg-white border-b border-gray-200 shadow-sm z-40 relative">
          <div className="flex items-center justify-between h-16 px-4 gap-4">
            {/* Sidebar Toggle for Mobile */}
            {showSidebar && isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSidebar}
                className="h-9 w-9 p-0"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </Button>
            )}

            {/* Toolbar Content */}
            <div className="flex-1 flex items-center">
              {toolbar}
            </div>
          </div>
        </header>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Desktop & Tablet */}
        {showSidebar && !isMobile && (
          <>
            <aside
              className={cn(
                "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0 relative z-30",
                isSidebarOpen ? "w-80" : "w-0 overflow-hidden"
              )}
            >
              {isSidebarOpen && sidebar}

              {/* Toggle Button for Desktop */}
              {sidebarCollapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSidebar}
                  className={cn(
                    "absolute -right-3 top-4 h-6 w-6 p-0 bg-white border border-gray-200 rounded-full shadow-sm z-10",
                    "hover:bg-gray-50"
                  )}
                  aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  {isSidebarOpen ? (
                    <span className="text-xs">‹</span>
                  ) : (
                    <span className="text-xs">›</span>
                  )}
                </Button>
              )}
            </aside>
          </>
        )}

        {/* Mobile Sidebar Backdrop */}
        {showSidebar && isMobile && isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        {showSidebar && isMobile && (
          <aside
            className={cn(
              "fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50",
              "transform transition-transform duration-300 ease-in-out",
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Mobile Sidebar Content */}
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
};
