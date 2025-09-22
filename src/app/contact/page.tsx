"use client";

import { useState } from "react";

type Status = { type: "idle" | "loading" | "success" | "error"; message?: string };

export default function ContactPage() {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", botField: "" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please use a valid email.";
    if (!form.subject.trim()) return "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10) return "Message should be at least 10 characters.";
    if (form.botField) return "Spam detected.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return setStatus({ type: "error", message: err });

    setStatus({ type: "loading" });

    try {
      // --- Option A: API route (recommended) ---
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus({ type: "success", message: "Thanks! I’ll get back to you shortly." });
      setForm({ name: "", email: "", subject: "", message: "", botField: "" });

      // --- Option B: mailto fallback (no backend) ---
      // window.location.href = `mailto:you@example.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`)}`;

    } catch (error: any) {
      setStatus({ type: "error", message: error?.message || "Something went wrong. Please try again." });
    } finally {
      setTimeout(() => setStatus({ type: "idle" }), 4000);
    }
  };

  return (
    <main className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ===== Hero / Top banner ===== */}
        <section className="mac-card rounded-2xl p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-[var(--accent)]/30 via-transparent to-[var(--accent)]/20" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
              <p className="text-[var(--text-secondary)]">
                Have an idea, a brief, or a gnarly bug? Tell me a little about it and I’ll reply asap.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/projects" className="mac-button px-6 py-3 rounded-lg font-medium whitespace-nowrap">
                View Projects
              </a>
              <a
                href="/skills"
                className="border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] px-6 py-3 rounded-lg font-medium transition whitespace-nowrap"
              >
                View Skills
              </a>
            </div>
          </div>
        </section>

        {/* ===== Info cards ===== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="mac-card rounded-xl p-6 flex items-start gap-4">
            <i className="fas fa-envelope text-2xl mt-1 text-[var(--accent)]" />
            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:you@example.com" className="text-[var(--text-secondary)] hover:underline">
                you@example.com
              </a>
            </div>
          </div>
          <div className="mac-card rounded-xl p-6 flex items-start gap-4">
            <i className="fab fa-linkedin text-2xl mt-1 text-[var(--accent)]" />
            <div>
              <div className="font-semibold">LinkedIn</div>
              <a href="https://www.linkedin.com/in/your-handle" className="text-[var(--text-secondary)] hover:underline" target="_blank">
                /in/your-handle
              </a>
            </div>
          </div>
          <div className="mac-card rounded-xl p-6 flex items-start gap-4">
            <i className="fab fa-github text-2xl mt-1 text-[var(--accent)]" />
            <div>
              <div className="font-semibold">GitHub</div>
              <a href="https://github.com/your-handle" className="text-[var(--text-secondary)] hover:underline" target="_blank">
                @your-handle
              </a>
            </div>
          </div>
        </section>

        {/* ===== Form + Sidebar ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="mac-card rounded-2xl p-6 md:p-8 space-y-4">
              {/* honeypot */}
              <input
                type="text"
                name="botField"
                value={form.botField}
                onChange={onChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    className="w-full px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="What’s this about?"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                  placeholder="Tell me about the problem, goals, scope, or timeline…"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className={`mac-button px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 ${
                    status.type === "loading" ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {status.type === "loading" ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" />
                      Send message
                    </>
                  )}
                </button>

                <p className="text-xs text-[var(--text-secondary)]">
                  By sending, you consent to be contacted about your request.
                </p>
              </div>
            </form>

            {/* toasts */}
            <div className="h-0 relative">
              {status.type === "success" && (
                <div className="fixed bottom-6 right-6 z-50 mac-card rounded-lg px-4 py-3 border border-emerald-500/40">
                  <span className="text-emerald-400 font-medium">Success:</span>{" "}
                  <span className="text-sm">{status.message}</span>
                </div>
              )}
              {status.type === "error" && (
                <div className="fixed bottom-6 right-6 z-50 mac-card rounded-lg px-4 py-3 border border-rose-500/40">
                  <span className="text-rose-400 font-medium">Error:</span>{" "}
                  <span className="text-sm">{status.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="mac-card rounded-2xl p-6 md:p-8 h-max">
            <h3 className="text-xl font-semibold mb-3">Project quick brief</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <i className="fas fa-check mt-1 text-[var(--accent)]" />
                Timeline, budget range, and success criteria help me estimate faster.
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check mt-1 text-[var(--accent)]" />
                Links to designs, repos, or docs are great.
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check mt-1 text-[var(--accent)]" />
                Preferred stack? Mention it. Otherwise I’ll propose one.
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <h4 className="font-semibold mb-2">Availability</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                Taking new projects this month. Typical response time: within 24h.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
