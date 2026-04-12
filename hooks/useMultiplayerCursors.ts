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

const LERP_FACTOR = 0.18;
const THROTTLE_MS = 6;

export function useMultiplayerCursors(
  socket: PartySocket | null,
  containerRef?: React.RefObject<HTMLDivElement>,
  transformRef?: React.RefObject<{ x: number; y: number; scale: number }>
) {
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const identity = useRef(getOrCreateIdentity());
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafHandle = useRef<number>();
  const isUnmounting = useRef(false);

  useEffect(() => {
    return () => {
      isUnmounting.current = true;
    };
  }, []);

  // ── Message handling ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

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

  // ── Mouse/touch tracking ──────────────────────────────────────────────────
  const sendLeave = useCallback(() => {
    socket?.send(JSON.stringify({ type: "leave" }));
  }, [socket]);

  const sendLeaveRef = useRef(sendLeave);
  sendLeaveRef.current = sendLeave;

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (e: MouseEvent) => {
      console.log("mousemove fired", { isTrusted: e.isTrusted });
      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        const container = containerRef?.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const t = transformRef?.current ?? { x: 0, y: 0, scale: 1 };

        const x = (e.clientX - rect.left - t.x) / t.scale;
        const y = (e.clientY - rect.top - t.y) / t.scale;

        console.log("sending move", { x, y, socketReady: socket?.readyState });

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
        const t = transformRef?.current ?? { x: 0, y: 0, scale: 1 };

        const x = (touch.clientX - rect.left - t.x) / t.scale;
        const y = (touch.clientY - rect.top - t.y) / t.scale;

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
      if (document.hidden) sendLeaveRef.current();
    };

    const handleBeforeUnload = () => sendLeaveRef.current();

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
      if (isUnmounting.current) sendLeaveRef.current(); // 👈 only on unmount
    };
  }, [socket]);

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

  return { cursors, sendCursorPosition };
}