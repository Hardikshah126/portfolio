import { profile } from "@/data/portfolio";
import { ArrowLink } from "@/components/ui/ArrowLink";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 px-5 pt-14 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-3">
        <div className="label-mono space-y-1 text-white">
          <p>{profile.name}</p>
          <p className="text-white/45">{profile.title}</p>
          <p className="text-white/45">{profile.location}</p>
        </div>
        <ul className="label-mono flex flex-col gap-2 text-white md:items-center">
          <li>
            <ArrowLink href={profile.github}>GitHub</ArrowLink>
          </li>
          <li>
            <ArrowLink href={profile.linkedin}>LinkedIn</ArrowLink>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} className="link-line">
              Email
            </a>
          </li>
          <li>
            <a href={profile.resume} download="Hardik_Shah_Resume.pdf" className="link-line">
              Resume (PDF)
            </a>
          </li>
        </ul>
        <div className="label-mono flex flex-col gap-1 text-white/45 md:items-end">
          <p>© 2026 {profile.name}</p>
          <p>Built with Next.js</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display mt-14 select-none whitespace-nowrap text-center text-[19vw] leading-[0.78] text-white/[0.06]"
      >
        Hardik Shah
      </p>
    </footer>
  );
}
