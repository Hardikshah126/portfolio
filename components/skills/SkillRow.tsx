"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { SkillGroup } from "@/data/portfolio";

export function SkillRow({ group, index }: { group: SkillGroup; index: number }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="grid gap-4 border-t border-white/10 py-8 last:border-b md:grid-cols-[220px_1fr] md:gap-10 md:py-10"
    >
      <h3 className="label-mono flex items-start gap-3 pt-2 text-white/50">
        <span className="text-ember">S/0{index + 1}</span>
        {group.label}
      </h3>

      <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1" onMouseLeave={() => setHovered(null)}>
        {group.skills.map((skill, i) => {
          const isOn = hovered === skill.name;
          const dimmed = hovered !== null && !isOn;
          return (
            <li key={skill.name} className="flex items-baseline">
              <span
                onMouseEnter={() => setHovered(skill.name)}
                className={`display relative inline-block origin-bottom-left text-[clamp(1.9rem,4.6vw,4.4rem)] transition-[color,transform,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                  isOn ? "scale-[1.12] text-ember" : dimmed ? "text-white/20" : "text-white/85"
                }`}
              >
                {skill.name}
                <AnimatePresence>{isOn && skill.fx === "graph" && <GraphFx />}</AnimatePresence>
              </span>
              {i < group.skills.length - 1 && (
                <span aria-hidden="true" className="display ml-2 text-[clamp(1.9rem,4.6vw,4.4rem)] text-white/15">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

const pts = [
  [8, 30],
  [40, 8],
  [78, 22],
  [112, 6],
  [140, 34],
  [96, 44],
  [56, 40],
];
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [5, 4],
  [1, 6],
  [6, 5],
  [0, 6],
];

/** Tiny vector-graph flourish for retrieval / agent skills. */
function GraphFx() {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 148 50"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute -top-10 left-0 w-36"
    >
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={pts[a][0]}
          y1={pts[a][1]}
          x2={pts[b][0]}
          y2={pts[b][1]}
          stroke="#e3242b"
          strokeOpacity={0.6}
          strokeWidth={0.8}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
        />
      ))}
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={2.2}
          fill={i % 3 === 0 ? "#e3242b" : "#fff"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 + i * 0.04 }}
        />
      ))}
    </motion.svg>
  );
}
