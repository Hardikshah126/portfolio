"use client";

import { motion } from "framer-motion";

/** Editorial section marker: "01 / ABOUT" with a rule that draws in. */
export function SectionLabel({
  index,
  label,
  tone = "dark",
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={`label-mono ${tone === "dark" ? "text-ember" : "text-crimson"}`}>{index}</span>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        className={`h-px w-12 origin-left md:w-20 ${tone === "dark" ? "bg-white/40" : "bg-ink/40"}`}
      />
      <span className={`label-mono ${tone === "dark" ? "text-white/70" : "text-ink/70"}`}>{label}</span>
    </div>
  );
}
