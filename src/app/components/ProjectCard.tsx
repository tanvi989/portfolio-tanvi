"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ProjectCardProps = {
  title: string;
  desc: string;
  gradient: string; // e.g. "from-purple-600 to-blue-500"
  tags: string[];
  href: string;
};

export default function ProjectCard({ title, desc, gradient, tags, href }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // subtle scale on hover (GSAP), tilt handled via mouse events below
    const enter = () => gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    const leave = () => gsap.to(el, { scale: 1.0, rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = -((y / rect.height) - 0.5) * 10; // max 10deg
      const ry = ((x / rect.width) - 0.5) * 10;
      gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 800, duration: 0.2 });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <article ref={cardRef} className="mac-card mac-window rounded-xl overflow-hidden card-3d will-change-transform"  style={{ padding: '10px' }}>
      <div className="mac-window-controls">
        <div className="mac-control mac-close"></div>
        <div className="mac-control mac-minimize"></div>
        <div className="mac-control mac-maximize"></div>
      </div>
      <div className="p-6 pt-12">
        <div className={`h-32 md:h-48 bg-gradient-to-r ${gradient} rounded-lg mb-4`}></div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-[var(--text-secondary)] mb-4 text-sm">{desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-[var(--accent)] bg-opacity-20  px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
        <a href={href} className="text-[var(--accent)] hover:opacity-80 flex items-center">
          View Project <i className="fas fa-arrow-right ml-2"></i>
        </a>
      </div>
    </article>
  );
}
