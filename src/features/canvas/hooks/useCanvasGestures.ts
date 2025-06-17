
import { useRef, useCallback, useEffect } from 'react';
import { CanvasGesture, CanvasPoint } from '../types/canvas.types';

interface UseCanvasGesturesProps {
  onPan: (deltaX: number, deltaY: number) => void;
  onZoom: (zoom: number, centerX?: number, centerY?: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentZoom: number;
  enabled?: boolean;
}

export const useCanvasGestures = ({
  onPan,
  onZoom,
  canvasRef,
  currentZoom,
  enabled = true
}: UseCanvasGesturesProps) => {
  const gestureRef = useRef<CanvasGesture>({
    isPanning: false,
    isZooming: false
  });
  const zoomRef = useRef(currentZoom);

  useEffect(() => {
    zoomRef.current = currentZoom;
  }, [currentZoom]);

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

  const getCenterPoint = useCallback((touches: TouchList): CanvasPoint => {
    if (touches.length === 1) {
      return getCanvasPoint(touches[0].clientX, touches[0].clientY);
    } else if (touches.length >= 2) {
      const centerX = (touches[0].clientX + touches[1].clientX) / 2;
      const centerY = (touches[0].clientY + touches[1].clientY) / 2;
      return getCanvasPoint(centerX, centerY);
    }
    return { x: 0, y: 0 };
  }, [getCanvasPoint]);

  // Enhanced touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Touch start:', e.touches.length, 'touches');
    
    if (e.touches.length === 1) {
      // Single finger - pan mode
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      gestureRef.current = {
        isPanning: true,
        isZooming: false,
        lastPanPoint: point
      };
      console.log('Started panning at:', point);
    } else if (e.touches.length === 2) {
      // Two fingers - zoom mode
      const distance = getDistance(e.touches);
      const centerPoint = getCenterPoint(e.touches);
      gestureRef.current = {
        isPanning: false,
        isZooming: true,
        initialDistance: distance,
        initialZoom: zoomRef.current,
        zoomCenter: centerPoint
      };
      console.log('Started zooming with distance:', distance, 'center:', centerPoint);
    }
  }, [getCanvasPoint, getDistance, getCenterPoint, enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && e.touches.length === 1 && gesture.lastPanPoint) {
      // Handle panning
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      // Apply panning with proper sensitivity for mobile
      onPan(deltaX * 1.2, deltaY * 1.2);
      gesture.lastPanPoint = point;
      
    } else if (gesture.isZooming && e.touches.length === 2 && gesture.initialDistance && gesture.initialZoom) {
      // Handle pinch-to-zoom
      const distance = getDistance(e.touches);
      const scale = distance / gesture.initialDistance;
      
      // Apply zoom with bounds and smooth scaling
      const newZoom = Math.max(0.1, Math.min(10, gesture.initialZoom * scale));
      
      // Get current center point for zoom
      const centerPoint = getCenterPoint(e.touches);
      
      console.log('Zooming:', { scale, newZoom, center: centerPoint });
      onZoom(newZoom, centerPoint.x, centerPoint.y);
    }
  }, [getCanvasPoint, getDistance, getCenterPoint, onPan, onZoom, enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Touch end:', e.touches.length, 'remaining touches');
    
    if (e.touches.length === 0) {
      // All fingers lifted - reset gesture state
      gestureRef.current = {
        isPanning: false,
        isZooming: false
      };
    } else if (e.touches.length === 1 && gestureRef.current.isZooming) {
      // Transition from zoom to pan
      const point = getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      gestureRef.current = {
        isPanning: true,
        isZooming: false,
        lastPanPoint: point
      };
    }
  }, [getCanvasPoint, enabled]);

  // Mouse handlers for desktop compatibility
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || e.button !== 0) return;
    
    const point = getCanvasPoint(e.clientX, e.clientY);
    gestureRef.current = {
      isPanning: true,
      isZooming: false,
      lastPanPoint: point
    };
  }, [getCanvasPoint, enabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const gesture = gestureRef.current;
    
    if (gesture.isPanning && gesture.lastPanPoint) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      const deltaX = point.x - gesture.lastPanPoint.x;
      const deltaY = point.y - gesture.lastPanPoint.y;
      
      onPan(deltaX, deltaY);
      gesture.lastPanPoint = point;
    }
  }, [getCanvasPoint, onPan, enabled]);

  const handleMouseUp = useCallback(() => {
    if (!enabled) return;
    
    gestureRef.current = {
      isPanning: false,
      isZooming: false
    };
  }, [enabled]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled) return;
    
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoomRef.current * zoomFactor));
    
    // Get mouse position for zoom center
    const point = getCanvasPoint(e.clientX, e.clientY);
    onZoom(newZoom, point.x, point.y);
  }, [getCanvasPoint, onZoom, enabled]);

  // Set up event listeners with proper touch handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;

    // Touch events - aggressive prevention of default behaviors
    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e);

    // Mouse events for desktop
    const mouseDownHandler = (e: MouseEvent) => handleMouseDown(e);
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = (e: MouseEvent) => handleMouseUp();
    const wheelHandler = (e: WheelEvent) => handleWheel(e);

    // Add touch event listeners with passive: false to allow preventDefault
    canvas.addEventListener('touchstart', touchStartHandler, { passive: false });
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    canvas.addEventListener('touchend', touchEndHandler, { passive: false });
    canvas.addEventListener('touchcancel', touchEndHandler, { passive: false });

    // Add mouse event listeners
    canvas.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    canvas.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      // Clean up all event listeners
      canvas.removeEventListener('touchstart', touchStartHandler);
      canvas.removeEventListener('touchmove', touchMoveHandler);
      canvas.removeEventListener('touchend', touchEndHandler);
      canvas.removeEventListener('touchcancel', touchEndHandler);
      canvas.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      canvas.removeEventListener('wheel', wheelHandler);
    };
  }, [canvasRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, enabled]);

  return gestureRef.current;
};
