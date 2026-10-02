"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Desktop: pins the section and converts vertical scroll into horizontal travel.
 * Below `lg` (or with reduced motion) panels simply stack.
 */
export function HorizontalTrack({
  header,
  count,
  children,
}: {
  header: ReactNode;
  count: number;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const on = media.matches && !reduce;
      setEnabled(on);
      setDistance(on && trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    media.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      media.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [1 / count, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(count - 1, Math.round(v * (count - 1))));
  });

  return (
    <div
      ref={sectionRef}
      style={enabled ? { height: `calc(${distance}px + 100svh)` } : undefined}
      className="relative"
    >
      <div className={enabled ? "sticky top-0 flex h-svh flex-col overflow-hidden" : ""}>
        <div className="relative z-10 flex items-center justify-between px-5 pt-24 md:px-10 lg:pt-24">
          {header}
          {enabled && (
            <div className="label-mono flex items-center gap-4 text-white/50" aria-hidden="true">
              <span className="text-white">0{active + 1}</span>
              <span className="relative h-px w-28 bg-white/15">
                <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-ember" />
              </span>
              <span>0{count}</span>
            </div>
          )}
        </div>

        <motion.div
          ref={trackRef}
          style={enabled ? { x } : undefined}
          className={enabled ? "flex min-h-0 flex-1 will-change-transform" : "flex flex-col px-5 pb-10 pt-10 md:px-10"}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
