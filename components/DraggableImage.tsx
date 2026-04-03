"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./DraggableImage.module.css";

type SlotId = "header" | "sidebar";

interface DraggableImageProps {
  /** The image / content to render inside the draggable element */
  children: ReactNode;
  /** Which slot it starts in */
  defaultSlot?: SlotId;
}

/**
 * Renders two drop slots (above the About heading and above Currently)
 * and a draggable element that can be moved between them.
 *
 * Usage in about/page.tsx:
 *   1. Wrap the page content in <DraggableImage>
 *   2. The slots are injected via refs — see below
 */
export function DraggableImage({
  children,
  defaultSlot = "header",
}: DraggableImageProps) {
  const [currentSlot, setCurrentSlot] = useState<SlotId>(defaultSlot);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<SlotId | null>(null);

  // Position of the dragging ghost
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Offset from pointer to element top-left when drag starts
  const dragOffset = useRef({ x: 0, y: 0 });

  // Refs to the two slot containers
  const headerSlotRef = useRef<HTMLDivElement>(null);
  const sidebarSlotRef = useRef<HTMLDivElement>(null);

  // Ref to the ghost element for measuring
  const ghostRef = useRef<HTMLDivElement>(null);

  // ── Drag start ──────────────────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();

      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setPos({ x: rect.left, y: rect.top });
      setIsDragging(true);
      el.setPointerCapture(e.pointerId);
    },
    []
  );

  // ── Drag move ───────────────────────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      setPos({ x, y });

      // Hit-test both slots
      const headerRect = headerSlotRef.current?.getBoundingClientRect();
      const sidebarRect = sidebarSlotRef.current?.getBoundingClientRect();

      const inHeader =
        headerRect &&
        e.clientX >= headerRect.left &&
        e.clientX <= headerRect.right &&
        e.clientY >= headerRect.top &&
        e.clientY <= headerRect.bottom;

      const inSidebar =
        sidebarRect &&
        e.clientX >= sidebarRect.left &&
        e.clientX <= sidebarRect.right &&
        e.clientY >= sidebarRect.top &&
        e.clientY <= sidebarRect.bottom;

      setHoveredSlot(inHeader ? "header" : inSidebar ? "sidebar" : null);
    },
    [isDragging]
  );

  // ── Drag end ────────────────────────────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (hoveredSlot) {
      setCurrentSlot(hoveredSlot);
    }
    setHoveredSlot(null);
  }, [isDragging, hoveredSlot]);

  // Cancel drag on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isDragging) {
        setIsDragging(false);
        setHoveredSlot(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDragging]);

  // ── The element rendered inside a slot ──────────────────────────────────────
  const slotContent = (slotId: SlotId) => {
    if (isDragging || currentSlot !== slotId) return null;
    return (
      <div
        className={styles.handle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      {/* ── Slot: above the About heading ─────────────────────────────────── */}
      <div
        ref={headerSlotRef}
        className={[
          styles.slot,
          isDragging ? styles.slotVisible : "",
          hoveredSlot === "header" ? styles.slotHovered : "",
        ].join(" ")}
        data-slot="header"
      >
        {slotContent("header")}
      </div>

      {/* ── Slot: above Currently ─────────────────────────────────────────── */}
      <div
        ref={sidebarSlotRef}
        className={[
          styles.slot,
          isDragging ? styles.slotVisible : "",
          hoveredSlot === "sidebar" ? styles.slotHovered : "",
        ].join(" ")}
        data-slot="sidebar"
      >
        {slotContent("sidebar")}
      </div>

      {/* ── Dragging ghost ────────────────────────────────────────────────── */}
      {isDragging && (
        <div
          ref={ghostRef}
          className={styles.ghost}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {children}
        </div>
      )}
    </>
  );
}