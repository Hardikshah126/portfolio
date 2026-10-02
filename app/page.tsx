import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/skills/Skills";
import { Education } from "@/components/education/Education";
import { Achievements } from "@/components/achievements/Achievements";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        {/* Everything after the hero slides up over it */}
        <div className="relative z-10 bg-ink shadow-[0_-40px_80px_rgba(0,0,0,0.35)]">
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Achievements />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
