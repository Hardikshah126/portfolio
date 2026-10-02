import { education, profile } from "@/data/portfolio";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FloatingTags } from "./FloatingTags";

const facts = [
  { k: "Based in", v: profile.location },
  { k: "Education", v: education.short },
  { k: "Degree", v: education.degree },
  { k: "GPA", v: `${education.gpa} / ${education.gpaScale}` },
];

export function About() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-title"
      className="relative overflow-hidden px-5 pb-28 pt-24 outline-none md:px-10 md:pb-40 md:pt-36"
    >
      <FloatingTags />

      <div className="relative mx-auto max-w-[1600px]">
        <SectionLabel index="01" label="About" />

        <RevealText
          as="h2"
          id="about-title"
          lines={[
            "Building systems",
            <span key="think">
              that <span className="text-ember">think,</span>
            </span>,
            "scale & ship.",
          ]}
          className="display mt-10 text-[clamp(3.4rem,12.5vw,13rem)] text-white"
        />

        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <FadeIn className="lg:col-span-6 lg:col-start-2">
            <p className="text-[clamp(1.15rem,1.9vw,1.65rem)] leading-[1.45] text-white/85">
              {profile.about}
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <dl className="grid grid-cols-2 border-t border-white/15">
              {facts.map((f) => (
                <div key={f.k} className="border-b border-white/15 py-5 pr-4 odd:border-r odd:border-white/15 even:pl-5">
                  <dt className="label-mono text-white/45">{f.k}</dt>
                  <dd className="mt-2 text-sm font-medium uppercase tracking-wide text-white">{f.v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
