import type { Metadata } from "next";
import CursorReactiveBg from "../../components/CursorReactiveBg";
import Navigation from "../../components/Navigation";
import Projects from "../../components/Projects";
import Footer from "../../components/Footer";
import BackToTop from "../../components/BackToTop";

export const metadata: Metadata = {
  title: "Projects | Yelukuru Trinetra Naga Sai",
  description:
    "Live public GitHub repositories and curated projects by Yelukuru Trinetra Naga Sai.",
};

/**
 * Repository index. Reuses the homepage Projects section, which reads the
 * same five-minute-cached `/api/github` proxy — new public repositories show
 * up here without editing the portfolio.
 */
export default function ProjectsPage() {
  return (
    <main className="relative">
      <CursorReactiveBg />
      <div className="page-content relative z-10">
        <Navigation />
        <div className="pt-8">
          <Projects />
        </div>
        <Footer />
        <BackToTop />
      </div>
    </main>
  );
}
