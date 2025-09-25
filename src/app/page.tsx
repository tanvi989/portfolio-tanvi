"use client";

import { useEffect } from "react";
import ProjectsSection from "./components/ProjectsSection";
import SkillsCarousel from "./components/SkillsCarousel";
import NotesSection from "./components/NotesSection";
import Link from "next/link";
const TOP_SKILLS = [
   { name: "Machine Learning", icon: "fas fa-brain", color: "text-rose-400" }, // New
  { name: "Blockchain", icon: "fab fa-ethereum", color: "text-indigo-400" }, // N
    { name: "Next.js", icon: "fab fa-react", color: "text-slate-300" },
  { name: "React", icon: "fab fa-react", color: "text-blue-400" },
  { name: "JavaScript", icon: "fab fa-js", color: "text-yellow-400" },
  
  { name: "TypeScript", icon: "fab fa-js", color: "text-blue-500" },
  { name: "AWS", icon: "fab fa-aws", color: "text-orange-400" },
  { name: "Node.js", icon: "fab fa-node", color: "text-green-500" },
  { name: "Python", icon: "fab fa-python", color: "text-blue-300" },
];

const ALL_SKILLS = [
  ...TOP_SKILLS,
  { name: "Next.js", icon: "fab fa-react", color: "text-slate-300" }, // FA doesn't have nextjs, reuse react icon
  { name: "Tailwind CSS", icon: "fab fa-css3-alt", color: "text-cyan-400" },
  { name: "Redux", icon: "fas fa-sync-alt", color: "text-purple-400" },
  { name: "Express", icon: "fas fa-server", color: "text-emerald-400" },
  { name: "PostgreSQL", icon: "fas fa-database", color: "text-sky-400" },
  { name: "MongoDB", icon: "fas fa-leaf", color: "text-green-400" },
  { name: "Docker", icon: "fab fa-docker", color: "text-sky-500" },
  { name: "GraphQL", icon: "fas fa-project-diagram", color: "text-pink-400" },
  { name: "Git", icon: "fab fa-git-alt", color: "text-orange-500" },
  { name: "React Native", icon: "fab fa-react", color: "text-indigo-300" },
  { name: "Firebase", icon: "fas fa-fire", color: "text-amber-500" },
  { name: "HTML5", icon: "fab fa-html5", color: "text-orange-500" },
  { name: "CSS3", icon: "fab fa-css3-alt", color: "text-blue-500" },
];


export default function Home() {
  // Mouse-move 3D effect (desktop only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      if (window.innerWidth <= 768) return;
      const cards = document.querySelectorAll<HTMLElement>(".card-3d");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      cards.forEach((card) => {
        card.style.transform = `rotateY(${(x - 0.5) * 10}deg) rotateX(${(y - 0.5) * -10}deg)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    const onResize = () => {
      if (window.innerWidth > 768) return;
      document.querySelectorAll<HTMLElement>(".card-3d").forEach((c) => (c.style.transform = ""));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="pt-24 pb-16 px-6" style={{ marginTop: 28 }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="md:w-1/2 mb-12 md:mb-0 perspective">
            <div className="card-3d">
              <h1 className="text-3xl md:text-6xl font-bold mb-6 floating text-center md:text-left">
                Providing the best <span className="text-gradient">project experience</span>.
              </h1>
              <div className="mb-8 text-center md:text-left">
                <p className="text-xl md:text-2xl mb-4">Full Stack Software Engineer</p>
                <p className="text-[var(--text-secondary)]">
                  Specializing in web and mobile applications with a focus on creating exceptional user experiences.
                </p>
              </div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start">
                <Link href="/projects" className="mac-button px-6 py-3 rounded-lg font-medium w-full md:w-auto text-center">
                  View Projects
                </Link>
                <Link
                  href="/contact"
                  className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium transition w-full md:w-auto text-center"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>

          {/* Right Tech Icons (exact 6 items) */}
          <div className="md:w-1/2 flex justify-center">
         
            <SkillsCarousel title="All skills" skills={ALL_SKILLS} perPage={6} autoPlayMs={0} />
          </div>
        </div>

       {/* ==== PROJECTS (component with GSAP) ==== */}
        <ProjectsSection />
            <NotesSection />
      </div>
    </main>
  );
}
