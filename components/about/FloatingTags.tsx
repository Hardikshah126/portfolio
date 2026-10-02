"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const tags = [
  { t: "Python", c: "right-[6%] top-[24%]", d: -60 },
  { t: "Go", c: "right-[16%] top-[8%]", d: 90 },
  { t: "TypeScript", c: "right-[3%] top-[40%]", d: -40 },
  { t: "Next.js", c: "left-[44%] top-[6%]", d: 50 },
  { t: "FastAPI", c: "left-[2%] bottom-[24%]", d: 70 },
  { t: "AI", c: "right-[5%] bottom-[10%]", d: -80 },
  { t: "Distributed Systems", c: "left-[38%] bottom-[6%]", d: 40 },
];

/** Technical annotations drifting at different speeds around the About copy. */
export function FloatingTags() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {tags.map((tag) => (
        <Tag key={tag.t} {...tag} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Tag({
  t,
  c,
  d,
  progress,
}: {
  t: string;
  c: string;
  d: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [d, -d]);
  return (
    <motion.span style={{ y }} className={`label-mono absolute flex items-center gap-2 text-white/30 ${c}`}>
      <span className="text-ember/70">+</span>
      {t}
    </motion.span>
  );
}
