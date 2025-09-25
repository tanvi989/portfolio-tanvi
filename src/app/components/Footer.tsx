"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand / Intro */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Tanvi Paradkar</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
             passionate about crafting delightful user experiences and scalable
            systems. Always shipping, always learning.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold mb-2">Quick links</h4>
          <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            About
          </Link>
          <Link href="/projects" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            Projects
          </Link>
          <Link href="/skills" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            Skills
          </Link>
          <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">
            Contact
          </Link>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold mb-2">Let’s connect</h4>
          <div className="flex gap-4 mt-2">
            <a
              href="mailto:you@example.com"
              className="hover:opacity-80"
              aria-label="Email"
            >
              <i className="fas fa-envelope text-xl text-[var(--accent)]" />
            </a>
            <a
              href="https://www.linkedin.com/in/your-handle"
              target="_blank"
              className="hover:opacity-80"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin text-xl text-[var(--accent)]" />
            </a>
            <a
              href="https://github.com/your-handle"
              target="_blank"
              className="hover:opacity-80"
              aria-label="GitHub"
            >
              <i className="fab fa-github text-xl text-[var(--accent)]" />
            </a>
            <a
              href="https://twitter.com/your-handle"
              target="_blank"
              className="hover:opacity-80"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-xl text-[var(--accent)]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--text-secondary)]">
        © {new Date().getFullYear()} Tanvi Paradkar · All rights reserved.
      </div>
    </footer>
  );
}
