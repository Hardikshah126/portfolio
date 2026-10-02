import { experience } from "@/data/portfolio";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Timeline } from "./Timeline";

export function Experience() {
  return (
    <section
      id="experience"
      tabIndex={-1}
      aria-labelledby="experience-title"
      className="relative px-5 py-24 outline-none md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02" label="Experience" />
            <RevealText
              as="h2"
              id="experience-title"
              lines={["The work", <span key="b" className="text-outline text-white">so far.</span>]}
              className="display mt-10 text-[clamp(3.2rem,9vw,9rem)] text-white"
            />
          </div>
          <p className="label-mono max-w-xs text-white/50 md:text-right">
            {experience.length} roles · 2025 — 2026
            <br />
            Freelance, industry and research
          </p>
        </div>

        <Timeline items={experience} />
      </div>
    </section>
  );
}
