import { skills } from "@/data/portfolio";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SkillRow } from "./SkillRow";

export function Skills() {
  return (
    <section
      id="skills"
      tabIndex={-1}
      aria-labelledby="skills-title"
      className="relative px-5 py-24 outline-none md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="04" label="Skills" />
            <RevealText
              as="h2"
              id="skills-title"
              lines={["The toolkit."]}
              className="display mt-10 text-[clamp(3.2rem,9vw,9rem)] text-white"
            />
          </div>
          <p className="label-mono max-w-xs text-white/50 md:text-right">Hover to inspect · from the resume, nothing more</p>
        </div>

        <div className="mt-16 md:mt-24">
          {skills.map((group, i) => (
            <SkillRow key={group.id} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
