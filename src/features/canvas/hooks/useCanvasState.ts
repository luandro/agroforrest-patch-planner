
import { useRef, useState } from 'react';

export const useCanvasState = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return {
    canvasRef,
    isCollapsed,
    onToggleCollapse
  };
};
