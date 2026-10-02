import { achievements, credentials } from "@/data/portfolio";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

const kicker = ["Hackathon 9.0 · Runner-up", "LeetCode · 100 Days", "ANPR system", "60 days"];

export function Achievements() {
  return (
    <section
      id="achievements"
      tabIndex={-1}
      aria-labelledby="achievements-title"
      className="relative overflow-hidden px-5 py-24 outline-none md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="06" label="Achievements" />
        <RevealText
          as="h2"
          id="achievements-title"
          lines={["By the", <span key="n" className="text-ember">numbers.</span>]}
          className="display mt-10 text-[clamp(3.2rem,9vw,9rem)] text-white"
        />

        <ul className="mt-16 grid border-t border-white/15 sm:grid-cols-2 md:mt-24 xl:grid-cols-4">
          {achievements.map((a, i) => (
            <li
              key={a.title}
              className="group relative flex flex-col justify-between gap-10 border-b border-white/15 py-10 sm:px-6 sm:odd:border-r xl:border-r xl:last:border-r-0 xl:first:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-x-100"
              />
              <div className="label-mono flex justify-between text-white/45">
                <span className="text-ember">A/0{i + 1}</span>
                <span>{kicker[i]}</span>
              </div>
              <p>
                <span className="display block text-[clamp(4.5rem,12vw,8rem)] xl:text-[6.4vw] text-white">
                  <CountUp value={a.value} />
                  <span className="text-ember">{a.unit}</span>
                </span>
                <span className="display mt-3 block text-2xl text-white md:text-3xl">{a.title}</span>
              </p>
              <div className="space-y-4">
                <p className="text-[0.95rem] leading-relaxed text-white/60">{a.detail}</p>
                {a.link && (
                  <ArrowLink href={a.link.href} className="label-mono text-white">
                    {a.link.label}
                  </ArrowLink>
                )}
              </div>
            </li>
          ))}
        </ul>

        <FadeIn className="mt-20">
          <h3 className="label-mono text-white/50">Certifications & publication</h3>
          <ul className="mt-6">
            {credentials.map((c, i) => (
              <li
                key={c.title}
                className="group flex flex-col gap-3 border-t border-white/10 py-6 last:border-b md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-5">
                  <span className="label-mono text-ember">C/0{i + 1}</span>
                  <span className="display text-[clamp(1.5rem,3vw,2.8rem)] text-white/85 transition-colors duration-500 group-hover:text-white">
                    {c.title}
                  </span>
                </div>
                <div className="label-mono flex items-center gap-6 pl-12 text-white/45 md:pl-0">
                  <span>{c.issuer}</span>
                  {c.link && (
                    <ArrowLink href={c.link.href} className="text-white">
                      {c.link.label}
                    </ArrowLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
