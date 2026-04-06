import type { CanvasElement } from "@/hooks/useCanvasElements";
import type { RemoteCursor } from "@/hooks/useMultiplayerCursors";
import { useRef } from "react";

interface Props {
  element: CanvasElement;
  myId: string;
  cursors: Record<string, RemoteCursor>;
  onPointerDown: (e: React.PointerEvent, el: CanvasElement) => void;
  onPointerMove: (e: React.PointerEvent, el: CanvasElement) => void;
  onPointerUp: (e: React.PointerEvent, el: CanvasElement) => void;
}

export function DraggableRect({
  element,
  myId,
  cursors,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  const isLockedByMe = element.lockedBy === myId;
  const isLockedByOther = element.lockedBy && element.lockedBy !== myId;
  const lockingCursor = element.lockedBy ? cursors[element.lockedBy] : null;
  const lockColor = lockingCursor?.color ?? "#888";

  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (element.lockedBy && element.lockedBy !== myId) return;
    isDragging.current = true;
    onPointerDown(e, element);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    onPointerMove(e, element);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    onPointerUp(e, element);
  };

  return (
    <div
      // onPointerDown={(e) => onPointerDown(e, element)}
      // onPointerMove={(e) => onPointerMove(e, element)}
      // onPointerUp={(e) => onPointerUp(e, element)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
      {/* Lock indicator */}
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
    </div>
  );
}