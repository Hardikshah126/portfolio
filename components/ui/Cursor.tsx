"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, [data-cursor]";

/** Dot + trailing ring. Only mounts on fine pointers. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on a client-only media query
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      setActive(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setHidden(true);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference">
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: hidden ? 0 : 1 }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{ width: label ? 88 : active ? 56 : 32, height: label ? 88 : active ? 56 : 32 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="label-mono flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white text-[9px] text-white"
        >
          {label}
        </motion.div>
      </motion.div>
      <motion.div
        style={{ x, y }}
        animate={{ opacity: hidden || active ? 0 : 1 }}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
    </div>
  );
}
