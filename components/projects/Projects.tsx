import { projects } from "@/data/portfolio";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HorizontalTrack } from "./HorizontalTrack";
import { ProjectPanel } from "./ProjectPanel";

export function Projects() {
  return (
    <section id="projects" tabIndex={-1} aria-labelledby="projects-title" className="relative outline-none">
      <HorizontalTrack
        count={projects.length}
        header={
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionLabel index="03" label="Selected work" />
              <h2 id="projects-title" className="display mt-6 text-[clamp(2.6rem,6vw,5.5rem)] text-white lg:sr-only">
                Selected work
              </h2>
            </div>
          </div>
        }
      >
        {projects.map((p, i) => (
          <ProjectPanel key={p.id} project={p} index={i} total={projects.length} />
        ))}
      </HorizontalTrack>
    </section>
  );
}
