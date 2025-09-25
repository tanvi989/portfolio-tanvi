"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "E-Commerce Platform",
    desc: "A full-featured online shopping experience with cart functionality and payment processing.",
    tags: ["React", "Node.js", "MongoDB"],
    href: "/projects",
    images: [
      "https://img.freepik.com/free-photo/document-marketing-strategy-business-concept_53876-132231.jpg",
      "https://s3-ap-south-1.amazonaws.com/static.awfis.com/wp-content/uploads/2017/07/07184649/ProjectManagement.jpg",
      "https://thumbs.dreamstime.com/b/projects-concept-black-chalkboard-d-rendering-handwritten-top-view-office-desk-lot-business-office-supplies-79906734.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBgSdm9AGYLnfq3uZVLmdwoPTTgVjGXlzOn6vYAtoqT8nNnkJ6Dn8DqpoUoRGHLs3eQgs&usqp=CAU",
      "https://thumbs.dreamstime.com/z/conceptual-phrase-topic-business-prospect-tracking-economy-business-concept-conceptual-phrase-topic-384152229.jpg",
    ],
  },
  {
    title: "Task Management App",
    desc: "A productivity application for teams to collaborate and manage projects efficiently.",
    tags: ["TypeScript", "React", "Firebase"],
    href: "/projects",
    images: [
      "/images/tasks/1.jpg",
      "/images/tasks/2.jpg",
      "/images/tasks/3.jpg",
      "/images/tasks/4.jpg",
    ],
  },
  {
    title: "Weather Dashboard",
    desc: "Real-time weather information with interactive maps and forecasting features.",
    tags: ["JavaScript", "API", "CSS"],
    href: "/projects",
    images: [
      "/images/weather/1.jpg",
      "/images/weather/2.jpg",
      "/images/weather/3.jpg",
      "/images/weather/4.jpg",
    ],
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      });
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
