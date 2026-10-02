"use client";

import { motion } from "framer-motion";
import { useTicker } from "@/lib/useTicker";
import { LabFrame } from "./LabFrame";

type Step = {
  leader: number | null;
  candidate?: number;
  crash?: number;
  recover?: number;
  append?: boolean;
  event: string;
};

// A scripted, looping cluster story: steady state → leader crash → election → recovery.
const SCRIPT: Step[] = [
  { leader: 0, append: true, event: "Entry replicated · quorum 5/5" },
  { leader: 0, append: true, event: "Heartbeat · followers in sync" },
  { leader: null, crash: 0, event: "Node 01 crashed · leader lost" },
  { leader: null, candidate: 2, event: "Node 03 timed out · requesting votes" },
  { leader: 2, event: "Node 03 elected leader" },
  { leader: 2, append: true, event: "Entry replicated · quorum 4/5" },
  { leader: 2, recover: 0, event: "Node 01 recovered · catching up" },
  { leader: 2, append: true, event: "Logs in sync across 5 nodes" },
  { leader: 2, crash: 4, event: "Node 05 crashed" },
  { leader: 2, append: true, event: "Quorum held · 4/5 alive" },
  { leader: 2, recover: 4, event: "Node 05 recovered" },
  { leader: null, crash: 2, event: "Node 03 crashed · leader lost" },
  { leader: null, candidate: 3, event: "Node 04 timed out · requesting votes" },
  { leader: 3, append: true, event: "Node 04 elected leader" },
  { leader: 3, recover: 2, event: "Node 03 recovered · rejoined as follower" },
  { leader: null, candidate: 0, event: "Leadership transfer · node 01 requests votes" },
  { leader: 0, event: "Node 01 elected leader" },
];

