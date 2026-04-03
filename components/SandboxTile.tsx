"use client";

import { useRef } from "react";
import type { SandboxItem } from "@/lib/sandbox";
import styles from "./SandboxTile.module.css";

interface SandboxTileProps {
  item: SandboxItem;
  index: number;
  onClick: (item: SandboxItem, rect: DOMRect, tileEl: HTMLDivElement) => void;
}

export function SandboxTile({ item, index, onClick }: SandboxTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const delayClass = `delay-${Math.min(index + 1, 5)}`;

  function handleMouseEnter() {
    if (item.mediaType === "video") videoRef.current?.play();
  }

  function handleMouseLeave() {
    if (item.mediaType === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function handleClick() {
    if (!tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    onClick(item, rect, tileRef.current);
  }

  return (
    <div
      ref={tileRef}
      className={`${styles.tile} anim-fade-up ${delayClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Video */}
      <div className={styles.videoWrap}>
        {item.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={item.media}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className={styles.video}
          />
        ) : (
          <img
            src={item.media}
            alt={item.title}
            className={styles.video}  // same class, same object-fit: cover sizing
          />
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.title}>{item.title}</span>
        {item.label && <span className={styles.label}>{item.label}</span>}
      </div>
    </div>
  );
}
