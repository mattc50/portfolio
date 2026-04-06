import { useState, useCallback, useRef } from "react";
import type PartySocket from "partysocket";
import type { Transform } from "./useCanvasTransform"; // 👈 import Transform
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/canvasConstants";

export interface CanvasElement {
  id: string;
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  lockedBy: string | null;
}

export function useCanvasElements(
  socket: PartySocket | null,
  myId: string,
  containerRef?: React.RefObject<HTMLDivElement>,
  transformRef?: React.RefObject<Transform>
) {
  const [elements, setElements] = useState<Record<string, CanvasElement>>({});
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();
  const isDraggingId = useRef<string | null>(null); // 👈 track which element we're dragging

  const handleMessage = useCallback(
    (data: Record<string, any>) => {
      if (data.type === "init") {
        setElements(data.elements ?? {});
        return;
      }
      if (data.type === "rect:locked") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], lockedBy: data.lockedBy },
        }));
        return;
      }
      if (data.type === "rect:update") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], x: data.x, y: data.y },
        }));
        return;
      }
      if (data.type === "rect:released") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], lockedBy: null },
        }));
        return;
      }
    },
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      if (element.lockedBy && element.lockedBy !== myId) return;
      e.stopPropagation();

      const scale = transformRef?.current?.scale ?? 1;
      const tx = transformRef?.current?.x ?? 0;
      const ty = transformRef?.current?.y ?? 0;
      const rect = containerRef?.current?.getBoundingClientRect();
      const originX = rect ? e.clientX - rect.left : e.clientX;
      const originY = rect ? e.clientY - rect.top : e.clientY;

      dragOffset.current = {
        x: (originX - tx) / scale - element.x,
        y: (originY - ty) / scale - element.y,
      };

      isDraggingId.current = element.id; // 👈 set dragging id

      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], lockedBy: myId },
      }));
      socket?.send(JSON.stringify({ type: "rect:drag-start", id: element.id }));
    },
    [socket, myId, containerRef, transformRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      if (isDraggingId.current !== element.id) return; // 👈 check ref, not lockedBy

      const scale = transformRef?.current?.scale ?? 1;
      const tx = transformRef?.current?.x ?? 0;
      const ty = transformRef?.current?.y ?? 0;
      const rect = containerRef?.current?.getBoundingClientRect();
      const originX = rect ? e.clientX - rect.left : e.clientX;
      const originY = rect ? e.clientY - rect.top : e.clientY;

      // let x = (originX - tx) / scale - dragOffset.current.x;
      // let y = (originY - ty) / scale - dragOffset.current.y;

      // x = Math.max(0, x);
      // y = Math.max(0, y);

      const x = Math.min(
        CANVAS_WIDTH - element.width,   // 👈 can't go past right edge
        Math.max(0, (originX - tx) / scale - dragOffset.current.x)
      );
      const y = Math.min(
        CANVAS_HEIGHT - element.height, // 👈 can't go past bottom edge
        Math.max(0, (originY - ty) / scale - dragOffset.current.y)
      );

      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], x, y },
      }));

      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        socket?.send(JSON.stringify({ type: "rect:move", id: element.id, x, y }));
      }, 16);
    },
    [socket, containerRef, transformRef]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      isDraggingId.current = null; // 👈 clear on release
      socket?.send(JSON.stringify({ type: "rect:drag-end", id: element.id }));
    },
    [socket]
  );

  return { elements, handleMessage, onPointerDown, onPointerMove, onPointerUp };
}