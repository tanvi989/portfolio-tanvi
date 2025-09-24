'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Early return if container is not available
    if (!containerRef.current) return;

    class ParticleSystem {
      container: HTMLDivElement;
      particles: Particle[] = [];
      mouse: MousePosition = { x: 0, y: 0 };
      running = true;
      animationId: number | null = null;

      onMove = (e: MouseEvent): void => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      };

      constructor(container: HTMLDivElement) {
        this.container = container;
        this.init();
      }

      init(): void {
        for (let i = 0; i < 50; i++) this.createParticle();
        this.createGlowOrbs();
        document.addEventListener('mousemove', this.onMove);
        this.animate();
      }

      createParticle(): void {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const colors = ['#00d9ff', '#7c3aed', '#f43f5e'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        this.container.appendChild(particle);

        this.particles.push({
          element: particle,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size,
        });
      }

      createGlowOrbs(): void {
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

      animate = (): void => {
        if (!this.running) return;

        this.particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Boundary checks with proper bounds
          if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
          }
          if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
          }

          // Mouse interaction
          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100 && distance > 0) { // Avoid division by zero
            const force = (100 - distance) / 100;
            particle.vx -= (dx / distance) * force * 0.1;
            particle.vy -= (dy / distance) * force * 0.1;
          }

          // Apply friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Update DOM position
          particle.element.style.left = `${particle.x}px`;
          particle.element.style.top = `${particle.y}px`;
        });

        this.drawConnections();
        this.animationId = requestAnimationFrame(this.animate);
      };

      drawConnections(): void {
        // Remove existing connection lines
        const existingLines = this.container.querySelectorAll('.connection-line');
        existingLines.forEach((line) => line.remove());

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
              line.style.opacity = String(Math.max(0, 0.4 - distance / 400)); // Ensure non-negative opacity

              this.container.appendChild(line);
            }
          }
        }
      }

      destroy(): void {
        this.running = false;
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
        }
        document.removeEventListener('mousemove', this.onMove);
        this.container.innerHTML = '';
      }
    }

    const container = containerRef.current;
    const system = new ParticleSystem(container);

    return () => system.destroy();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        id="particlesContainer"
        className="fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      />
      
      <style jsx global>{`
        .particle {
          position: absolute;
          border-radius: 9999px;
          opacity: 0.7;
          box-shadow: 0 0 10px rgba(255,255,255,0.15);
          pointer-events: none;
          will-change: transform;
        }
        .connection-line {
          position: absolute;
          height: 1px;
          background: rgba(255, 255, 255, 0.04);
          transform-origin: left center;
          pointer-events: none;
          will-change: transform;
        }
        .glow-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(40px);
          mix-blend-mode: screen;
          opacity: 0.5;
          pointer-events: none;
          will-change: transform;
        }
      `}</style>
    </>
  );
}