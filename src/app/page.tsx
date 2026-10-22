import CursorReactiveBg from "../components/CursorReactiveBg";
import Navigation from "../components/Navigation";
import ScrollProgress from "../components/ScrollProgress";
import CommandPalette from "../components/CommandPalette";
import BackToTop from "../components/BackToTop";
import HeroNew from "../components/HeroNew";
import AboutNew from "../components/AboutNew";
import SkillsNew from "../components/SkillsNew";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Certifications from "../components/Certifications";
import Achievements from "../components/Achievements";
import GitHub from "../components/GitHub";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { EXPERIENCE } from "../lib/constants";

export default function HomePage() {
  return (
    <main className="relative">
      {/* Decorative layer: fixed, pointer-events-none, painted below content. */}
      <CursorReactiveBg />

      {/*
        Content layer. A positioned wrapper with an explicit z-index guarantees
        the sections paint above the fixed background regardless of whether an
        individual section is statically positioned. Without this, the opaque
        background layer covered every non-positioned section.
      */}
      <div className="page-content relative z-10">
        <ScrollProgress />
        <Navigation />
        <HeroNew />
        <AboutNew />
        <SkillsNew />
        <Projects />
        {EXPERIENCE.length > 0 && <Experience />}
        <Education />
        <Certifications />
        <Achievements />
        <GitHub />
        <Contact />
        <Footer />
        <BackToTop />
        <CommandPalette />
      </div>
    </main>
  );
}
