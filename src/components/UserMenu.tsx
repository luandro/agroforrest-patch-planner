
import React, { useEffect } from 'react';
import { X, User, Settings, LogOut, Eye, Plus, Trash2, Download, HelpCircle, Info, AlertTriangle } from 'lucide-react';
import { useMenuStore } from '@/stores/menuStore';
import { useBedStore } from '@/features/canvas/stores/bedStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserMenuProps {
  onFitAll: () => void;
  onCreateNewPatch: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onFitAll, onCreateNewPatch }) => {
  const { isMenuOpen, setMenuOpen } = useMenuStore();
  const { beds, loadBeds, tool, setTool } = useBedStore();
  const { toast } = useToast();
  const [confirmText, setConfirmText] = React.useState('');
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = React.useState(false);

  // Handle escape key and backdrop click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, setMenuOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  };

  const handleViewAllBeds = () => {
    if (beds.length === 0) {
      toast({
        title: "Nenhum canteiro encontrado",
        description: "Crie alguns canteiros primeiro para usar esta função.",
      });
    } else {
      onFitAll();
      toast({
        title: "Visualizando todos os canteiros",
        description: `${beds.length} canteiro(s) ajustado(s) à tela.`,
      });
    }
    setMenuOpen(false);
  };

  const handleCreateNewPatch = () => {
    if (beds.length > 0) {
      // Show save dialog first
      onCreateNewPatch();
    } else {
      // Just reset viewport
      onCreateNewPatch();
    }
    setMenuOpen(false);
  };

  const handleClearCurrentPatch = () => {
    loadBeds([]);
    setShowClearDialog(false);
    setMenuOpen(false);
    toast({
      title: "Canteiros removidos",
      description: "Todos os canteiros foram removidos do projeto atual.",
    });
  };

  const handleClearAllData = () => {
    if (confirmText !== 'DELETE') return;
    
    // Clear IndexedDB and all stores
    loadBeds([]);
    localStorage.clear();
    sessionStorage.clear();
    
    setShowClearAllDialog(false);
    setMenuOpen(false);
    setConfirmText('');
    
    toast({
      title: "Todos os dados foram apagados",
      description: "Redirecionando para a página inicial...",
      variant: "destructive",
    });
    
    // Redirect to landing page
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleExportData = () => {
    const data = {
      beds,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agroforrest-patch-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMenuOpen(false);
    toast({
      title: "Dados exportados",
      description: "Arquivo baixado com sucesso.",
    });
  };

  const menuItems = [
    {
      section: 'Usuário',
      items: [
        { icon: User, label: 'Maria Silva', action: () => {}, disabled: true },
        { icon: Settings, label: 'Configurações', action: () => {} },
        { icon: LogOut, label: 'Sair', action: () => {} },
      ]
    },
    {
      section: 'Gerenciar Canteiros',
      items: [
        { icon: Eye, label: 'Ver Todos os Canteiros', action: handleViewAllBeds },
        { icon: Plus, label: 'Criar Nova Área', action: handleCreateNewPatch },
        { icon: Trash2, label: 'Limpar Área Atual', action: () => setShowClearDialog(true), danger: true },
      ]
    },
    {
      section: 'Gerenciar Dados',
      items: [
        { icon: Download, label: 'Exportar Dados', action: handleExportData },
        { icon: AlertTriangle, label: 'Apagar Todos os Dados', action: () => setShowClearAllDialog(true), danger: true },
      ]
    },
    {
      section: 'Informações',
      items: [
        { icon: HelpCircle, label: 'Ajuda e Tutorial', action: () => {} },
        { icon: Info, label: 'Sobre AgroForrest', action: () => {} },
      ]
    }
  ];

  if (!isMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out",
          "w-full sm:w-80 overflow-y-auto"
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="py-2">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.section}>
              {/* Section Header */}
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {section.section}
              </div>
              
              {/* Section Items */}
              <div className="py-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={`${sectionIndex}-${itemIndex}`}
                    onClick={item.action}
                    disabled={item.disabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      "min-h-[48px] text-sm",
                      item.disabled && "opacity-50 cursor-not-allowed",
                      item.danger && "text-red-600 hover:bg-red-50"
                    )}
                  >
                    <item.icon size={18} className={item.danger ? "text-red-500" : "text-gray-500"} />
                    <span className="flex-1">{item.label}</span>
                  </button>
                ))}
              </div>
              
              {sectionIndex < menuItems.length - 1 && (
                <div className="border-b border-gray-200 my-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Current Patch Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar Área Atual</DialogTitle>
            <DialogDescription>
              Isto removerá todos os canteiros da área atual. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClearCurrentPatch}>
              Limpar Canteiros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Data Dialog */}
      <Dialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Apagar Todos os Dados</DialogTitle>
            <DialogDescription>
              Esta ação apagará TODOS os dados e não pode ser desfeita. 
              Digite "DELETE" para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Digite DELETE para confirmar"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="border-red-300 focus:border-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowClearAllDialog(false);
              setConfirmText('');
            }}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearAllData}
              disabled={confirmText !== 'DELETE'}
            >
              Apagar Tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
