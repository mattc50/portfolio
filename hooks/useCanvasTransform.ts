// useCanvasTransform.ts
import { useState, useCallback, useRef, useEffect } from "react";

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

/**
 * Prevents the browser from panning, zooming, or scrolling when
 * performing such actions within the multiplayer canvas.
 * @param containerRef 
 */
function usePreventBrowserZoom(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault(); // block all — pan, zoom, and page scroll
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [containerRef]);
}

export function useCanvasTransform(containerRef: React.RefObject<HTMLElement>) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const transformRef = useRef(transform); // always-current ref for event handlers
  transformRef.current = transform;

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  // Convert a client-space point to canvas-space
  const clientToCanvas = useCallback((clientX: number, clientY: number, containerRect: DOMRect) => {
    const t = transformRef.current;
    return {
      x: (clientX - containerRect.left - t.x) / t.scale,
      y: (clientY - containerRect.top - t.y) / t.scale,
    };
  }, []);

  const onWheel = useCallback((e: React.WheelEvent, containerRect: DOMRect) => {
    e.preventDefault();

    const t = transformRef.current;

    if (e.ctrlKey || e.metaKey) {
      // Zoom toward cursor
      const delta = -e.deltaY * 0.01;
      const newScale = Math.min(Math.max(t.scale * (1 + delta), 0.1), 10);
      const originX = e.clientX - containerRect.left;
      const originY = e.clientY - containerRect.top;

      setTransform({
        scale: newScale,
        x: originX - (originX - t.x) * (newScale / t.scale),
        y: originY - (originY - t.y) * (newScale / t.scale),
      });
    } else {
      // Pan (shift+wheel = horizontal)
      setTransform((prev) => ({
        ...prev,
        x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        y: prev.y - (e.shiftKey ? 0 : e.deltaY),
      }));
    }
  }, []);

  // Space+drag or middle-click pan
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const isMiddleClick = e.button === 1;
    const isSpacePan = (e.target as HTMLElement).dataset.panHandle === "true";
    if (!isMiddleClick && !isSpacePan) return;

    e.preventDefault();
    isPanning.current = true;
    panStart.current = {
      x: e.clientX - transformRef.current.x,
      y: e.clientY - transformRef.current.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    }));
  }, []);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const reset = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  usePreventBrowserZoom(containerRef);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // inline the wheel logic here instead of in JSX
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.01;
        const newScale = Math.min(Math.max(transformRef.current.scale * (1 + delta), 0.1), 10);
        const originX = e.clientX - rect.left;
        const originY = e.clientY - rect.top;
        setTransform((prev) => ({
          scale: newScale,
          x: originX - (originX - prev.x) * (newScale / prev.scale),
          y: originY - (originY - prev.y) * (newScale / prev.scale),
        }));
      } else {
        setTransform((prev) => ({
          ...prev,
          x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
          y: prev.y - (e.shiftKey ? 0 : e.deltaY),
        }));
      }
    };

    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [containerRef]);

  return {
    transform,
    transformRef,
    clientToCanvas,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
    setTransform
  };
}