"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateIdentity } from "@/lib/identity";
import { useMultiplayerCursors } from "@/hooks/useMultiplayerCursors";
import { useCanvasElements } from "@/hooks/useCanvasElements";
import { CursorOverlay } from "@/components/CursorOverlay";
import { DraggableRect } from "@/components/DraggableRect";

export function MultiplayerCanvas() {
  const [room, setRoom] = useState("root");
  // const [room] = useState(() =>
  //   typeof window !== "undefined"
  //     ? window.location.pathname.replace(/\/$/, "").replace(/^\//, "") || "root"
  //     : "root"
  // );
  const identity = useRef(getOrCreateIdentity());

  // const socket = usePartySocket({
  //   host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
  //   room:
  //     typeof window !== "undefined"
  //       ? window.location.pathname.replace(/\/$/, "") || "root"
  //       : "root",
  // });

  // const socket = usePartySocket({
  //   host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
  //   room,
  // });

  // const { elements, handleMessage, onPointerDown, onPointerMove, onPointerUp } =
  //   useCanvasElements(null, identity.current.id);

  // const cursors = useMultiplayerCursors(null, handleMessage);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    room,
    onMessage(event) {
      const data = JSON.parse(event.data);
      // console.log("message received", data);
      handleMessage(data);
    },
  });

  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { elements, handleMessage, onPointerDown, onPointerMove, onPointerUp, resetElement } =
    // useCanvasElements(null, identity.current.id);
    useCanvasElements(socket, identity.current.id, canvasRef);

  // const cursors = useMultiplayerCursors(socket, handleMessage);
  const cursors = useMultiplayerCursors(socket, handleMessage, canvasRef);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { height } = canvas.getBoundingClientRect();
    const el = elements["rect-1"];
    if (!el) return;
    resetElement("rect-1", 20, height - el.height - 20);
  };

  const handleBringIntoView = () => {
    const el = elements["rect-1"];
    if (!el || !scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTo({
      left: el.x,
      top: el.y,
      behavior: "smooth",
    });
  };

  const isOutOfView = useMemo(() => {
    const el = elements["rect-1"];
    const container = scrollContainerRef.current;
    if (!el || !container) return false;

    const { clientWidth, clientHeight } = container;

    const rectRight = el.x + el.width;
    const rectBottom = el.y + el.height;

    const visibleLeft = scrollPos.left;
    const visibleTop = scrollPos.top;
    const visibleRight = scrollPos.left + clientWidth;
    const visibleBottom = scrollPos.top + clientHeight;

    return (
      rectRight < visibleLeft ||
      el.x > visibleRight ||
      rectBottom < visibleTop ||
      el.y > visibleBottom
    );
  }, [elements, scrollPos]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPos({ left: container.scrollLeft, top: container.scrollTop });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setRoom(
      window.location.pathname.replace(/\/$/, "").replace(/^\//, "") || "root"
    );
  }, []);

  return (
    <div style={{ position: "relative", backgroundColor: "var(--canvas)" }}>
      {isOutOfView && (
        <button
          onClick={handleBringIntoView}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 100,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 500,
            background: "rgba(0, 0, 0, 0.03)",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Bring into view
        </button>
      )}
      <div
        ref={scrollContainerRef}
        style={{
          overflow: "scroll",
          aspectRatio: "16 / 10",
          position: "relative",
        }}
      >
        <div
          ref={canvasRef}
          style={{
            backgroundColor: "var(--canvas)",
            position: "relative",
            width: "500px",
            height: "500px",
            overflow: "visible",
            margin: "8px",
          }}
        >
          {/* <button
          onClick={handleReset}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 100,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 500,
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reset position
        </button> */}
          {/* Canvas layer — elements live here */}
          <div style={{ position: "absolute", inset: 0 }}>
            {Object.values(elements).map((el) =>
              el.type === "rect" ? (
                <DraggableRect
                  key={el.id}
                  element={el}
                  myId={identity.current.id}
                  cursors={cursors}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                />
              ) : null
            )}
          </div>

          {/* Cursor overlay sits above everything */}
          <CursorOverlay cursors={cursors} />
        </div>
      </div>
    </div>
  );
}