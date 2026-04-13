"use client";

import usePartySocket from "partysocket/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getOrCreateIdentity } from "@/lib/identity";
import { useMultiplayerCursors } from "@/hooks/useMultiplayerCursors";
import { useCanvasElements } from "@/hooks/useCanvasElements";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { CursorOverlay } from "@/components/CursorOverlay";
import { DraggableRect } from "@/components/DraggableRect";

interface Props {
  onRectClick?: () => void;
}

export function MultiplayerCanvas({ onRectClick }: Props) {
  const [room, setRoom] = useState("root");
  const identity = useRef(getOrCreateIdentity());
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [spaceHeld, setSpaceHeld] = useState(false);

  const canvasTransform = useCanvasTransform(containerRef);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST!,
    room,
  });

  const { cursors, sendCursorPosition } = useMultiplayerCursors(
    socket,
    containerRef,
    canvasTransform.transformRef,
  );

  const { elements, onPointerDown, onPointerMove, onPointerUp } =
    useCanvasElements(
      socket,
      identity.current.id,
      containerRef,
      canvasTransform.transformRef,
      sendCursorPosition
    );

  // Space bar pan mode
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault(); // prevent page scroll
        setSpaceHeld(true);
      }
    };
    const up = (e: KeyboardEvent) => e.code === "Space" && setSpaceHeld(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Sync room to URL
  useEffect(() => {
    setRoom(
      window.location.pathname.replace(/\/$/, "").replace(/^\//, "") || "root"
    );
  }, []);

  // isOutOfView: check if rect-1 is outside the visible canvas area accounting for transform
  const isOutOfView = useMemo(() => {
    const el = elements["rect-1"];
    const container = containerRef.current;
    if (!el || !container) return false;

    const { x, y, scale } = canvasTransform.transform;
    const { clientWidth, clientHeight } = container;

    // Convert element bounds to screen-space
    const screenLeft = el.x * scale + x;
    const screenTop = el.y * scale + y;
    const screenRight = (el.x + el.width) * scale + x;
    const screenBottom = (el.y + el.height) * scale + y;

    return (
      screenRight < 0 ||
      screenLeft > clientWidth ||
      screenBottom < 0 ||
      screenTop > clientHeight
    );
  }, [elements, canvasTransform.transform]);

  const handleBringIntoView = () => {
    const el = elements["rect-1"];
    const container = containerRef.current;
    if (!el || !container) return;

    const { clientWidth, clientHeight } = container;
    const { scale } = canvasTransform.transform;

    // Center the element in the viewport
    canvasTransform.setTransform({
      scale,
      x: clientWidth / 2 - (el.x + el.width / 2) * scale,
      y: clientHeight / 2 - (el.y + el.height / 2) * scale,
    });
  };

  useEffect(() => {
    window.addEventListener("pointermove", (e) => {
      console.log("raw pointermove", { pointerType: e.pointerType, isTrusted: e.isTrusted });
    });
  }, [])

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
        ref={containerRef}
        style={{
          overflow: "hidden",
          aspectRatio: "16 / 10",
          position: "relative",
          backgroundColor: "var(--canvas)",
          cursor: spaceHeld ? "grab" : "default",
        }}
        // onWheel={(e) => {
        //   const rect = containerRef.current?.getBoundingClientRect();
        //   if (rect) canvasTransform.onWheel(e, rect);
        // }}
        onPointerDown={(e) => {
          if (spaceHeld || e.button === 1) {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            canvasTransform.onPointerDown(e);
          }
        }}
        onPointerMove={(e) => {
          canvasTransform.onPointerMove(e);
        }}
        onPointerUp={canvasTransform.onPointerUp}
      >
        <div
          ref={canvasRef}
          style={{
            backgroundColor: "var(--canvas)",
            position: "absolute",
            backgroundImage: "radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            width: 500,
            height: 500,
            transform: `translate(${canvasTransform.transform.x}px, ${canvasTransform.transform.y}px) scale(${canvasTransform.transform.scale})`,
            transformOrigin: "0 0",
            // touchAction: "none",
          }}
        >
          {/* Elements layer */}
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
                  onRectClick={onRectClick}
                />
              ) : null
            )}
          </div>

          {/* Cursor overlay */}
          {/* <CursorOverlay cursors={cursors} /> */}
        </div>
        {/* Cursor overlay */}
        <CursorOverlay cursors={cursors} transform={canvasTransform.transform} />
      </div>
    </div>
  );
}