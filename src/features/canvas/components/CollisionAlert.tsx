
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CollisionAlertProps {
  hasCollision: boolean;
  onDismiss?: () => void;
}

export const CollisionAlert: React.FC<CollisionAlertProps> = ({
  hasCollision,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (hasCollision) {
      setIsVisible(true);
      setIsExiting(false);
      
      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Wait for fade animation to complete
        setTimeout(() => {
          setIsVisible(false);
          setIsExiting(false);
          onDismiss?.();
        }, 200);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Immediately hide if no collision
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 200);
    }
  }, [hasCollision, onDismiss]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
      style={{ maxWidth: '300px' }}
    >
      <Alert variant="destructive" className="bg-gray-800 border-red-500 text-white">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-white">
          ❌ Posição inválida - sobreposição detectada
        </AlertDescription>
      </Alert>
    </div>
  );
};
