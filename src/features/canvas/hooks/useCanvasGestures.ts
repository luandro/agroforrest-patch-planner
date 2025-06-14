
import { useRef, useCallback, useEffect } from 'react';
import { CanvasGesture, CanvasPoint } from '../types/canvas.types';

interface UseCanvasGesturesProps {
  onPan: (deltaX: number, deltaY: number) => void;
  onZoom: (zoom: number, centerX?: number, centerY?: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentZoom: number;
}

export const useCanvasGestures = ({
  onPan,
  onZoom,
  canvasRef,
  currentZoom
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

  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single finger - start panning
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      gestureRef.current = {
        isPanning: true,
        isZooming: false,
        lastPanPoint: point
      };
    } else if (e.touches.length === 2) {
      // Two fingers - start pinch zoom
      const distance = getDistance(e.touches);
      gestureRef.current = {
        isPanning: false,
        isZooming: true,
        initialDistance: distance,
        initialZoom: currentZoom
      };
    }
  }, [getCanvasPoint, getDistance, currentZoom]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && e.touches.length === 1 && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    } else if (gesture.isZooming && e.touches.length === 2 && gesture.initialDistance && gesture.initialZoom) {
      const distance = getDistance(e.touches);
      const scale = distance / gesture.initialDistance;
      const newZoom = gesture.initialZoom * scale;
      
      onZoom(newZoom);
    }
  }, [getCanvasPoint, getDistance, onPan, onZoom]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 0) {
      gestureRef.current = {
        isPanning: false,
        isZooming: false
      };
    }
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    gestureRef.current = {
      isPanning: true,
      isZooming: false,
      lastPanPoint: point
    };
  }, [getCanvasPoint]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    }
  }, [getCanvasPoint, onPan]);

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

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Wheel event
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel]);

  return gestureRef.current;
};
