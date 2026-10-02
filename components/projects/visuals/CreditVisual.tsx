"use client";

import { motion } from "framer-motion";
import { useTicker } from "@/lib/useTicker";
import { LabFrame } from "./LabFrame";

// Simulated applicants used only to animate the decision interface.
const APPLICANTS = [
  { id: "A-0141", income: 0.82, dti: 0.18, score: 0.91 },
  { id: "A-0142", income: 0.46, dti: 0.41, score: 0.58 },
  { id: "A-0143", income: 0.31, dti: 0.63, score: 0.22 },
  { id: "A-0144", income: 0.67, dti: 0.29, score: 0.79 },
  { id: "A-0145", income: 0.52, dti: 0.48, score: 0.44 },
];

function decide(score: number, dti: number) {
  if (score >= 0.7 && dti < 0.4) return { label: "Approve", tone: "text-white" };
  if (score >= 0.4) return { label: "Review", tone: "text-white/60" };
  return { label: "Decline", tone: "text-ember" };
}

// Illustrative ROC shapes: a strong model bowing toward the top-left, and a weaker baseline.
const XGB = "M0 300 C 8 120, 40 40, 120 18 S 260 2, 300 0";
const LOGREG = "M0 300 C 30 190, 80 110, 150 70 S 260 18, 300 0";

export function CreditVisual() {
  const { ref, tick } = useTicker<HTMLDivElement>(2200);
  const a = APPLICANTS[tick % APPLICANTS.length];
  const decision = decide(a.score, a.dti);

  return (
    <LabFrame code="LAB/03" title="Scoring console" note="Illustrative curves and simulated applicants — reported model: 0.93 ROC-AUC">
      <div ref={ref} className="grid h-full gap-0 md:grid-cols-[1.05fr_1fr]">
        {/* ROC curve */}
        <div className="relative flex flex-col p-5 md:border-r md:border-white/10">
          <div className="label-mono flex items-center justify-between text-white/40">
            <span>ROC curve</span>
            <span className="text-white">
              AUC <span className="text-ember">0.93</span>
            </span>
          </div>
          <svg viewBox="-28 -10 340 340" className="mt-3 h-full max-h-[34svh] w-full md:max-h-none" aria-hidden="true">
            {[0, 75, 150, 225, 300].map((v) => (
              <g key={v}>
                <line x1={0} x2={300} y1={v} y2={v} stroke="rgba(255,255,255,0.06)" />
                <line y1={0} y2={300} x1={v} x2={v} stroke="rgba(255,255,255,0.06)" />
              </g>
            ))}
            <line x1={0} y1={300} x2={300} y2={0} stroke="rgba(255,255,255,0.25)" strokeDasharray="4 5" />
            <motion.path
              d={LOGREG}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            />
            <motion.path
              d={`${XGB} L 300 300 L 0 300 Z`}
              fill="rgba(227,36,43,0.08)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1.4 }}
            />
            <motion.path
              d={XGB}
              fill="none"
              stroke="#e3242b"
              strokeWidth={2.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
            />
            <text x={150} y={326} textAnchor="middle" fontSize="10" letterSpacing="1.5" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-mono)">
              FALSE POSITIVE RATE
            </text>
            <text x={-16} y={150} textAnchor="middle" fontSize="10" letterSpacing="1.5" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-mono)" transform="rotate(-90 -16 150)">
              TRUE POSITIVE RATE
            </text>
          </svg>
          <div className="label-mono mt-3 flex flex-wrap gap-x-5 gap-y-1 text-white/50">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-4 bg-ember" /> XGBoost + rules
            </span>
            <span className="flex items-center gap-2">
              <span className="h-px w-4 bg-white/50" /> Logistic regression
            </span>
          </div>
        </div>

        {/* Decision pipeline */}
        <div className="label-mono flex flex-col justify-between gap-5 border-t border-white/10 p-5 text-white/45 md:border-t-0">
          <div className="flex items-center justify-between">
            <span>Applicant</span>
            <motion.span key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-white">
              {a.id}
            </motion.span>
          </div>

          {[
            { k: "Income", v: a.income },
            { k: "Debt-to-income", v: a.dti },
            { k: "XGBoost score", v: a.score, accent: true },
          ].map((row) => (
            <div key={row.k}>
              <div className="flex justify-between">
                <span>{row.k}</span>
                <span className="text-white">{row.v.toFixed(2)}</span>
              </div>
              <div className="mt-2 h-[3px] bg-white/10">
                <motion.div
                  className={`h-full origin-left ${row.accent ? "bg-ember" : "bg-white/70"}`}
                  initial={false}
                  animate={{ scaleX: row.v }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 text-white/30">
            <span>Model</span>
            <span className="h-px flex-1 bg-white/15" />
            <span>Rules</span>
            <span className="h-px flex-1 bg-white/15" />
            <span>Decision</span>
          </div>

          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <motion.span
              key={`${a.id}-d`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`display text-4xl ${decision.tone}`}
            >
              {decision.label}
            </motion.span>
            <span className="text-right">
              Role-based API
              <br />
              <span className="text-white">3 roles</span>
            </span>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
