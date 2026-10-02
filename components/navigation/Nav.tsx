"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToHash, useLenis } from "@/components/providers/SmoothScroll";

const ease = [0.76, 0, 0.24, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    lenis?.start();
    scrollToHash(lenis, href);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] mix-blend-difference">
        <nav
          aria-label="Primary"
          className="pointer-events-auto mx-auto flex items-center justify-between px-5 py-5 text-white md:px-10 md:py-7"
        >
          <a href="#top" onClick={go("#top")} className="label-mono text-[0.75rem] font-medium tracking-[0.2em]">
            <span className="hidden sm:inline">{profile.name}</span>
            <span className="sm:hidden">{profile.firstName}</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a href={link.href} onClick={go(link.href)} className="label-mono group flex gap-2">
                  <span className="opacity-50">0{i + 1}</span>
                  <span className="link-line">{link.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resume}
                download="Hardik_Shah_Resume.pdf"
                className="label-mono flex items-center gap-1.5 border border-white/50 px-3 py-1.5 transition-colors hover:bg-white hover:text-ink"
              >
                Resume
                <ArrowDown aria-hidden="true" className="h-3 w-3" />
                <span className="sr-only">(PDF download)</span>
              </a>
            </li>
          </ul>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="label-mono flex items-center gap-2 lg:hidden"
          >
            <motion.span animate={{ rotate: open ? 45 : 0 }} className="inline-block text-base leading-none">
              +
            </motion.span>
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[65] flex flex-col justify-between bg-ink px-5 pb-8 pt-28 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden border-b border-white/10">
                  <motion.a
                    href={link.href}
                    onClick={go(link.href)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.06 }}
                    className="display flex items-baseline justify-between py-3 text-[clamp(3rem,15vw,6rem)] text-white"
                  >
                    {link.label}
                    <span className="label-mono text-ember">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="label-mono flex flex-col gap-2 text-white/60"
            >
              <a
                href={profile.resume}
                download="Hardik_Shah_Resume.pdf"
                className="mb-4 flex items-center justify-between border border-white/30 px-5 py-4 text-white"
              >
                Download resume
                <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
              <a href={`mailto:${profile.email}`} className="text-white">
                {profile.email}
              </a>
              <span>{profile.location}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
