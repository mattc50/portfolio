// useCanvasTransform.ts
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvasConstants";
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

function clampTransform(x: number, y: number, scale: number, containerWidth: number, containerHeight: number) {
  // The canvas in screen-space spans from (x, y) to (x + CANVAS_WIDTH * scale, y + CANVAS_HEIGHT * scale)
  // We want to prevent panning so the canvas always fills the container
  const minX = containerWidth - CANVAS_WIDTH * scale;
  const minY = containerHeight - CANVAS_HEIGHT * scale;

  return {
    x: Math.min(0, Math.max(x, minX)),
    y: Math.min(0, Math.max(y, minY)),
    scale,
  };
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
    // setTransform((prev) => ({
    //   ...prev,
    //   x: e.clientX - panStart.current.x,
    //   y: e.clientY - panStart.current.y,
    // }));

    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    setTransform((prev) => {
      const x = e.clientX - panStart.current.x;
      const y = e.clientY - panStart.current.y;
      return clampTransform(x, y, prev.scale, width, height);
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isPanning.current = false;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) { }
  }, []);

  const reset = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  usePreventBrowserZoom(containerRef);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const { width, height } = rect;

      // inline the wheel logic here instead of in JSX
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.01;
        const newScale = Math.min(Math.max(transformRef.current.scale * (1 + delta), 0.1), 10);
        const originX = e.clientX - rect.left;
        const originY = e.clientY - rect.top;
        // setTransform((prev) => ({
        //   scale: newScale,
        //   x: originX - (originX - prev.x) * (newScale / prev.scale),
        //   y: originY - (originY - prev.y) * (newScale / prev.scale),
        // }));
        setTransform((prev) => {
          const x = originX - (originX - prev.x) * (newScale / prev.scale);
          const y = originY - (originY - prev.y) * (newScale / prev.scale);
          return clampTransform(x, y, newScale, width, height);
        });
      } else {
        // setTransform((prev) => ({
        //   ...prev,
        //   x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        //   y: prev.y - (e.shiftKey ? 0 : e.deltaY),
        // }));
        setTransform((prev) => {
          const x = prev.x - (e.shiftKey ? e.deltaY : e.deltaX);
          const y = prev.y - (e.shiftKey ? 0 : e.deltaY);
          return clampTransform(x, y, prev.scale, width, height);
        });
      }
    };

    let lastTouchDist = 0;
    let lastMidpoint = { x: 0, y: 0 };
    let lastSingleTouch = { x: 0, y: 0 };
    let isTouchPanning = false; // 👈 add alongside other let variables

    const getTouchDist = (a: Touch, b: Touch) =>
      Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);

    const getMidpoint = (a: Touch, b: Touch, rect: DOMRect) => ({
      x: (a.clientX + b.clientX) / 2 - rect.left,
      y: (a.clientY + b.clientY) / 2 - rect.top,
    });

    const handleTouchStart = (e: TouchEvent) => {
      // Don't pan if the touch started on a draggable element
      if ((e.target as HTMLElement).closest('[data-draggable]')) {
        isTouchPanning = false; // 👈 touch started on rect, don't pan
        return;
      }

      isTouchPanning = true; // 👈 touch started on canvas, pan

      if (e.touches.length === 2) {
        lastTouchDist = getTouchDist(e.touches[0], e.touches[1]);
        const rect = el.getBoundingClientRect();
        lastMidpoint = getMidpoint(e.touches[0], e.touches[1], rect);
      } else if (e.touches.length === 1) {
        lastSingleTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPanning && e.touches.length !== 2) return; // 👈 block single-finger pan if on rect
      e.preventDefault(); // 👈 moved up, applies to both cases

      const rect = el.getBoundingClientRect();

      if (e.touches.length === 2) {
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const midpoint = getMidpoint(e.touches[0], e.touches[1], rect);
        const scaleDelta = dist / lastTouchDist;
        lastTouchDist = dist;

        setTransform((prev) => {
          const newScale = Math.min(Math.max(prev.scale * scaleDelta, 0.1), 10);
          const zoomedX = midpoint.x - (midpoint.x - prev.x) * (newScale / prev.scale);
          const zoomedY = midpoint.y - (midpoint.y - prev.y) * (newScale / prev.scale);
          const dx = midpoint.x - lastMidpoint.x;
          const dy = midpoint.y - lastMidpoint.y;
          lastMidpoint = midpoint;
          return clampTransform(zoomedX + dx, zoomedY + dy, newScale, rect.width, rect.height);
        });
      } else if (e.touches.length === 1) {
        if (!isPanning) return; // 👈 extra guard
        const touch = e.touches[0];
        const dx = touch.clientX - lastSingleTouch.x;
        const dy = touch.clientY - lastSingleTouch.y;
        lastSingleTouch = { x: touch.clientX, y: touch.clientY };

        setTransform((prev) =>
          clampTransform(prev.x + dx, prev.y + dy, prev.scale, rect.width, rect.height)
        );
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (!isPanning.current) return;
      isPanning.current = false;
      try {
        (containerRef.current as HTMLElement)?.releasePointerCapture(e.pointerId);
      } catch (_) { }
    };

    el.addEventListener("wheel", handler, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false }); // non-passive to preventDefault
    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      el.removeEventListener("wheel", handler);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);

    }
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