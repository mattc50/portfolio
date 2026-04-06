import { useState, useCallback, useRef } from "react";
import type PartySocket from "partysocket";

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
  containerRef?: React.RefObject<HTMLDivElement>
) {
  const [elements, setElements] = useState<Record<string, CanvasElement>>({});
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();

  // Called by MultiplayerCanvas when a message comes in
  const handleMessage = useCallback(
    (data: Record<string, any>) => {
      // console.log("handleMessage received", data);

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
      e.currentTarget.setPointerCapture(e.pointerId);

      dragOffset.current = {
        x: e.clientX - element.x,
        y: e.clientY - element.y,
      };

      // Optimistically lock locally
      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], lockedBy: myId },
      }));

      socket?.send(
        JSON.stringify({ type: "rect:drag-start", id: element.id })
      );
    },
    [socket, myId]
  );

  // const onPointerMove = useCallback(
  //   (e: React.PointerEvent, element: CanvasElement) => {
  //     if (element.lockedBy !== myId) return;

  //     const x = e.clientX - dragOffset.current.x;
  //     const y = e.clientY - dragOffset.current.y;

  //     // Optimistic local update
  //     setElements((prev) => ({
  //       ...prev,
  //       [element.id]: { ...prev[element.id], x, y },
  //     }));

  //     // Throttled broadcast
  //     clearTimeout(throttleTimer.current);
  //     throttleTimer.current = setTimeout(() => {
  //       socket?.send(
  //         JSON.stringify({ type: "rect:move", id: element.id, x, y })
  //       );
  //     }, 16);
  //   },
  //   [socket, myId]
  // );

  const onPointerMove = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      // const x = e.clientX - dragOffset.current.x;
      // const y = e.clientY - dragOffset.current.y;
      let x = e.clientX - dragOffset.current.x;
      let y = e.clientY - dragOffset.current.y;

      // Clamp to canvas bounds
      if (containerRef?.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        x = Math.max(0, Math.min(x, width - element.width));
        y = Math.max(0, Math.min(y, height - element.height));
      }

      setElements((prev) => ({
        ...prev,
        [element.id]: { ...prev[element.id], x, y },
      }));

      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        socket?.send(
          JSON.stringify({ type: "rect:move", id: element.id, x, y })
        );
      }, 16);
    },
    [socket]
  );

  // const onPointerUp = useCallback(
  //   (e: React.PointerEvent, element: CanvasElement) => {
  //     if (element.lockedBy !== myId) return;
  //     socket?.send(
  //       JSON.stringify({ type: "rect:drag-end", id: element.id })
  //     );
  //   },
  //   [socket, myId]
  // );

  const onPointerUp = useCallback(
    (e: React.PointerEvent, element: CanvasElement) => {
      socket?.send(
        JSON.stringify({ type: "rect:drag-end", id: element.id })
      );
    },
    [socket]
  );

  // const resetElement = useCallback(
  //   (id: string, x: number, y: number) => {
  //     setElements((prev) => ({
  //       ...prev,
  //       [id]: { ...prev[id], x, y },
  //     }));
  //     socket?.send(JSON.stringify({ type: "rect:reset", id, x, y }));
  //   },
  //   [socket]
  // );

  const resetElement = useCallback(
    (id: string, x: number, y: number) => {
      const el = elements[id]; // need elements in scope — add to deps
      let clampedX = x;
      let clampedY = y;

      if (containerRef?.current && el) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        clampedX = Math.max(0, Math.min(x, width - el.width));
        clampedY = Math.max(0, Math.min(y, height - el.height));
      }

      setElements((prev) => ({
        ...prev,
        [id]: { ...prev[id], x: clampedX, y: clampedY },
      }));

      socket?.send(JSON.stringify({ type: "rect:reset", id, x: clampedX, y: clampedY }));
    },
    [socket, containerRef, elements]
  );

  return { elements, handleMessage, onPointerDown, onPointerMove, onPointerUp, resetElement };
}