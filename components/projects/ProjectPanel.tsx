import type { Project } from "@/data/portfolio";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { RaftVisual } from "./visuals/RaftVisual";
import { CreditVisual } from "./visuals/CreditVisual";
import { AgentsVisual } from "./visuals/AgentsVisual";
import { GuardVisual } from "./visuals/GuardVisual";
import { RagVisual } from "./visuals/RagVisual";

const visuals = { raft: RaftVisual, credit: CreditVisual, agents: AgentsVisual, guard: GuardVisual, rag: RagVisual };

export function ProjectPanel({ project, index, total }: { project: Project; index: number; total: number }) {
  const Visual = visuals[project.visual];
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className="relative grid w-full shrink-0 gap-10 border-t border-white/10 py-14 lg:h-full lg:w-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-14 lg:border-t-0 lg:px-10 lg:py-0 xl:gap-20"
    >
      {/* oversized outlined index behind the copy */}
      <span
        aria-hidden="true"
        className="display text-outline pointer-events-none absolute -top-4 right-0 select-none text-[38vw] leading-none text-white/[0.06] lg:-top-[4vh] lg:left-6 lg:right-auto lg:text-[30vw]"
      >
        {num}
      </span>

      <div className="relative flex flex-col justify-center">
        <div className="label-mono flex items-center gap-3 text-white/50">
          <span className="text-ember">P/{num}</span>
          <span className="h-px w-8 bg-white/30" />
          <span>
            {num} of {String(total).padStart(2, "0")}
          </span>
        </div>

        <h3
          id={`${project.id}-title`}
          className="display mt-6 text-[clamp(3rem,6.6vw,7.5rem)] leading-[0.98] text-white [@media(max-height:800px)]:mt-4 [@media(max-height:800px)]:text-[min(6.6vw,11svh)]"
        >
          {project.name}
        </h3>
        <p className="label-mono mt-4 text-ember">{project.category}</p>

        <div className="mt-8 max-w-xl space-y-4 text-[1.02rem] leading-relaxed text-white/70 [@media(max-height:800px)]:mt-5 [@media(max-height:800px)]:space-y-3 [@media(max-height:800px)]:text-[0.95rem]">
          {project.description.map((d) => (
            <p key={d}>{d}</p>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-7 [@media(max-height:800px)]:mt-5 [@media(max-height:800px)]:pt-5">
          {project.metrics.map((m) => (
            <p key={m.label}>
              <span className="display block text-[clamp(2.2rem,2.9vw,3.2rem)] text-white">{m.value}</span>
              <span className="label-mono mt-1 block text-white/45">{m.label}</span>
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 [@media(max-height:800px)]:mt-5">
          <ul className="flex flex-wrap gap-2" aria-label="Stack">
            {project.stack.map((s) => (
              <li key={s} className="label-mono border border-white/20 px-2 py-1 text-white/75">
                {s}
              </li>
            ))}
          </ul>
          <div className="label-mono flex gap-6 text-white">
            {project.links.map((l) => (
              <ArrowLink key={l.href} href={l.href}>
                {l.label}
              </ArrowLink>
            ))}
          </div>
        </div>
      </div>

      <div className="relative lg:my-auto lg:h-[68svh]">
        <Visual />
      </div>
    </article>
  );
}
