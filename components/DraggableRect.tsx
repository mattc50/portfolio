import type { CanvasElement } from "@/hooks/useCanvasElements";
import type { RemoteCursor } from "@/hooks/useMultiplayerCursors";
import { useEffect, useRef } from "react";
import GuestbookCount from "./GuestbookCount";

interface Props {
  element: CanvasElement;
  myId: string;
  cursors: Record<string, RemoteCursor>;
  onPointerDown: (e: React.PointerEvent, el: CanvasElement) => void;
  onPointerMove: (e: React.PointerEvent, el: CanvasElement) => void;
  onPointerUp: (e: React.PointerEvent, el: CanvasElement) => void;
  onRectClick?: () => void;
}

export function DraggableRect({
  element,
  myId,
  cursors,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onRectClick,
}: Props) {
  const isLockedByMe = element.lockedBy === myId;
  const isLockedByOther = element.lockedBy && element.lockedBy !== myId;
  const lockingCursor = element.lockedBy ? cursors[element.lockedBy] : null;
  const lockColor = lockingCursor?.color ?? "#888";

  const isDragging = useRef(false);
  // Keep latest callbacks + element in refs so window listeners don't go stale
  const onPointerMoveRef = useRef(onPointerMove);
  const onPointerUpRef = useRef(onPointerUp);
  const elementRef = useRef(element);
  onPointerMoveRef.current = onPointerMove;
  onPointerUpRef.current = onPointerUp;
  elementRef.current = element;

  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      // console.log("window pointermove", { isDragging: isDragging.current });
      if (!isDragging.current) return;
      // Cast to React.PointerEvent shape — the fields we use are identical
      onPointerMoveRef.current(e as unknown as React.PointerEvent, elementRef.current);
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      onPointerUpRef.current(e as unknown as React.PointerEvent, elementRef.current);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, []); // empty — refs keep everything current

  const handlePointerDown = (e: React.PointerEvent) => {
    // console.log("pointerdown on rect", { lockedBy: element.lockedBy, myId });
    if (element.lockedBy && element.lockedBy !== myId) return;
    e.stopPropagation(); // prevent canvas pan from triggering
    isDragging.current = true;
    // console.log("isDragging set to true");
    onPointerDown(e, element);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        border: isLockedByOther
          ? `2px solid ${lockColor}`
          : isLockedByMe
            ? "2px solid rgba(255,255,255,0.6)"
            : "1px solid rgba(255,255,255,0.2)",
        borderRadius: 6,
        cursor: isLockedByOther ? "not-allowed" : isLockedByMe ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        backdropFilter: "blur(4px)",
        transition: isLockedByMe ? "none" : "border 0.15s ease",
        boxShadow: isLockedByMe
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {isLockedByOther && lockingCursor && (
        <div
          style={{
            position: "absolute",
            top: -24,
            left: 0,
            background: lockColor,
            color: "white",
            fontSize: 10,
            fontWeight: 500,
            padding: "2px 6px",
            borderRadius: 3,
            whiteSpace: "nowrap",
          }}
        >
          {lockingCursor.name}
        </div>
      )}
      <button
        onPointerDown={(e) => e.stopPropagation()} // prevent triggering drag
        onClick={onRectClick}
        style={{
          width: "max-content",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 500,
          background: "rgba(0, 0, 0, 0.03)",
          color: "var(--ink)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        <p>Sign the guestbook!</p>
        <GuestbookCount />
      </button>
    </div>
  );
}