"use client";

import { motion } from "framer-motion";

const swatches = [
  { name: "Base", hex: "#070a09", role: "page depth" },
  { name: "Cream", hex: "#e8ebe6", role: "type" },
  { name: "Ink", hex: "#1a3026", role: "surfaces" },
  { name: "Violet", hex: "#a78bfa", role: "IA · spine" },
  { name: "Mist", hex: "#7dd3fc", role: "connectors" },
  { name: "Mint", hex: "#88c9a1", role: "data & links" },
  { name: "Rust", hex: "#c45c3e", role: "economics" },
];

export function PaletteLegend() {
  return (
    <motion.div
      className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45, duration: 0.5 }}
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-cream/45">
        Palette
      </span>
      {swatches.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.05 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 backdrop-blur-sm"
        >
          <span
            className="h-7 w-7 rounded-full border border-white/15 shadow-inner"
            style={{ backgroundColor: s.hex }}
            title={s.hex}
          />
          <span className="text-xs">
            <span className="font-medium text-cream/90">{s.name}</span>
            <span className="ml-1.5 font-mono text-[0.65rem] text-cream/40">
              {s.hex}
            </span>
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
