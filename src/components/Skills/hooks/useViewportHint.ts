"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  storageKey?: string;
  threshold?: number;
  durationMs?: number;
  reducedMotionDurationMs?: number;
};

export function useViewportHint({
  storageKey = "skills_hint_seen",
  threshold = 0.4,
  durationMs = 2800,
  reducedMotionDurationMs = 2200,
}: Options = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    if (sessionStorage.getItem(storageKey)) return;

    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const triggerHint = () => {
      sessionStorage.setItem(storageKey, "1");
      setShowHint(true);

      globalThis.setTimeout(
        () => setShowHint(false),
        prefersReducedMotion ? reducedMotionDurationMs : durationMs
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some(
          (e) => e.isIntersecting && e.intersectionRatio >= threshold
        );
        if (hit) {
          observer.disconnect();
          triggerHint();
        }
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [storageKey, threshold, durationMs, reducedMotionDurationMs]);

  return { ref, showHint };
}
