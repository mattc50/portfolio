import { useEffect, useRef, useState, useCallback } from "react";
import type PartySocket from "partysocket";
import { getOrCreateIdentity } from "@/lib/identity";

export interface RemoteCursor {
  id: string;
  x: number;
  y: number;
  displayX: number;
  displayY: number;
  color: string;
  name: string;
}

const LERP_FACTOR = 0.25;
const THROTTLE_MS = 8;

export function useMultiplayerCursors(
  socket: PartySocket | null,
  containerRef?: React.RefObject<HTMLDivElement>,
  transformRef?: React.RefObject<{ x: number; y: number; scale: number }> // 👈 add
) {
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const identity = useRef(getOrCreateIdentity());
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafHandle = useRef<number>();

  const isTouchOnly = useRef(false);
  useEffect(() => {
    isTouchOnly.current =
      window.matchMedia("(hover: none)").matches ||
      navigator.maxTouchPoints > 0;
  }, []);

  // ── Message handling ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // Cursor-specific messages handled here
      if (data.type === "init") {
        setCursors(
          Object.fromEntries(
            Object.entries(data.cursors ?? {}).map(([id, c]: [string, any]) => [
              id,
              { ...c, displayX: c.x, displayY: c.y },
            ])
          )
        );
      } else if (data.type === "move") {
        console.log("cursor move received", data);
        setCursors((prev) => ({
          ...prev,
          [data.id]: {
            ...data,
            displayX: prev[data.id]?.displayX ?? data.x,
            displayY: prev[data.id]?.displayY ?? data.y,
          },
        }));
      } else if (data.type === "leave") {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[data.id];
          return next;
        });
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  // ── RAF lerp loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      setCursors((prev) => {
        let changed = false;
        const next: Record<string, RemoteCursor> = {};

        for (const [id, cursor] of Object.entries(prev)) {
          const dx = cursor.x - cursor.displayX;
          const dy = cursor.y - cursor.displayY;

          if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
            next[id] = cursor;
            continue;
          }

          next[id] = {
            ...cursor,
            displayX: cursor.displayX + dx * LERP_FACTOR,
            displayY: cursor.displayY + dy * LERP_FACTOR,
          };
          changed = true;
        }

        return changed ? next : prev;
      });

      rafHandle.current = requestAnimationFrame(tick);
    }

    rafHandle.current = requestAnimationFrame(tick);
    return () => {
      if (rafHandle.current !== undefined)
        cancelAnimationFrame(rafHandle.current);
    };
  }, []);

  // ── Mouse tracking ────────────────────────────────────────────────────────
  const sendLeave = useCallback(() => {
    socket?.send(JSON.stringify({ type: "leave" }));
  }, [socket]);

  // const sendLeaveRef = useRef(sendLeave);
  // sendLeaveRef.current = sendLeave;

  useEffect(() => {
    if (isTouchOnly.current || !socket) return;
    console.log("registering mousemove listener");

    // const handleMouseMove = (e: MouseEvent) => {
    //   clearTimeout(throttleTimer.current);
    //   throttleTimer.current = setTimeout(() => {
    //     socket.send(
    //       JSON.stringify({
    //         type: "move",
    //         x: e.clientX / window.innerWidth,
    //         y: e.clientY / window.innerHeight,
    //         color: identity.current.color,
    //         name: identity.current.name,
    //         id: identity.current.id,
    //       })
    //     );
    //   }, THROTTLE_MS);
    // };

    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        const container = containerRef?.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const t = transformRef?.current ?? { x: 0, y: 0, scale: 1 };

        // Convert screen position → canvas-space
        const x = (e.clientX - rect.left - t.x) / t.scale;
        const y = (e.clientY - rect.top - t.y) / t.scale;

        socket?.send(
          JSON.stringify({
            type: "move",
            x,
            y,
            color: identity.current.color,
            name: identity.current.name,
            id: identity.current.id,
          })
        );
      }, THROTTLE_MS);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        const container = containerRef?.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left - (transformRef?.current?.x ?? 0)) / (transformRef?.current?.scale ?? 1);
        const y = (touch.clientY - rect.top - (transformRef?.current?.y ?? 0)) / (transformRef?.current?.scale ?? 1);

        socket?.send(
          JSON.stringify({
            type: "move",
            x,
            y,
            color: identity.current.color,
            name: identity.current.name,
            id: identity.current.id,
          })
        );
      }, THROTTLE_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) sendLeave();
      // if (document.hidden) sendLeaveRef.current();
    };

    const handleBeforeUnload = () => sendLeave();
    // const handleBeforeUnload = () => sendLeaveRef.current();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(throttleTimer.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // sendLeave();
      // sendLeaveRef.current();
    };
  }, [socket, sendLeave]);

  const sendCursorPosition = useCallback((x: number, y: number) => {
    socket?.send(
      JSON.stringify({
        type: "move",
        x,
        y,
        color: identity.current.color,
        name: identity.current.name,
        id: identity.current.id,
      })
    );
  }, [socket]);

  return { cursors, sendCursorPosition }; // 👈 export it
}