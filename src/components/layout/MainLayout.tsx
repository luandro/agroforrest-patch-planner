
import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useMenuStore } from '@/stores/menuStore';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { PatchSelector } from '@/features/canvas/components/PatchSelector';

interface MainLayoutProps {
  children: React.ReactNode;
  showUserMenu?: boolean;
  showPatchSelector?: boolean;
  onFitAll?: () => void;
  onCreateNewPatch?: () => void;
  onPatchSwitch?: (patchId: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showUserMenu = false,
  showPatchSelector = false,
  onFitAll = () => {},
  onCreateNewPatch = () => {},
  onPatchSwitch
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleMenu } = useMenuStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AgroForrest</h1>
            </div>

            {/* Center - Patch Selector */}
            {showPatchSelector && (
              <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
                <PatchSelector onPatchSwitch={onPatchSwitch} />
              </div>
            )}

            {/* Right side controls */}
            <div className="flex items-center space-x-2">
              {/* User Menu Button (for patch creator page) */}
              {showUserMenu && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMenu}
                  className="h-11 w-11 p-0 hover:bg-gray-100"
                  aria-label="Abrir menu do usuário"
                >
                  <Menu size={20} className="text-gray-600" />
                </Button>
              )}

              {/* Desktop Menu (for other pages) */}
              {!showUserMenu && (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={18} className="text-gray-600" />
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <LogOut size={18} />
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>

                  {/* Mobile Menu Button (for other pages) */}
                  <div className="md:hidden">
                    <button
                      onClick={toggleMobileMenu}
                      className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
                    >
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Patch Selector */}
          {showPatchSelector && (
            <div className="md:hidden px-4 pb-3 border-t border-gray-200">
              <div className="mt-3">
                <PatchSelector onPatchSwitch={onPatchSwitch} />
              </div>
            </div>
          )}

          {/* Mobile Menu (for other pages) */}
          {!showUserMenu && isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700">Usuário</span>
                </div>
                <button className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md w-full text-left">
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={showUserMenu ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        {children}
      </main>

      {/* User Menu Component */}
      {showUserMenu && (
        <UserMenu 
          onFitAll={onFitAll}
          onCreateNewPatch={onCreateNewPatch}
        />
      )}
    </div>
  );
};

export default MainLayout;
