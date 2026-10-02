"use client";

import { motion } from "framer-motion";
import { useTicker } from "@/lib/useTicker";
import { LabFrame } from "./LabFrame";

const PHASES = 7; // scan, split, ask, retrieve, answer, hold, hold
const QUERY = "Explain the results table on page 5";

const STREAMS = [
  { kind: "Text", via: "Chunker → MiniLM" },
  { kind: "Tables", via: "Camelot → MiniLM" },
  { kind: "Figures", via: "PyMuPDF → CLIP" },
];

// Fixed scatter for the vector store; a few points sit on "page 5".
const POINTS = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 61 + 17) % 100,
  hit: [3, 11, 19, 26].includes(i),
}));

export function RagVisual() {
  const { ref, tick, animated } = useTicker<HTMLDivElement>(1000);
  const phase = animated ? tick % PHASES : PHASES - 1;
  const on = (p: number) => phase >= p;

  return (
    <LabFrame code="LAB/05" title="Multimodal retrieval" note="Illustrative run of the VisRAG pipeline — text, tables and figures from one PDF">
      <div ref={ref} className="grid h-full md:grid-cols-2">
        {/* ingestion */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <span className="label-mono text-white/45">01 Ingest PDF</span>
          <div className="flex flex-1 gap-4">
            {/* stylised PDF page */}
            <div className="relative hidden aspect-[3/4] w-[38%] shrink-0 self-center overflow-hidden border border-white/20 bg-white/[0.03] p-3 sm:block">
              <div className="space-y-1.5">
                {[90, 75, 85, 60].map((w, i) => (
                  <div key={i} className="h-1 bg-white/30" style={{ width: `${w}%` }} />
                ))}
              </div>
              <div
                className={`mt-3 grid grid-cols-3 gap-px border transition-colors duration-500 ${
                  on(1) ? "border-ember" : "border-white/25"
                }`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`h-2.5 ${on(1) ? "bg-ember/30" : "bg-white/10"} transition-colors duration-500`} />
                ))}
              </div>
              <div
                className={`mt-3 flex aspect-[4/3] items-end gap-1 border p-1.5 transition-colors duration-500 ${
                  on(1) ? "border-white" : "border-white/25"
                }`}
              >
                {[40, 70, 55, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/40" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {[80, 65].map((w, i) => (
                  <div key={i} className="h-1 bg-white/30" style={{ width: `${w}%` }} />
                ))}
              </div>
              <span className="label-mono absolute bottom-1.5 right-2 text-[0.55rem] text-white/40">p.5</span>
              {phase === 0 && (
                <motion.span
                  className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-ember/40 to-transparent"
                  initial={{ top: "-10%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 0.95, ease: "linear" }}
                />
              )}
            </div>

            <ul className="label-mono flex flex-1 flex-col justify-center gap-2.5">
              {STREAMS.map((st, i) => (
                <motion.li
                  key={st.kind}
                  initial={false}
                  animate={{ opacity: on(1) ? 1 : 0.3, x: on(1) ? 0 : -6 }}
                  transition={{ delay: on(1) && phase === 1 ? i * 0.12 : 0, duration: 0.4 }}
                  className="border border-white/15 px-3 py-2.5"
                >
                  <span className="block text-white">{st.kind}</span>
                  <span className="mt-0.5 block text-white/40">{st.via}</span>
                </motion.li>
              ))}
              <li className={`pt-1 transition-colors duration-500 ${on(1) ? "text-ember" : "text-white/30"}`}>
                → Qdrant vector store
              </li>
            </ul>
          </div>
        </div>

        {/* query */}
        <div className="flex flex-col gap-4 p-5">
          <span className="label-mono text-white/45">02 Ask · retrieve · answer</span>

          <div className="label-mono min-h-[2.75rem] border border-white/15 px-3 py-2.5 text-white">
            {on(2) ? (
              <motion.span key={`q-${Math.floor(tick / PHASES)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                “{QUERY}”
              </motion.span>
            ) : (
              <span className="text-white/25">Waiting for a question…</span>
            )}
          </div>

          {/* vector space with page filter */}
          <div className="relative h-24 border border-white/10">
            {POINTS.map((p, i) => (
              <span
                key={i}
                className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${
                  on(3) && p.hit ? "scale-150 bg-ember" : on(3) ? "bg-white/15" : "bg-white/40"
                }`}
                style={{ left: `${4 + p.x * 0.92}%`, top: `${8 + p.y * 0.84}%` }}
              />
            ))}
            <span className="label-mono absolute right-2 top-1.5 text-[0.55rem] text-white/40">
              {on(3) ? "filter: page = 5 · top-k" : "Qdrant"}
            </span>
          </div>

          <div className="flex-1 border-t border-white/10 pt-4">
            {on(4) ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="space-y-1.5">
                  {[95, 88, 70].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 origin-left bg-white/60"
                      style={{ width: `${w}%` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                    />
                  ))}
                </div>
                <div className="label-mono mt-4 flex flex-wrap items-center gap-2">
                  <span className="bg-ember px-2 py-1 text-white">p.5</span>
                  <span className="border border-white/25 px-2 py-1 text-white/70">Table · p.5</span>
                  <span className="border border-white/25 px-2 py-1 text-white/70">Figure · p.5</span>
                  <span className="ml-auto text-white/35">Gemini · grounded</span>
                </div>
              </motion.div>
            ) : (
              <span className="label-mono text-white/25">{on(3) ? "Building context…" : "—"}</span>
            )}
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
