"use client";

import { motion } from "framer-motion";

export function LingerVisualization() {
  return (
    <div className="relative flex flex-col items-center gap-8 py-6">
      <p className="max-w-xl text-center text-sm leading-relaxed text-arch/75">
        Linger models slower walking in cool, shaded frontages—translating to
        potential retail dwell.{" "}
        <span className="text-[#7dd3fc]">Cyan rings</span> = dwell field;{" "}
        <span className="text-mint">canopy glow</span> = shade weight from
        agents.
      </p>
      <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(136,201,161,0.14)_0%,transparent_58%)] blur-sm" />
        {["0s", "1s", "2s", "0.4s", "1.3s", "2.1s"].map((delay, i) => (
          <div
            key={i}
            className="linger-ring pointer-events-none absolute h-32 w-32 rounded-full border-2 border-sky-400/40 bg-sky-500/[0.06]"
            style={{ animationDelay: delay }}
          />
        ))}
        <motion.div
          className="linger-core-glow relative z-10 h-[5.5rem] w-[5.5rem] rounded-full border-2 border-mint/45 bg-gradient-to-br from-mint/25 via-forest-mid/85 to-[#1a2e24]"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute z-20 h-2.5 w-2.5 rounded-full bg-sky-200 shadow-[0_0_20px_#7dd3fc]"
          style={{ top: "38%", left: "55%" }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute z-[15] h-2 w-2 rounded-full bg-mint shadow-[0_0_12px_rgba(136,201,161,0.7)]"
          style={{ top: "62%", left: "32%" }}
          animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-full w-full rounded-full border border-dashed border-mint/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute bottom-0 z-20 flex w-full justify-center">
          <span className="rounded-full border border-white/5 bg-black/30 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-arch/45">
            Dwell window · agent-weighted shade
          </span>
        </div>
      </div>
    </div>
  );
}
