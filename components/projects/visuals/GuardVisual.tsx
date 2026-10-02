"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTicker } from "@/lib/useTicker";
import { LabFrame } from "./LabFrame";

const CHECKS = [
  "Agent permission",
  "Customer consent",
  "Cart integrity",
  "Inventory",
  "Transaction limit",
  "Idempotency",
];

// Simulated requests, modelled on the repo's adversarial suite. `fails` is the check index that blocks.
const SCENARIOS = [
  { label: "Honest checkout", request: "₹4,299", live: "₹4,299", fails: -1, reason: "Charged recomputed amount" },
  { label: "Amount manipulation", request: "₹99", live: "₹4,299", fails: 2, reason: "Requested ≠ live total" },
  { label: "Expired consent", request: "₹4,299", live: "₹4,299", fails: 1, reason: "Confirmation expired" },
  { label: "Over the limit", request: "₹68,000", live: "₹68,000", fails: 4, reason: "Exceeds autonomous limit" },
  { label: "Duplicate retry", request: "₹4,299", live: "₹4,299", fails: 5, reason: "Attempt already used" },
];

const STEPS = 11; // 6 checks + verdict + hold

export function GuardVisual() {
  const { ref, tick, animated } = useTicker<HTMLDivElement>(420);
  const scenario = animated ? Math.floor(tick / STEPS) % SCENARIOS.length : 0;
  const step = animated ? tick % STEPS : STEPS - 1;
  const s = SCENARIOS[scenario];
  const stopAt = s.fails === -1 ? CHECKS.length : s.fails + 1;
  const evaluated = Math.min(step, stopAt);
  const done = step >= stopAt;
  const allowed = s.fails === -1;

  return (
    <LabFrame code="LAB/01" title="Payment authorization" note="Simulated requests modelled on the repo's adversarial suite — benchmarks from one local run">
      <div ref={ref} className="grid h-full md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* request from the agent */}
        <div className="label-mono flex flex-col justify-between gap-6 border-b border-white/10 p-5 text-white/45 md:border-b-0 md:border-r">
          <div>
            <div className="flex items-center justify-between">
              <span>Scenario {String(scenario + 1).padStart(2, "0")}/05</span>
              <span className="text-white/30">AI agent →</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="display mt-4 text-[clamp(1.8rem,2.6vw,2.6rem)] text-white"
              >
                {s.label}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span>request_payment()</span>
              <span className={s.request !== s.live ? "text-ember" : "text-white"}>{s.request}</span>
            </div>
            <div className="flex justify-between">
              <span>Live recomputed total</span>
              <span className="text-white">{s.live}</span>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-3 border-t border-white/10 pt-4 md:grid">
            <div>
              <div className="text-white/35">Median</div>
              <div className="mt-1 text-white">15.5 ms</div>
            </div>
            <div>
              <div className="text-white/35">p95</div>
              <div className="mt-1 text-white">24.8 ms</div>
            </div>
          </div>
        </div>

        {/* the guard */}
        <div className="flex flex-col p-5">
          <div className="label-mono flex items-center justify-between text-white/45">
            <span>AgentGuard.evaluate()</span>
            <span className="hidden text-white/30 2xl:inline">no AI · no network</span>
          </div>

          <ol className="mt-4 flex-1 space-y-1.5">
            {CHECKS.map((c, i) => {
              const state = i < evaluated ? (i === s.fails ? "fail" : "pass") : i === evaluated && !done ? "run" : "idle";
              return (
                <li
                  key={c}
                  className={`label-mono flex items-center justify-between border px-3 py-2.5 transition-colors duration-300 ${
                    state === "fail"
                      ? "border-ember bg-ember/15 text-white"
                      : state === "pass"
                        ? "border-white/20 text-white"
                        : state === "run"
                          ? "border-white/40 text-white/80"
                          : "border-white/[0.07] text-white/30"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-white/30">0{i + 1}</span>
                    {c}
                  </span>
                  {state === "pass" && <Check aria-hidden="true" className="h-3.5 w-3.5 text-white" />}
                  {state === "fail" && <X aria-hidden="true" className="h-3.5 w-3.5 text-ember" />}
                  {state === "run" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex min-h-[64px] items-end justify-between border-t border-white/10 pt-4">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key={`${scenario}-verdict`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full items-end justify-between gap-4"
                >
                  <span className={`display text-4xl ${allowed ? "text-white" : "text-ember"}`}>
                    {allowed ? "Allow" : "Block"}
                  </span>
                  <span className="label-mono text-right text-white/50">
                    {s.reason}
                    <br />
                    <span className="text-white">{allowed ? "→ Razorpay order created" : "No charge · no order"}</span>
                  </span>
                </motion.div>
              ) : (
                <motion.span key="pending" exit={{ opacity: 0 }} className="label-mono text-white/30">
                  Evaluating…
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
