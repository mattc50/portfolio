"use client";

import { useEffect, useRef, useState } from "react";
import type { SandboxItem } from "@/lib/sandbox";
import styles from "./SandboxLightbox.module.css";

interface SandboxLightboxProps {
  item: SandboxItem;
  originRect: DOMRect;
  onClose: () => void;
}

export function SandboxLightbox({ item, originRect, onClose }: SandboxLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"enter" | "open" | "exit">("enter");

  // Play video once mounted
  useEffect(() => {
    if (item.mediaType === "video") videoRef.current?.play();
  }, []);

  // Drive the enter animation on mount
  useEffect(() => {
    // rAF ensures the browser has painted the "enter" state before transitioning
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("open"));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Close: run exit animation then call onClose
  function handleClose() {
    setPhase("exit");
  }

  function handleTransitionEnd() {
    if (phase === "exit") onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = lightboxRef.current;
    if (!el) return;

    // Focus the lightbox itself on mount
    el.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const focusable = el!.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab — if on first, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab — if on last, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Compute origin transform so the card appears to expand from its tile ──
  // We'll set a CSS custom property on the overlay element.
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;

  // Center of the origin tile, relative to viewport center
  const ox = originRect.left + originRect.width / 2 - vw / 2;
  const oy = originRect.top + originRect.height / 2 - vh / 2;
  const scaleX = originRect.width / Math.min(vw * 0.9, 720);
  const scaleY = originRect.height / (Math.min(vw * 0.9, 720) * (10 / 16));

  const enterTransform = `translate(${ox}px, ${oy}px) scale(${scaleX}, ${scaleY})`;

  return (
    /* Backdrop */
    <div
      ref={lightboxRef}
      tabIndex={-1}
      className={`${styles.backdrop} ${styles[phase]}`}
      onClick={handleClose}
      onTransitionEnd={handleTransitionEnd}
      aria-modal="true"
      role="dialog"
      aria-label={item.title}
    >
      {/* Card — stops click propagation so clicking inside doesn't close */}
      <div
        className={styles.card}
        style={
          {
            "--enter-transform": enterTransform,
          } as React.CSSProperties
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video */}
        <div className={styles.videoWrap}>
          <button
            className={`${styles.closeBtn}${item.mode === "dark" ? ` ${styles.lightBtn}` : ""}`}
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 2L14 14M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {item.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={item.media}
              poster={item.poster}
              muted
              loop
              playsInline
              autoPlay
              className={styles.video}
            />
          ) : (
            <img
              src={item.media}
              alt={item.title}
              className={styles.video}
            />
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div>
              <h2 className={styles.title}>{item.title}</h2>
              {item.label && <span className={styles.label}>{item.label}</span>}
            </div>
            {/* <button
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button> */}
          </div>
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>
    </div>
  );
}
