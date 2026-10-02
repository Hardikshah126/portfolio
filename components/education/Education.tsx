import { education } from "@/data/portfolio";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Education() {
  return (
    <section
      id="education"
      tabIndex={-1}
      aria-labelledby="education-title"
      className="relative bg-paper px-5 py-24 text-ink outline-none md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="05" label="Education" tone="light" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RevealText
              as="h2"
              id="education-title"
              lines={["SRM Institute of", "Science and", "Technology"]}
              className="display text-[clamp(2.8rem,7.6vw,8rem)]"
            />
            <FadeIn delay={0.2} className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
              <p>
                <span className="label-mono block text-ink/50">Degree</span>
                <span className="mt-1 block text-lg font-medium">{education.degree}</span>
              </p>
              <p>
                <span className="label-mono block text-ink/50">Period</span>
                <span className="mt-1 block text-lg font-medium">{education.period}</span>
              </p>
              <p>
                <span className="label-mono block text-ink/50">Campus</span>
                <span className="mt-1 block text-lg font-medium">{education.location}, India</span>
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.1} className="flex flex-col justify-between gap-12 lg:col-span-4">
            <p className="flex items-end gap-3 border-b border-ink/15 pb-6">
              <span className="display text-[clamp(5rem,10vw,9.5rem)] text-crimson">{education.gpa}</span>
              <span className="label-mono mb-4 text-ink/60">
                / {education.gpaScale}
                <br />
                GPA
              </span>
            </p>
            <div>
              <h3 className="label-mono text-ink/50">Relevant coursework</h3>
              <ol className="mt-4">
                {education.coursework.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-4 border-t border-ink/10 py-3 text-[0.98rem] font-medium">
                    <span className="label-mono text-crimson">0{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