const N = 5;
const CX = 200;
const CY = 200;
const R = 128;
const pos = Array.from({ length: N }, (_, i) => {
  const a = (-90 + (360 / N) * i) * (Math.PI / 180);
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

function simulate(tick: number) {
  let term = 1;
  let commit = 3;
  const down = new Set<number>();
  const logs = Array<number>(N).fill(commit);
  const events: { t: number; text: string; term: number }[] = [];

  for (let t = 0; t <= tick; t++) {
    const s = SCRIPT[t % SCRIPT.length];
    if (s.candidate !== undefined) term++;
    if (s.crash !== undefined) down.add(s.crash);
    if (s.recover !== undefined) down.delete(s.recover);
    if (s.append) commit++;
    for (let i = 0; i < N; i++) if (!down.has(i)) logs[i] = commit;
    if (t > tick - 4) events.unshift({ t, text: s.event, term });
  }

  const step = SCRIPT[tick % SCRIPT.length];
  return { step, term, commit, down, logs, events };
}

export function RaftVisual() {
  const { ref, tick } = useTicker<HTMLDivElement>(1500);
  const { step, term, commit, down, logs, events } = simulate(tick);
  const leader = step.leader;

  const stateOf = (i: number) =>
    down.has(i) ? "Down" : i === leader ? "Leader" : i === step.candidate ? "Candidate" : "Follower";

  return (
    <LabFrame code="LAB/02" title="Consensus simulation" note="Illustrative simulation of a 5-node raft-lite cluster">
      <div ref={ref} className="grid h-full grid-rows-[1fr_auto] md:grid-cols-[1fr_minmax(200px,34%)] md:grid-rows-1">
        <svg viewBox="0 0 400 400" className="h-full max-h-[52svh] w-full md:max-h-none" aria-hidden="true">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 6" />

          {/* replication edges + heartbeats from the leader */}
          {leader !== null &&
            pos.map((p, i) =>
              i === leader || down.has(i) ? null : (
                <g key={`e${i}`}>
                  <line x1={pos[leader].x} y1={pos[leader].y} x2={p.x} y2={p.y} stroke="rgba(227,36,43,0.28)" />
                  <motion.circle
                    key={`hb-${tick}-${i}`}
                    r={3}
                    fill="#e3242b"
                    initial={{ cx: pos[leader].x, cy: pos[leader].y, opacity: 0 }}
                    animate={{ cx: p.x, cy: p.y, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  />
                </g>
              ),
            )}

          {/* vote requests from a candidate */}
          {step.candidate !== undefined &&
            pos.map((p, i) =>
              i === step.candidate || down.has(i) ? null : (
                <motion.line
                  key={`v-${tick}-${i}`}
                  x1={pos[step.candidate!].x}
                  y1={pos[step.candidate!].y}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(255,255,255,0.5)"
                  strokeDasharray="3 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7 }}
                />
              ),
            )}

          {pos.map((p, i) => {
            const state = stateOf(i);
            const isLeader = state === "Leader";
            const isDown = state === "Down";
            return (
              <g key={i}>
                {isLeader && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    fill="none"
                    stroke="#e3242b"
                    initial={{ r: 26, opacity: 0.7 }}
                    animate={{ r: 46, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={24}
                  fill={isLeader ? "#e3242b" : "#0d0d0d"}
                  stroke={isDown ? "rgba(255,255,255,0.15)" : state === "Candidate" ? "#e3242b" : "rgba(255,255,255,0.7)"}
                  strokeDasharray={state === "Candidate" ? "4 3" : undefined}
                  style={{ transition: "fill .4s, stroke .4s" }}
                />
                {isDown ? (
                  <path
                    d={`M${p.x - 7} ${p.y - 7} L${p.x + 7} ${p.y + 7} M${p.x + 7} ${p.y - 7} L${p.x - 7} ${p.y + 7}`}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={1.5}
                  />
                ) : (
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill={isLeader ? "#fff" : "rgba(255,255,255,0.85)"} fontFamily="var(--font-mono)">
                    0{i + 1}
                  </text>
                )}
                <text
                  x={p.x}
                  y={p.y + (p.y > CY ? 44 : -36)}
                  textAnchor="middle"
                  fontSize="9.5"
                  letterSpacing="1.4"
                  fill={isLeader ? "#e3242b" : isDown ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)"}
                  fontFamily="var(--font-mono)"
                >
                  {state.toUpperCase()}
                </text>
              </g>
            );
          })}

          <text x={CX} y={CY - 4} textAnchor="middle" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-mono)">
            TERM
          </text>
          <text x={CX} y={CY + 22} textAnchor="middle" fontSize="26" fill="#fff" fontFamily="var(--font-display)">
            {String(term).padStart(2, "0")}
          </text>
        </svg>

        <div className="label-mono flex flex-col justify-between gap-6 border-t border-white/10 p-4 text-white/50 md:border-l md:border-t-0 md:p-5">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
            <div>
              <div className="text-white/35">Leader</div>
              <div className="mt-1 text-white">{leader === null ? "Electing…" : `Node 0${leader + 1}`}</div>
            </div>
            <div>
              <div className="text-white/35">Commit index</div>
              <div className="mt-1 text-white">{String(commit).padStart(3, "0")}</div>
            </div>
            <div>
              <div className="text-white/35">Alive</div>
              <div className="mt-1 text-white">
                {N - down.size}/{N}
              </div>
            </div>
          </div>

          <div className="hidden space-y-1.5 md:block" aria-hidden="true">
            {logs.map((len, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-white/35">0{i + 1}</span>
                <div className="flex gap-[3px]">
                  {Array.from({ length: 8 }).map((_, k) => {
                    const missing = 7 - k < commit - len;
                    return (
                      <span
                        key={k}
                        className={`h-2.5 w-2.5 border ${
                          missing ? "border-white/20" : i === leader ? "border-ember bg-ember" : "border-white/60 bg-white/60"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <ol className="hidden space-y-2 md:block" aria-label="Cluster events">
            {events.map((e, i) => (
              <li key={e.t} className={i === 0 ? "text-white" : "text-white/30"}>
                <span className={i === 0 ? "text-ember" : ""}>T{String(e.term).padStart(2, "0")}</span> · {e.text}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </LabFrame>
  );
}
