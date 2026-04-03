import { useEffect, useRef, useState, useCallback } from "react";
import usePartySocket from "partysocket/react";
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

// const LERP_FACTOR = 0.18;
const LERP_FACTOR = 0.25;
// const THROTTLE_MS = 33;
const THROTTLE_MS = 8;

export function useMultiplayerCursors() {
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

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    room: typeof window !== "undefined"
      ? window.location.pathname.replace(/\/$/, "") || "root"
      : "root",
    onMessage(event) {
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
        return;
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
        return;
      }

      if (data.type === "leave") {
        setCursors((prev) => {
          const next = { ...prev };
          delete next[data.id];
          return next;
        });
      }
    },
  });

  // RAF lerp loop
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

  const sendLeave = useCallback(() => {
    socket.send(JSON.stringify({ type: "leave" }));
  }, [socket]);

  useEffect(() => {
    if (isTouchOnly.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(throttleTimer.current);
      throttleTimer.current = setTimeout(() => {
        socket.send(JSON.stringify({
          type: "move",
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          color: identity.current.color,
          name: identity.current.name,
          id: identity.current.id,
        }));
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
  }, [socket, sendLeave]);

  return cursors;
}