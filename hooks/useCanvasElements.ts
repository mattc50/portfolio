import { useState, useCallback, useRef, useEffect } from "react";
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
  transformRef?: React.RefObject<Transform>,
  onCursorMove?: (x: number, y: number) => void
) {
  const [elements, setElements] = useState<Record<string, CanvasElement>>({});
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();
  const isDraggingId = useRef<string | null>(null); // 👈 track which element we're dragging

  useEffect(() => {
    if (!socket) return;
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "init") {
        setElements(data.elements ?? {});
      }
      if (data.type === "rect:locked") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], lockedBy: data.lockedBy },
        }));
      }
      if (data.type === "rect:update") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], x: data.x, y: data.y },
        }));
      }
      if (data.type === "rect:released") {
        setElements((prev) => ({
          ...prev,
          [data.id]: { ...prev[data.id], lockedBy: null },
        }));
      }
    };
    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket]);

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

      const pointerX = (originX - tx) / scale;
      const pointerY = (originY - ty) / scale;
      onCursorMove?.(pointerX, pointerY);
      // onCursorMove?.(element.x, element.y);
      // console.log("onCursorMove called with", element.x, element.y);

      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], lockedBy: myId },
      }));
      socket?.send(JSON.stringify({ type: "rect:drag-start", id: element.id }));
    },
    [socket, myId, containerRef, transformRef, onCursorMove]
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

      const pointerX = (originX - tx) / scale;
      const pointerY = (originY - ty) / scale;

      const x = Math.min(
        CANVAS_WIDTH - element.width,   // 👈 can't go past right edge
        Math.max(0, pointerX - dragOffset.current.x)
      );
      const y = Math.min(
        CANVAS_HEIGHT - element.height, // 👈 can't go past bottom edge
        Math.max(0, pointerY / scale - dragOffset.current.y)
      );

      onCursorMove?.(pointerX, pointerY);
      // onCursorMove?.(x, y);

      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], x, y },
      }));

      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        socket?.send(JSON.stringify({ type: "rect:move", id: element.id, x, y }));
      }, 16);
    },
    [socket, containerRef, transformRef, onCursorMove]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      isDraggingId.current = null; // 👈 clear on release
      socket?.send(JSON.stringify({ type: "rect:drag-end", id: element.id }));

      // if (e.pointerType === "touch") {
      //   socket?.send(JSON.stringify({ type: "leave" }));
      // }
    },
    [socket]
  );

  return { elements, onPointerDown, onPointerMove, onPointerUp };
}