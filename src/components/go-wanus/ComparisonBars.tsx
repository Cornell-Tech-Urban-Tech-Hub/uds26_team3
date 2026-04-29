"use client";

import { motion } from "framer-motion";

const rows = [
  { label: "Sidewalks damaged", gow: 50, peer: 32 },
  { label: "Hardscape stress (index)", gow: 78, peer: 45 },
  { label: "Canopy–flood alignment", gow: 28, peer: 62 },
];

export function ComparisonBars() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] via-[rgba(7,10,9,0.6)] to-black/50 p-6 shadow-[0_12px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
      <div className="shimmer-bar absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-mint/10 blur-2xl" />
      <p className="relative text-center font-mono text-[0.65rem] uppercase tracking-[0.35em] text-mint/75">
        Infrastructure stress · relative load
      </p>
      <div className="relative mt-8 space-y-8">
        {rows.map((row, i) => (
          <div key={row.label}>
            <p className="mb-3 text-xs text-arch/70">{row.label}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-[0.65rem] font-mono uppercase tracking-wider text-rust/90">
                  <span>Gowanus</span>
                  <span className="text-mint">{row.gow}%</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.08]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-rust/90 via-rust/70 to-mint shadow-[0_0_12px_rgba(196,92,62,0.25)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.gow}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-[0.65rem] font-mono uppercase tracking-wider text-arch/45">
                  <span>Peer median</span>
                  <span className="text-arch/80">{row.peer}%</span>
                </div>
                <div className="h-3.5 overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cream/15 to-cream/30"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.peer}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 + 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <motion.div
        className="relative mt-8 flex items-center justify-center gap-2 border-t border-white/5 pt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-mint shadow-[0_0_12px_rgba(136,201,161,0.5)]" />
        <p className="text-center text-xs text-arch/55">
          Wider bars = higher pressure on roots, hardscape, and maintenance
        </p>
      </motion.div>
    </div>
  );
}
