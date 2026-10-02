import type { ReactNode } from "react";

/** Instrument-style frame that wraps every project visual. */
export function LabFrame({
  code,
  title,
  note,
  children,
}: {
  code: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <figure className="relative flex h-full w-full flex-col border border-white/10 bg-ink-2/80">
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
        <span key={c} aria-hidden="true" className={`absolute h-3 w-3 border-ember ${c} -m-px`} />
      ))}
      <div className="label-mono flex items-center justify-between border-b border-white/10 px-4 py-3 text-white/45">
        <span>
          <span className="text-ember">{code}</span> — {title}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
          Live
        </span>
      </div>
      <div className="relative min-h-0 flex-1 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]">
        {children}
      </div>
      <figcaption className="label-mono border-t border-white/10 px-4 py-2.5 text-[0.6rem] text-white/30">{note}</figcaption>
    </figure>
  );
}
