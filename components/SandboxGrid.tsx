"use client";

import { useState } from "react";
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

  function handleTileClick(item: SandboxItem, rect: DOMRect) {
    setActive({ item, rect });
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setActive(null);
    document.body.style.overflow = "";
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
