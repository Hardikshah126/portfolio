"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Magnetic } from "@/components/ui/Magnetic";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";
import portrait from "@/public/images/hardik-portrait.webp";

const ease = [0.16, 1, 0.3, 1] as const;

/** Oversized word whose letters rise out of a mask, one after another. */
function GiantWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`display flex whitespace-nowrap ${className ?? ""}`}>
      {word.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.05 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Meta({ delay, className, children }: { delay: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * HARDIK set huge, with the surname and role tucked underneath.
 * Rendered twice with identical layout: the giant name shows in the copy behind
 * the portrait, the surname line in the copy in front of it.
 */
function NameBlock({ layer, x }: { layer: "back" | "front"; x?: MotionValue<string> }) {
  const front = layer === "front";
  return (
    <motion.div
      style={{ x }}
      className="pointer-events-none absolute inset-x-0 top-[8.5rem] flex justify-center lg:top-[8svh]"
    >
      <div className="inline-flex flex-col items-start">
        <GiantWord
          word={profile.firstName}
          delay={0.2}
          className={`text-[29vw] tracking-[-0.02em] text-crimson lg:text-[min(27vw,44svh)] ${
            front ? "invisible" : ""
          }`}
        />
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className={`mt-3 flex items-baseline gap-3 sm:flex-col sm:items-start sm:gap-2 lg:mt-[1.6svh] lg:flex-row lg:items-baseline lg:gap-3 ${front ? "" : "invisible"}`}
        >
          <span className="display text-[9vw] leading-none text-ink lg:text-[min(4.2vw,7svh)]">
            {profile.lastName}
          </span>
          <span className="h-px w-6 self-center bg-crimson sm:hidden lg:block lg:w-10" />
          <span className="label-mono text-[0.62rem] font-medium text-ink lg:text-[0.7rem]">
            Full Stack
            <br />
            Software Engineer
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function useHeroScroll() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (v) =>
    typeof window === "undefined" ? 0 : Math.min(v / window.innerHeight, 1),
  );
  const t = <T,>(to: [T, T], from: [number, number] = [0, 1]): MotionValue<T> | undefined =>
    // eslint-disable-next-line react-hooks/rules-of-hooks -- called a fixed number of times per render
    useTransform(p, from, to) as MotionValue<T>;

  const v = {
    bgScale: t([1, 1.08]),
    portraitY: t(["0%", "-9%"]),
    nameX: t(["0%", "-16%"]),
    tagX: t(["0%", "10%"]),
    fade: t([1, 0], [0, 0.55]),
    dim: t([0, 0.55]),
  };
  return reduce ? ({} as Partial<typeof v>) : v;
}

export function Hero() {
  const lenis = useLenis();
  const s = useHeroScroll();
  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(lenis, hash);
  };

  return (
    <section
      id="top"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="sticky top-0 h-svh min-h-[560px] overflow-hidden bg-paper text-ink outline-none"
    >
      <h1 id="hero-title" className="sr-only">
        {profile.name} — {profile.title}. AI, backend and systems. Based in {profile.location}.
      </h1>

      {/* 1 — paper background with faint editorial column rules */}
      <motion.div
        aria-hidden="true"
        style={{ scale: s.bgScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,#f4f3ef_0%,var(--color-paper)_55%,var(--color-paper-2)_100%)]" />
        <div className="absolute inset-0 grid grid-cols-4 px-5 md:px-10 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`border-l border-ink/[0.05] ${i >= 4 ? "hidden lg:block" : ""}`} />
          ))}
        </div>
      </motion.div>

      {/* 2 — giant name, behind the portrait */}
      <NameBlock layer="back" x={s.nameX} />

      {/* 3 — portrait, revealed through a rising mask */}
      <motion.div
        style={{ y: s.portraitY }}
        className="absolute bottom-0 left-1/2 aspect-[1455/1884] h-[min(70svh,140vw)] -translate-x-1/2 sm:h-[62svh] lg:h-[76svh]"
      >
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.45 }}
          className="relative h-full w-full origin-bottom"
        >
          <Image
            src={portrait}
            alt="Portrait of Hardik Shah in a black suit and glasses"
            fill
            preload
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain object-bottom"
          />
        </motion.div>
      </motion.div>

      {/* Fades out the hero as the next section rolls over it */}
      <motion.div aria-hidden="true" style={{ opacity: s.dim }} className="pointer-events-none absolute inset-0 z-30 bg-ink opacity-0" />

      {/* 4 — foreground typography layered over the portrait */}
      <motion.div style={{ opacity: s.fade }} className="absolute inset-0 z-20">
        {/* Foreground copy of the name block: only the surname line is visible, kept in front of the portrait */}
        <NameBlock layer="front" x={s.nameX} />

        {/* Tagline over the suit */}
        <motion.div
          style={{ x: s.tagX }}
          className="absolute bottom-[19svh] left-5 sm:left-10 lg:bottom-[calc(9svh+1.5rem)] lg:left-auto lg:right-10 lg:text-right"
        >
          <p aria-hidden="true" className="display text-[11.5vw] leading-[0.88] text-ember sm:text-[8vw] lg:text-[min(5.6vw,9svh)] lg:text-crimson">
            {["Engineering", "Intelligent", "Systems"].map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease, delay: 0.95 + i * 0.08 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </p>
        </motion.div>

        {/* Focus: top-left on mobile, left column on desktop */}
        <Meta delay={1.15} className="absolute left-5 top-[4.75rem] sm:left-10 lg:top-[58svh]">
          <div className="label-mono flex flex-col gap-1 text-ink">
            <span className="flex items-center gap-2 text-ink/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-crimson/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-crimson" />
              </span>
              Focus
            </span>
            <span className="font-medium">AI · Backend · Full Stack</span>
          </div>
        </Meta>

        <Meta delay={1.2} className="absolute right-5 top-[4.75rem] text-right sm:right-10 lg:top-[40svh]">
          <div className="label-mono flex flex-col items-end gap-1 text-ink">
            <span className="text-ink/50">Based in</span>
            <span className="font-medium">{profile.location}</span>
            <span className="hidden text-ink/50 lg:block">{profile.coordinates}</span>
          </div>
        </Meta>

        {/* 5 — calls to action */}
        <Meta
          delay={1.5}
          className="absolute inset-x-5 bottom-[5svh] flex items-center justify-between gap-4 pr-14 sm:inset-x-10 sm:pr-[16rem] lg:inset-x-auto lg:bottom-[6svh] lg:left-10 lg:justify-start lg:gap-8 lg:pr-0"
        >
          <Magnetic>
            <a
              href="#projects"
              onClick={go("#projects")}
              className="label-mono group flex items-center gap-3 bg-ink px-5 py-3.5 text-white transition-colors duration-300 hover:bg-crimson lg:bg-ink"
            >
              View my work
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              onClick={go("#contact")}
              className="label-mono link-line py-2 text-white sm:text-ink"
            >
              Contact me
            </a>
          </Magnetic>
        </Meta>

        {/* Sits left of the chat launcher, which is pinned to the bottom-right corner */}
        <Meta delay={1.7} className="absolute bottom-[4svh] right-[19rem] hidden lg:block">
          <a
            href="#about"
            onClick={go("#about")}
            className="label-mono flex items-center gap-2 text-ink/60 transition-colors hover:text-ink"
          >
            Scroll to explore
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
            </motion.span>
          </a>
        </Meta>
      </motion.div>
    </section>
  );
}
