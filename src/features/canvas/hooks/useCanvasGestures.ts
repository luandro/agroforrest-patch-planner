
import { useRef, useCallback, useEffect } from 'react';
import { CanvasGesture, CanvasPoint } from '../types/canvas.types';

interface UseCanvasGesturesProps {
  onPan: (deltaX: number, deltaY: number) => void;
  onZoom: (zoom: number, centerX?: number, centerY?: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentZoom: number;
  tool: string;
  isCreating: boolean;
}

export const useCanvasGestures = ({
  onPan,
  onZoom,
  canvasRef,
  currentZoom,
  tool,
  isCreating
}: UseCanvasGesturesProps) => {
  const gestureRef = useRef<CanvasGesture>({
    isPanning: false,
    isZooming: false
  });

  const getDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getCanvasPoint = useCallback((clientX: number, clientY: number): CanvasPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, [canvasRef]);

  // Only handle gestures for pan tool, but allow zoom for all tools
  const shouldHandlePanGestures = tool === 'pan' && !isCreating;

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    console.log('Touch start:', { tool, isCreating, shouldHandlePan: shouldHandlePanGestures, touches: e.touches.length });
    
    // Only prevent default for pan gestures or multi-touch zoom
    if (shouldHandlePanGestures || e.touches.length >= 2) {
      e.preventDefault();
    }
    
    if (e.touches.length === 1 && shouldHandlePanGestures) {
      // Single finger - start panning (only for pan tool)
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      gestureRef.current = {
        isPanning: true,
        isZooming: false,
        lastPanPoint: point
      };
    } else if (e.touches.length === 2) {
      // Two fingers - start pinch zoom (always available)
      e.preventDefault(); // Always prevent default for pinch zoom
      const distance = getDistance(e.touches);
      gestureRef.current = {
        isPanning: false,
        isZooming: true,
        initialDistance: distance,
        initialZoom: currentZoom
      };
    }
  }, [getCanvasPoint, getDistance, currentZoom, shouldHandlePanGestures, tool, isCreating]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const gesture = gestureRef.current;
    
    // Only prevent default for active gestures
    if (gesture.isPanning || gesture.isZooming) {
      e.preventDefault();
    }
    
    if (gesture.isPanning && e.touches.length === 1 && gesture.lastPanPoint && shouldHandlePanGestures) {
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      console.log('Touch pan:', { deltaX, deltaY });
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    } else if (gesture.isZooming && e.touches.length === 2 && gesture.initialDistance && gesture.initialZoom) {
      const distance = getDistance(e.touches);
      const scale = distance / gesture.initialDistance;
      const newZoom = gesture.initialZoom * scale;
      
      console.log('Touch zoom:', { scale, newZoom });
      onZoom(newZoom);
    }
  }, [getCanvasPoint, getDistance, onPan, onZoom, shouldHandlePanGestures]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    console.log('Touch end:', { tool, touches: e.touches.length });
    
    // Only prevent default if we were handling an active gesture
    const gesture = gestureRef.current;
    if (gesture.isPanning || gesture.isZooming) {
      e.preventDefault();
    }
    
    if (e.touches.length === 0) {
      gestureRef.current = {
        isPanning: false,
        isZooming: false
      };
    }
  }, []);

  // Mouse event handlers - only for desktop pan
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    if (!shouldHandlePanGestures) return;
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    gestureRef.current = {
      isPanning: true,
      isZooming: false,
      lastPanPoint: point
    };
  }, [getCanvasPoint, shouldHandlePanGestures]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!shouldHandlePanGestures) return;
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    }
  }, [getCanvasPoint, onPan, shouldHandlePanGestures]);

  const handleMouseUp = useCallback(() => {
    gestureRef.current = {
      isPanning: false,
      isZooming: false
    };
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = currentZoom * zoomFactor;
    
    onZoom(newZoom);
  }, [currentZoom, onZoom]);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Touch events - conditional passive based on tool
    const touchOptions = { passive: false };
    canvas.addEventListener('touchstart', handleTouchStart, touchOptions);
    canvas.addEventListener('touchmove', handleTouchMove, touchOptions);
    canvas.addEventListener('touchend', handleTouchEnd, touchOptions);

    // Mouse events - only for pan mode
    if (shouldHandlePanGestures) {
      canvas.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    // Wheel event - always active for zoom
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      
      if (shouldHandlePanGestures) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
      
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, shouldHandlePanGestures]);

  return gestureRef.current;
};
