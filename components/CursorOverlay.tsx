"use client";

import { useMultiplayerCursors } from "@/hooks/useMultiplayerCursors";

export function CursorOverlay() {
  const cursors = useMultiplayerCursors();
  const entries = Object.values(cursors);

  if (entries.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {entries.map((cursor) => (
        <div
          key={cursor.id}
          style={{
            position: "absolute",
            left: `${cursor.displayX * 100}%`,
            top: `${cursor.displayY * 100}%`,
            willChange: "left, top",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            style={{
              display: "block",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
            }}
          >
            <path
              d="M2 2L16 8L9.5 10L7 16Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 12,
              background: cursor.color,
              color: "white",
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1,
              padding: "3px 7px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              userSelect: "none",
            }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}