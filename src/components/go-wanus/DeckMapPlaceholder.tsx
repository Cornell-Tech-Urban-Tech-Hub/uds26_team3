"use client";

import { Map as MapIcon, Layers3 } from "lucide-react";
import { motion } from "framer-motion";

const trees = [
  { x: 12, y: 18, d: 1 },
  { x: 22, y: 42, d: 1.2 },
  { x: 38, y: 28, d: 0.9 },
  { x: 48, y: 55, d: 1.1 },
  { x: 62, y: 22, d: 1 },
  { x: 72, y: 48, d: 1.3 },
  { x: 85, y: 35, d: 0.85 },
  { x: 18, y: 68, d: 1 },
  { x: 32, y: 78, d: 1.15 },
  { x: 55, y: 72, d: 0.95 },
  { x: 78, y: 82, d: 1.2 },
  { x: 92, y: 65, d: 1 },
  { x: 8, y: 88, d: 0.8 },
  { x: 44, y: 12, d: 1.1 },
  { x: 68, y: 8, d: 0.9 },
];

export function DeckMapPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-1 shadow-[0_0_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1814] via-[#142a1f] to-[#070a09] p-6 sm:min-h-[420px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(120deg, rgba(255,243,221,0.06) 1px, transparent 1px),
              linear-gradient(30deg, rgba(255,243,221,0.04) 1px, transparent 1px)`,
            backgroundSize: "24px 24px, 24px 24px",
          }}
        />
        <motion.div
          className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-mint/10 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl">
          {trees.map((t, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_12px_rgba(136,201,161,0.6)]"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
              }}
              animate={{
                opacity: [0.4, 1, 0.5],
                scale: [0.8 * t.d, 1.15 * t.d, 0.9 * t.d],
              }}
              transition={{
                duration: 2.5 + (i % 5) * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.12,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3 pt-4 text-center sm:pt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-mint/35 bg-mint/10 text-mint shadow-[0_0_24px_rgba(136,201,161,0.15)]">
            <Layers3 className="h-7 w-7" strokeWidth={1.25} />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-mint/90">
              deck.gl · 3D layers
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#fff3dd]">
              Tree distribution map
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#fff3dd]/60">
              Placeholder: swap in ScatterplotLayer + HexagonLayer with your
              Gowanus inventory and terrain.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-[#fff3dd]/55">
            <MapIcon className="h-4 w-4 text-mint" />
            <span>@deck.gl/react + basemap</span>
          </div>
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-mint"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}
