"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    href: "#research",
    label: "Insights",
    sub: "Motivation & context",
    n: "01",
  },
  {
    href: "#transformation",
    label: "Transformation",
    sub: "Intervention & planting",
    n: "02",
  },
  {
    href: "#simulation",
    label: "Prediction",
    sub: "GAMA methodology",
    n: "03",
  },
  {
    href: "#behavioral",
    label: "Behavioral",
    sub: "Agent overflow",
    n: "04",
  },
  {
    href: "#financials",
    label: "Outcome",
    sub: "Env & economy",
    n: "05",
  },
  {
    href: "#stakeholders",
    label: "Consensus",
    sub: "Coalition & action",
    n: "06",
  },
] as const;

export function MindMapResearchSpine() {
  return (
    <div className="relative z-20 border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(7,10,9,0.92)_0%,rgba(12,18,16,0.96)_100%)] px-4 py-6 backdrop-blur-md sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(125,211,252,0.2)] to-transparent md:block" />
      <p className="mb-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.45em] text-[#a78bfa]/90">
        Research spine
      </p>
      <nav
        className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-6 md:gap-2 md:overflow-visible md:pb-0"
        aria-label="Research sections"
      >
        {pillars.map((p, i) => (
          <motion.a
            key={p.href}
            href={p.href}
            className="group relative flex min-w-[9.5rem] shrink-0 snap-start flex-col rounded-2xl border border-[rgba(139,92,246,0.22)] bg-[linear-gradient(145deg,rgba(76,29,149,0.18)_0%,rgba(7,10,9,0.85)_55%)] px-3 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition hover:border-[rgba(136,201,161,0.35)] hover:shadow-[0_12px_40px_rgba(109,40,217,0.15)] md:min-w-0"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 * i, duration: 0.4 }}
          >
            <span className="font-mono text-[0.55rem] tabular-nums text-[#7dd3fc]/80">
              {p.n}
            </span>
            <span className="mt-1 font-[family-name:var(--font-display)] text-base leading-tight text-cream">
              {p.label}
            </span>
            <span className="mt-1 text-[0.65rem] leading-snug text-arch/55">
              {p.sub}
            </span>
          </motion.a>
        ))}
      </nav>
    </div>
  );
}
