"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Counts up every `ms` while the referenced element is on screen.
 * Stays at 0 for reduced-motion users, so visuals render a calm static frame.
 */
export function useTicker<T extends Element>(ms: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [inView, reduce, ms]);

  return { ref, tick, animated: !reduce };
}
