import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/portfolio";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { Magnetic } from "@/components/ui/Magnetic";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Hello Hardik")}`;

export function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-white/10 px-5 pb-20 pt-24 outline-none md:px-10 md:pb-28 md:pt-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="07" label="Contact" />

        <RevealText
          as="h2"
          id="contact-title"
          lines={["Let's build", "something", <span key="u" className="text-ember">useful.</span>]}
          className="display mt-10 text-[clamp(4rem,15.5vw,17rem)] text-white"
          stagger={0.1}
        />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <FadeIn className="lg:col-span-6">
            <p className="text-[clamp(1.2rem,2vw,1.75rem)] leading-[1.45] text-white/80">
              Hiring for a role, building something ambitious, or stuck on a hard backend or AI problem?
              I&apos;d like to hear about it. My inbox is open, and every message gets read.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="label-mono grid grid-cols-2 content-end gap-8 text-white/45 lg:col-span-4 lg:col-start-9">
            <p>
              Elsewhere
              <span className="mt-3 flex flex-col gap-2 text-white">
                <ArrowLink href={profile.github}>GitHub</ArrowLink>
                <ArrowLink href={profile.linkedin}>LinkedIn</ArrowLink>
              </span>
            </p>
            <p>
              Based in
              <span className="mt-3 block text-white">{profile.location}</span>
              <span className="mt-1 block">IST · UTC +05:30</span>
            </p>
          </FadeIn>
        </div>

        {/* The email itself is the call to action */}
        <FadeIn delay={0.15} className="mt-20 md:mt-28">
          <p className="label-mono flex items-center gap-3 text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            Write to me
          </p>
          <a
            href={mailto}
            data-cursor="Write"
            aria-label={`Email Hardik at ${profile.email}`}
            className="group mt-5 flex items-end justify-between gap-6 border-b border-white/15 pb-6 transition-colors duration-500 hover:border-ember md:pb-8"
          >
            <span className="break-all font-sans text-[clamp(1.6rem,6.2vw,6.5rem)] font-medium leading-none tracking-[-0.03em] text-white transition-colors duration-500 group-hover:text-ember">
              {profile.email}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-8 w-8 shrink-0 text-white/60 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember md:h-16 md:w-16"
            />
          </a>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10 flex flex-wrap items-center gap-6">
          <Magnetic strength={0.25}>
            <a
              href={mailto}
              className="label-mono group flex items-center gap-4 bg-ember px-7 py-5 text-[0.75rem] text-white transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              Start a conversation
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Magnetic>
          <ResumeButton />
        </FadeIn>
      </div>
    </section>
  );
}
