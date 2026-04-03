"use client";

import { useRef, useState } from "react";
import type { SandboxItem } from "@/lib/sandbox";
import { SandboxTile } from "./SandboxTile";
import { SandboxLightbox } from "./SandboxLightbox";
import styles from "./SandboxGrid.module.css";

interface SandboxGridProps {
  items: SandboxItem[];
}

interface ActiveItem {
  item: SandboxItem;
  rect: DOMRect;
}

export function SandboxGrid({ items }: SandboxGridProps) {
  const [active, setActive] = useState<ActiveItem | null>(null);
  const activeTileRef = useRef<HTMLDivElement | null>(null);

  function handleTileClick(item: SandboxItem, rect: DOMRect, tileEl: HTMLDivElement) {
    activeTileRef.current = tileEl;
    setActive({ item, rect });
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setActive(null);
    document.body.style.overflow = "";
    activeTileRef.current?.focus();
  }

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <SandboxTile
            key={item.id}
            item={item}
            index={i}
            onClick={handleTileClick}
          />
        ))}
      </div>

      {active && (
        <SandboxLightbox
          item={active.item}
          originRect={active.rect}
          onClose={handleClose}
        />
      )}
    </>
  );
}
