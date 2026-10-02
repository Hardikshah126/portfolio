"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Experience } from "@/data/portfolio";

export function Timeline({ items }: { items: Experience[] }) {
  const [active, setActive] = useState(0);

  return (
    <ol className="relative mt-16 md:mt-24">
      {/* the spine */}
      <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-white/15 lg:left-[25%]" />
      {items.map((item, i) => (
        <TimelineItem
          key={item.id}
          item={item}
          index={i}
          active={active === i}
          onActivate={() => setActive(i)}
        />
      ))}
    </ol>
  );
}

function TimelineItem({
  item,
  index,
  active,
  onActivate,
}: {
  item: Experience;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const panelId = `exp-${item.id}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      onMouseEnter={onActivate}
      className="group relative grid gap-y-4 border-t border-white/10 py-10 pl-10 last:border-b lg:grid-cols-[25%_1fr] lg:pl-0 lg:py-14"
    >
      {/* indicator on the spine */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-10 -translate-x-1/2 lg:left-[25%] lg:top-16"
      >
        <span
          className={`block w-[3px] origin-top bg-ember transition-all duration-700 ease-[var(--ease-out-expo)] ${
            active ? "h-24 lg:h-40" : "h-3 bg-white/40 lg:h-3"
          }`}
        />
      </span>

      {/* left: period and index */}
      <div className="flex items-baseline gap-4 lg:flex-col lg:gap-3 lg:pr-12">
        <span
          className={`label-mono transition-colors duration-500 ${active ? "text-ember" : "text-white/40"}`}
        >
          E/0{index + 1}
        </span>
        <span
          className={`label-mono transition-colors duration-500 ${active ? "text-white" : "text-white/50"}`}
        >
          {item.period}
        </span>
      </div>

      {/* right: role, company and the revealable detail */}
      <div className="lg:pl-14">
        <h3>
          <button
            type="button"
            onClick={onActivate}
            onFocus={onActivate}
            aria-expanded={active}
            aria-controls={panelId}
            className={`display block text-left text-[clamp(2rem,5.2vw,5.4rem)] leading-[0.98] transition-colors duration-500 ${
              active ? "text-white" : "text-white/35 hover:text-white/70"
            }`}
          >
            {item.role}
          </button>
        </h3>
        <p
          className={`label-mono mt-4 transition-colors duration-500 ${active ? "text-ember" : "text-white/50"}`}
        >
          {item.company}
          {item.location ? ` · ${item.location}` : ""}
        </p>

        <div
          id={panelId}
          className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)] max-lg:grid-rows-[1fr] max-lg:opacity-100 ${
            active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-10 pt-8 xl:grid-cols-[1fr_auto] xl:gap-16">
              <div>
                <p className="max-w-2xl text-lg leading-relaxed text-white/85">{item.summary}</p>
                <ul className="mt-6 max-w-2xl space-y-3">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex gap-4 text-[0.95rem] leading-relaxed text-white/60">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-ember" />
                      {h}
                    </li>
                  ))}
                </ul>
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
                  {item.stack.map((t, i) => (
                    <li
                      key={t}
                      style={{ transitionDelay: active ? `${150 + i * 40}ms` : "0ms" }}
                      className={`label-mono border border-white/20 px-2.5 py-1.5 text-white/75 transition-all duration-500 max-lg:translate-y-0 max-lg:opacity-100 ${
                        active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                      }`}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-10 xl:flex-col xl:gap-8 xl:border-l xl:border-white/10 xl:pl-10">
                {item.metrics.map((m) => (
                  <p key={m.label}>
                    <span className="display block text-[clamp(2.6rem,4.5vw,4.5rem)] text-white">{m.value}</span>
                    <span className="label-mono mt-2 block text-white/50">{m.label}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
