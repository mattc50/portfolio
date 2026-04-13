import type { CanvasElement } from "@/hooks/useCanvasElements";
import type { RemoteCursor } from "@/hooks/useMultiplayerCursors";
import { useRef, useState } from "react";
import GuestbookCount from "./GuestbookCount";
import { createPortal } from "react-dom";

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

  const [isDraggingState, setIsDraggingState] = useState(false);

  // Keep latest callbacks + element in refs so overlay handlers don't go stale
  const onPointerMoveRef = useRef(onPointerMove);
  const onPointerUpRef = useRef(onPointerUp);
  const elementRef = useRef(element);
  onPointerMoveRef.current = onPointerMove;
  onPointerUpRef.current = onPointerUp;
  elementRef.current = element;

  // useEffect and window listeners removed — overlay handles everything

  const handlePointerDown = (e: React.PointerEvent) => {
    if (element.lockedBy && element.lockedBy !== myId) return;
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDraggingState(true);
    onPointerDown(e, element);
  };

  return (
    <>
      {/* Fullscreen overlay during drag — captures all pointer events,
          bypassing Chrome's post-pointerdown suppression */}
      {/* {isDraggingState && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            cursor: "grabbing",
          }}
          onPointerMove={(e) => {
            onPointerMoveRef.current(e, elementRef.current);
          }}
          onPointerUp={(e) => {
            setIsDraggingState(false);
            onPointerUpRef.current(e, elementRef.current);
          }}
        />
      )} */}

      <div
        data-draggable="true"
        onPointerDown={handlePointerDown}
        onTouchStart={(e) => {
          if (element.lockedBy && element.lockedBy !== myId) return;
          e.stopPropagation();
        }}
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
          onPointerDown={(e) => e.stopPropagation()}
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
    </>
  );
}