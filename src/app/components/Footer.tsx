"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const success = Math.random() > 0.3;
    setStatus(success ? "success" : "error");
    setTimeout(() => setStatus(null), 4000);
  };

  const quickLinks = [
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Policies", href: "/policies" },
  ];

  const services = [
    "Web Design & Development",
    "Digital Marketing",
    "Artificial Intelligence",
    "Information Technology",
    "Outsourcing",
  ];

  const industries = [
    "E-commerce",
    "Technology & SaaS",
    "Consulting & Corporate Services",
    "Education & Training",
    "Healthcare",
    "Interior Designers & Renovators",
    "Travel & Tourism",
    "Hospitality & FnB",
  ];

  const socials = [
    { name: "Facebook", href: "https://facebook.com/your-handle", icon: "fab fa-facebook" },
    { name: "Instagram", href: "https://instagram.com/your-handle", icon: "fab fa-instagram" },
    { name: "LinkedIn", href: "https://linkedin.com/in/your-handle", icon: "fab fa-linkedin" },
    { name: "Twitter (X)", href: "https://twitter.com/your-handle", icon: "fab fa-x-twitter" },
  ];

  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-6 gap-10">
        {/* Brand / Intro + Newsletter */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Tanvi Paradkar
          </h3>
          <p className="text-sm leading-relaxed">
            Passionate about crafting delightful user experiences and scalable
            systems. Always shipping, always learning.
          </p>

          {/* Newsletter */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-[var(--text-primary)]">
              <i className="fas fa-envelope-open-text text-[var(--accent)]" />
              Subscribe to our Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent)]"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-md hover:opacity-90"
              >
                Subscribe
              </button>
            </form>

            {/* Subscription Message */}
            {status === "success" && (
              <p className="mt-2 text-xs flex items-center gap-1 text-green-500">
                <i className="fas fa-check-circle" />
                Subscription successful!
              </p>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs flex items-center gap-1 text-red-500">
                <i className="fas fa-exclamation-circle" />
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Quicklinks */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
            <i className="fas fa-link text-[var(--accent)]" />
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, i) => (
              <li key={i} className="flex items-center gap-2 hover:text-[var(--accent)]">
                <i className="fas fa-angle-right text-xs" />
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
            <i className="fas fa-cogs text-[var(--accent)]" />
            Services
          </h4>
          <ul className="space-y-2 text-sm">
            {services.map((srv, i) => (
              <li key={i} className="flex items-center gap-2 hover:text-[var(--accent)]">
                <i className="fas fa-angle-right text-xs" />
                {srv}
              </li>
            ))}
          </ul>
        </div>

        {/* Industries */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
            <i className="fas fa-industry text-[var(--accent)]" />
            Industries
          </h4>
          <ul className="space-y-2 text-sm">
            {industries.map((ind, i) => (
              <li key={i} className="flex items-center gap-2 hover:text-[var(--accent)]">
                <i className="fas fa-angle-right text-xs" />
                {ind}
              </li>
            ))}
          </ul>
        </div>

        {/* Locations + Payments */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
            <i className="fas fa-map-marker-alt text-[var(--accent)]" />
            Locations
          </h4>
          <p className="text-sm">India</p>
          <div className="mt-3 rounded-md overflow-hidden shadow-md border border-[var(--border)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609946567!2d72.74109936479953!3d19.082197839168768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63fefaa93c7%3A0x67d6e7e0a5af2edb!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sin!4v1698848294567!5m2!1sen!2sin"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-[var(--text-primary)]">
              <i className="fas fa-credit-card text-[var(--accent)]" />
              Payments
            </h4>
            <div className="flex gap-3 mt-2 text-[var(--accent)] text-2xl">
              <i className="fab fa-cc-visa" />
              <i className="fab fa-cc-mastercard" />
              <i className="fab fa-cc-paypal" />
              <i className="fab fa-google-pay" />
              <i className="fab fa-apple-pay" />
            </div>
            <Link
              href="/pay"
              className="mt-4 inline-block px-4 py-2 bg-[var(--accent)] text-white text-sm rounded-md hover:opacity-90"
            >
              Pay Here
            </Link>
          </div>
        </div>
      </div>

      {/* Socials + Bottom bar */}
      <div className="border-t border-[var(--border)] py-6 text-center text-sm">
        <div className="flex justify-center gap-6 mb-4">
          {socials.map((social, i) => (
            <Link
              key={i}
              href={social.href}
              target="_blank"
              className="hover:opacity-80"
              aria-label={social.name}
            >
              <i className={`${social.icon} text-xl text-[var(--accent)]`} />
            </Link>
          ))}
        </div>

        <p className="text-[var(--text-secondary)]">
          © {new Date().getFullYear()} Tanvi Paradkar · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
