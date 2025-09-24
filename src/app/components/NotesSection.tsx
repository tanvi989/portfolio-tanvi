"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NoteCard, { NoteCardProps } from "./NoteCard";

gsap.registerPlugin(ScrollTrigger);

const notes: NoteCardProps[] = [
  {
    title: "Next.js Essentials",
    desc: "Routing, data fetching (Server/Client), app router patterns, and deployment tips.",
    gradient: "from-indigo-600 to-purple-500",
    tags: ["Next.js", "SSR", "RSC"],
    pdfUrl: "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf",
  },
  {
    title: "React Patterns",
    desc: "Hooks, context, state management trade-offs, and performance gotchas.",
    gradient: "from-blue-600 to-teal-500",
    tags: ["React", "Hooks", "Patterns"],
    pdfUrl: "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf",
  },
  {
    title: "TypeScript for React",
    desc: "Props, generics, utility types, discriminated unions, and best practices.",
    gradient: "from-purple-600 to-blue-500",
    tags: ["TypeScript", "React"],
    pdfUrl: "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf",
  },
];

export default function NotesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".note-card-anim");
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
      <h2 className="text-3xl font-bold mb-12 text-center">Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {notes.map((n) => (
          <div key={n.title} className="note-card-anim">
            <NoteCard {...n} />
          </div>
        ))}
      </div>
    </section>
  );
}