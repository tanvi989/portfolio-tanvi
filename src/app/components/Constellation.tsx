'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    class ParticleSystem {
      container: HTMLDivElement;
      particles: {
        element: HTMLDivElement;
        x: number; y: number; vx: number; vy: number; size: number;
      }[] = [];
      mouse = { x: 0, y: 0 };
      running = true;
      onMove = (e: MouseEvent) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      };

      constructor(container: HTMLDivElement) {
        this.container = container;
        this.init();
      }

      init() {
        for (let i = 0; i < 50; i++) this.createParticle();
        this.createGlowOrbs();
        document.addEventListener('mousemove', this.onMove);
        this.animate();
      }

      createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const colors = ['#00d9ff', '#7c3aed', '#f43f5e'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;

        this.container.appendChild(particle);

        this.particles.push({
          element: particle,
          x: parseFloat(particle.style.left),
          y: parseFloat(particle.style.top),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size,
        });
      }

      createGlowOrbs() {
        for (let i = 0; i < 3; i++) {
          const orb = document.createElement('div');
          orb.className = 'glow-orb';

          const size = Math.random() * 300 + 200;
          orb.style.width = `${size}px`;
          orb.style.height = `${size}px`;

          const colors = [
            'rgba(0, 217, 255, 0.06)',  // reduced alpha
            'rgba(124, 58, 237, 0.06)',
            'rgba(244, 63, 94, 0.06)',
          ];
          orb.style.background = colors[i];

          orb.style.left = `${Math.random() * window.innerWidth}px`;
          orb.style.top = `${Math.random() * window.innerHeight}px`;

          this.container.appendChild(orb);
        }
      }

      animate() {
        if (!this.running) return;

        this.particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
          if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx -= (dx / distance) * force * 0.1;
            particle.vy -= (dy / distance) * force * 0.1;
          }

          particle.vx *= 0.99;
          particle.vy *= 0.99;

          particle.element.style.left = `${particle.x}px`;
          particle.element.style.top = `${particle.y}px`;
        });

        this.drawConnections();
        requestAnimationFrame(() => this.animate());
      }

      drawConnections() {
        this.container.querySelectorAll('.connection-line').forEach((line) => line.remove());

        for (let i = 0; i < this.particles.length; i++) {
          for (let j = i + 1; j < this.particles.length; j++) {
            const p1 = this.particles[i];
            const p2 = this.particles[j];

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const line = document.createElement('div');
              line.className = 'connection-line';

              const angle = Math.atan2(dy, dx);
              const length = distance;

              line.style.width = `${length}px`;
              line.style.left = `${p2.x}px`;
              line.style.top = `${p2.y}px`;
              line.style.transform = `rotate(${angle}rad)`;
              line.style.opacity = String(0.4 - distance / 400); // softer opacity

              this.container.appendChild(line);
            }
          }
        }
      }

      destroy() {
        this.running = false;
        document.removeEventListener('mousemove', this.onMove);
        this.container.innerHTML = '';
      }
    }

    const container = containerRef.current!;
    const system = new ParticleSystem(container);

    return () => system.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      id="particlesContainer"
      className="fixed inset-0 -z-10 overflow-hidden"
    >
      <style jsx global>{`
        .particle {
          position: absolute;
          border-radius: 9999px;
          opacity: 0.7; /* reduced dot opacity */
          box-shadow: 0 0 10px rgba(255,255,255,0.15);
          pointer-events: none;
        }
        .connection-line {
          position: absolute;
          height: 1px;
          background: rgba(255, 255, 255, 0.04); /* lighter lines */
          transform-origin: left center;
          pointer-events: none;
        }
        .glow-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(40px);
          mix-blend-mode: screen;
          opacity: 0.5; /* softer orbs */
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
