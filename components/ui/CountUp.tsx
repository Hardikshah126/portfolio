"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/** Counts from 0 to `value` once visible. Server HTML already holds the final value. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const target = Number.parseFloat(value);
  const decimals = value.includes(".") ? value.split(".")[1].length : 0;

  useEffect(() => {
    if (ref.current && !reduce && !Number.isNaN(target)) ref.current.textContent = (0).toFixed(decimals);
  }, [reduce, target, decimals]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce || Number.isNaN(target)) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, reduce, target, decimals]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
