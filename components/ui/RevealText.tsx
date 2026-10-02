"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";

type Props = {
  id?: string;
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
};

/** Line-by-line mask reveal, triggered once when scrolled into view. */
export function RevealText({
  id,
  lines,
  as: Tag = "p",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: Props) {
  // Observe the wrapper: the moving lines start fully clipped by their masks,
  // so they would never intersect the viewport themselves.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.06em] ${lineClassName ?? ""}`}>
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
