"use client";

import { motion } from "framer-motion";
import { useTicker } from "@/lib/useTicker";
import { LabFrame } from "./LabFrame";

const STAGES = ["Incident", "Agents ×8", "Evidence ×32", "Hypotheses", "Approve → Fix"];
const AGENTS = ["Logs", "Metrics", "Deploys", "A·04", "A·05", "A·06", "A·07", "A·08"];
const PHASES = 7; // incident, agents, evidence, hypotheses, select, approve, hold

const ring = { cx: 215, cy: 190, r: 92 };
const agentPos = AGENTS.map((_, i) => {
  const a = (-90 + i * 45) * (Math.PI / 180);
  return { x: ring.cx + ring.r * Math.cos(a), y: ring.cy + ring.r * Math.sin(a) };
});
const COLS = [45, 215, 385, 505, 650];
const mono = "var(--font-mono)";

export function AgentsVisual() {
  const { ref, tick, animated } = useTicker<HTMLDivElement>(1300);
  // Reduced motion: show the finished investigation as a single static frame.
  const phase = animated ? tick % PHASES : PHASES - 1;
  const on = (p: number) => phase >= p;

  return (
    <LabFrame code="LAB/04" title="Incident investigation graph" note="Illustrative run — 8 agents · 32 evidence records · 3 hypotheses · human approval">
      <div ref={ref} className="flex h-full flex-col justify-center">
        <svg viewBox="-16 30 752 310" className="w-full" aria-hidden="true">
          {STAGES.map((s, i) => (
            <text
              key={s}
              x={COLS[i]}
              y={70}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="1"
              fontFamily={mono}
              fill={on(i === 4 ? 4 : i) ? "#fff" : "rgba(255,255,255,0.3)"}
              style={{ transition: "fill .4s" }}
            >
              {`0${i + 1} ${s.toUpperCase()}`}
            </text>
          ))}

          {/* connectors between stages */}
          {[
            [92, 104],
            [326, 352],
            [420, 444],
            [567, 593],
          ].map(([x1, x2], i) => (
            <g key={i}>
              <line x1={x1} x2={x2} y1={190} y2={190} stroke="rgba(255,255,255,0.15)" />
              {on(i + 1) && (
                <motion.circle
                  key={`${tick}-${i}`}
                  r={2.5}
                  cy={190}
                  fill="#e3242b"
                  initial={{ cx: x1 }}
                  animate={{ cx: x2 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              )}
            </g>
          ))}

          {/* 01 incident */}
          <rect x={0} y={166} width={92} height={48} fill={on(0) ? "rgba(227,36,43,0.14)" : "none"} stroke="#e3242b" />
          <text x={46} y={186} textAnchor="middle" fontSize="9" letterSpacing="1.2" fill="#e3242b" fontFamily={mono}>
            SEV-1
          </text>
          <text x={46} y={202} textAnchor="middle" fontSize="9" letterSpacing="1.2" fill="rgba(255,255,255,0.7)" fontFamily={mono}>
            INCIDENT
          </text>

          {/* 02 agent network */}
          <circle cx={ring.cx} cy={ring.cy} r={ring.r} fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 5" />
          {agentPos.map((p, i) =>
            agentPos.slice(i + 1).map((q, j) =>
              (i + j) % 3 === 0 ? (
                <line
                  key={`${i}-${j}`}
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke={on(1) ? "rgba(227,36,43,0.18)" : "rgba(255,255,255,0.05)"}
                  style={{ transition: "stroke .6s" }}
                />
              ) : null,
            ),
          )}
          {agentPos.map((p, i) => (
            <g key={AGENTS[i]}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={17}
                stroke={on(1) ? "#e3242b" : "rgba(255,255,255,0.35)"}
                initial={false}
                animate={{ fill: on(1) ? "#1a0607" : "#0d0d0d" }}
                transition={{ delay: on(1) ? i * 0.07 : 0, duration: 0.3 }}
              />
              <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="7.5" letterSpacing="0.6" fill="rgba(255,255,255,0.85)" fontFamily={mono}>
                {AGENTS[i].toUpperCase()}
              </text>
            </g>
          ))}

          {/* 03 evidence — 32 records filling in */}
          {Array.from({ length: 32 }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return (
              <motion.rect
                key={i}
                x={356 + col * 15}
                y={130 + row * 15}
                width={11}
                height={11}
                stroke="rgba(255,255,255,0.25)"
                initial={false}
                animate={{ fill: on(2) ? (i % 7 === 3 ? "#e3242b" : "rgba(255,255,255,0.75)") : "rgba(255,255,255,0)" }}
                transition={{ delay: on(2) && phase === 2 ? i * 0.025 : 0, duration: 0.2 }}
              />
            );
          })}

          {/* 04 hypotheses */}
          {[0.82, 0.55, 0.38].map((w, i) => {
            const chosen = i === 0 && on(4);
            return (
              <g key={i}>
                <text x={450} y={160 + i * 32} fontSize="9" letterSpacing="1" fill={chosen ? "#e3242b" : "rgba(255,255,255,0.5)"} fontFamily={mono}>
                  H{i + 1}
                </text>
                <rect x={470} y={151 + i * 32} width={95} height={12} fill="rgba(255,255,255,0.06)" />
                <motion.rect
                  x={470}
                  y={151 + i * 32}
                  height={12}
                  fill={chosen ? "#e3242b" : "rgba(255,255,255,0.6)"}
                  initial={false}
                  animate={{ width: on(3) ? 95 * w : 0 }}
                  transition={{ duration: 0.7, delay: on(3) && phase === 3 ? i * 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>
            );
          })}

          {/* 05 human approval → fix */}
          <rect x={595} y={136} width={110} height={44} fill="none" stroke={on(4) ? "#fff" : "rgba(255,255,255,0.2)"} />
          <text x={650} y={154} textAnchor="middle" fontSize="8.5" letterSpacing="1.2" fill="rgba(255,255,255,0.45)" fontFamily={mono}>
            ENGINEER
          </text>
          <motion.text
            x={650}
            y={170}
            textAnchor="middle"
            fontSize="9.5"
            letterSpacing="1.2"
            fontFamily={mono}
            fill={on(5) ? "#fff" : "#e3242b"}
            animate={phase === 4 ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={{ duration: 0.8, repeat: phase === 4 ? Infinity : 0 }}
          >
            {on(5) ? "✓ APPROVED" : on(4) ? "AWAITING" : "—"}
          </motion.text>
          <line x1={650} x2={650} y1={180} y2={204} stroke="rgba(255,255,255,0.2)" />
          <rect x={595} y={204} width={110} height={44} fill={on(6) ? "#e3242b" : "none"} stroke={on(5) ? "#e3242b" : "rgba(255,255,255,0.2)"} style={{ transition: "fill .4s" }} />
          <text x={650} y={230} textAnchor="middle" fontSize="9.5" letterSpacing="1.2" fill="#fff" fontFamily={mono}>
            {on(6) ? "FIX APPLIED" : on(5) ? "RUNNING FIX" : "FIX"}
          </text>

          <text x={0} y={320} fontSize="9" letterSpacing="1.4" fill="rgba(255,255,255,0.3)" fontFamily={mono}>
            NO FIX RUNS WITHOUT HUMAN APPROVAL
          </text>
          <text x={720} y={320} textAnchor="end" fontSize="9" letterSpacing="1.4" fill="rgba(255,255,255,0.3)" fontFamily={mono}>
            230+ TESTS · 0 FAILURES
          </text>
        </svg>
      </div>
    </LabFrame>
  );
}
