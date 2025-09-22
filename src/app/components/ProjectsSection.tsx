"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "A full-featured online shopping experience with cart functionality and payment processing.",
    gradient: "from-purple-600 to-blue-500",
    tags: ["React", "Node.js", "MongoDB"],
    href: "/projects",
  },
  {
    title: "Task Management App",
    desc: "A productivity application for teams to collaborate and manage projects efficiently.",
    gradient: "from-blue-600 to-teal-500",
    tags: ["TypeScript", "React", "Firebase"],
    href: "/projects",
  },
  {
    title: "Weather Dashboard",
    desc: "Real-time weather information with interactive maps and forecasting features.",
    gradient: "from-indigo-600 to-purple-500",
    tags: ["JavaScript", "API", "CSS"],
    href: "/projects",
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // fade-up + stagger when section enters viewport
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card-anim");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      } as any);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mt-24" ref={containerRef}>
      <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div key={p.title} className="project-card-anim">
            <ProjectCard {...p} />
          </div>
        ))}
      </div>
    </section>
  );
}
