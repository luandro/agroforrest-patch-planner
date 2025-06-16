import React, { useState } from 'react';
import { Share2, Copy, Check, Mail, MessageCircle, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Patch } from '../types/patch.types';

interface ShareDialogProps {
  patch: Patch;
  open: boolean;
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ patch, open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate the preview URL
  const baseUrl = window.location.origin;
  const previewUrl = `${baseUrl}/patch/${patch.id}/preview`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente selecionar o texto manualmente.",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Visualize meu patch: ${patch.name}`);
    const body = encodeURIComponent(`
Olá!

Gostaria de compartilhar meu patch "${patch.name}" do AgroForrest Patch Planner.

${patch.description ? `Descrição: ${patch.description}` : ''}

Visualize aqui: ${previewUrl}

Criado com AgroForrest Patch Planner
    `.trim());
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`
Confira meu patch "${patch.name}" no AgroForrest Patch Planner!

${patch.description ? `${patch.description}\n` : ''}
Visualize aqui: ${previewUrl}
    `.trim());
    
    window.open(`https://wa.me/?text=${message}`);
  };

  const handleDownloadImage = async () => {
    try {
      // This would ideally capture the canvas and download as image
      // For now, we'll show a message that this feature is coming soon
      toast({
        title: "Em breve!",
        description: "A funcionalidade de download como imagem será implementada em breve.",
      });
    } catch (error) {
      console.error('Failed to download image:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar a imagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Compartilhar Patch</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patch Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">{patch.name}</div>
            {patch.description && (
              <div className="text-sm text-gray-600 mt-1">{patch.description}</div>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {patch.size.width}m × {patch.size.height}m
              </Badge>
              {patch.location && (
                <Badge variant="outline" className="text-xs">
                  {patch.location}
                </Badge>
              )}
            </div>
          </div>

          {/* Share URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Link de Visualização
            </label>
            <div className="flex space-x-2">
              <Input
                value={previewUrl}
                readOnly
                className="flex-1 text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="flex items-center space-x-1"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {copied ? 'Copiado' : 'Copiar'}
                </span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Qualquer pessoa com este link poderá visualizar seu patch
            </p>
          </div>

          {/* Share Options */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Compartilhar via
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleEmailShare}
                className="flex items-center justify-center space-x-2 p-3"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center space-x-2 p-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleDownloadImage}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar como Imagem</span>
              <Badge variant="secondary" className="text-xs ml-2">
                Em breve
              </Badge>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
