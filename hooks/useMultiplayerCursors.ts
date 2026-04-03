import { useEffect, useRef, useState, useCallback } from "react";
import { getOrCreateIdentity } from "@/lib/identity";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RemoteCursor {
  id: string;
  /** Normalized 0–1 position (screen-size independent) */
  x: number;
  y: number;
  /** Smoothed display position, updated each RAF tick */
  displayX: number;
  displayY: number;
  color: string;
  name: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Lerp factor per frame at 60fps. Lower = smoother but laggier. */
const LERP_FACTOR = 0.25;

/** Throttle interval in ms (~30fps). */
const THROTTLE_MS = 8;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMultiplayerCursors() {
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const identity = useRef(getOrCreateIdentity());
  const throttleTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafHandle = useRef<number>();
  const socketRef = useRef<WebSocket | null>(null);

  // ── Detect touch-only devices (no hover support) ──────────────────────────
  const isTouchOnly = useRef(false);
  useEffect(() => {
    isTouchOnly.current =
      window.matchMedia("(hover: none)").matches ||
      navigator.maxTouchPoints > 0;
  }, []);

  // ── send: accepts a plain object, serializes once ─────────────────────────
  const send = useCallback((msg: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN)
      socketRef.current.send(JSON.stringify(msg));
  }, []);

  // ── WebSocket connection ───────────────────────────────────────────────────
  useEffect(() => {
    const room = window.location.pathname.replace(/\/$/, "") || "/";
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?room=${encodeURIComponent(room)}`
    );
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        setCursors(
          Object.fromEntries(
            Object.entries(data.cursors).map(([id, c]: [string, any]) => [
              id,
              { ...c, displayX: c.x, displayY: c.y },
            ])
          )
        );
      }
      if (data.type === "move") {
        setCursors((prev) => ({
          ...prev,
          [data.id]: {
            ...data,
            displayX: prev[data.id]?.displayX ?? data.x,
            displayY: prev[data.id]?.displayY ?? data.y,
          },
        }));
      }
      if (data.type === "leave") {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[data.id];
          return next;
        });
      }
    };

    return () => ws.close();
  }, []);

  // ── RAF-based lerp loop ───────────────────────────────────────────────────
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

  // ── Mouse tracking + throttled emit ──────────────────────────────────────
  const sendLeave = useCallback(() => {
    send({ type: "leave" }); // ← plain object, send() handles stringify
  }, [send]);

  useEffect(() => {
    if (isTouchOnly.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        send({ // ← plain object, send() handles stringify
          type: "move",
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          color: identity.current.color,
          name: identity.current.name,
          id: identity.current.id,
        });
      }, THROTTLE_MS);
    };

    const handleBeforeUnload = () => sendLeave();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(throttleTimer.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendLeave();
    };
  }, [send, sendLeave]); // ← removed stale `socket` reference

  return cursors;
}