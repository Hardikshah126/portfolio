import { ArrowDown } from "lucide-react";
import { profile } from "@/data/portfolio";

/** Downloads the resume PDF. `variant` matches the surface it sits on. */
export function ResumeButton({
  variant = "outline",
  className = "",
}: {
  variant?: "outline" | "text";
  className?: string;
}) {
  const styles =
    variant === "outline"
      ? "border border-white/30 px-6 py-4 text-white hover:border-white hover:bg-white hover:text-ink"
      : "py-1";

  return (
    <a
      href={profile.resume}
      download="Hardik_Shah_Resume.pdf"
      data-cursor="PDF"
      className={`label-mono group inline-flex items-center gap-3 transition-colors duration-300 ${styles} ${className}`}
    >
      <span className={variant === "text" ? "link-line" : ""}>Download resume</span>
      <ArrowDown
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
      />
      <span className="sr-only">(PDF)</span>
    </a>
  );
}
