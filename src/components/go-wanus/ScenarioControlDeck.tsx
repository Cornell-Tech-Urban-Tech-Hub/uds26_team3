"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

type S = "S0" | "S1" | "S2";

const defaultScenario: S = "S2";

const scenarios: { id: S; title: string; hint: string }[] = [
  { id: "S0", title: "Baseline", hint: "Current conditions" },
  { id: "S1", title: "+ Trees", hint: "Eco-sensitive zones" },
  { id: "S2", title: "Trees + walks", hint: "Full intervention" },
];

type Props = {
  scenario: S;
  onScenario: (s: S) => void;
};

export function ScenarioControlDeck({ scenario, onScenario }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {scenarios.map((s) => {
          const active = scenario === s.id;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onScenario(s.id)}
              className={`relative overflow-hidden rounded-2xl border px-4 py-2.5 text-left transition-all ${
                active
                  ? "border-mint/45 bg-white/[0.08] shadow-[0_0_28px_rgba(136,201,161,0.18)]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-mint/28 hover:bg-white/[0.06]"
              }`}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
            >
              {active && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-mint/10 to-transparent"
                  layoutId="scenario-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 font-mono text-xs ${
                  active ? "text-mint" : "text-cream/50"
                }`}
              >
                {s.id}
              </span>
              <span
                className={`relative z-10 ml-1.5 text-sm font-medium ${
                  active ? "text-cream" : "text-cream/75"
                }`}
              >
                {s.title}
              </span>
              <span className="relative z-10 ml-1 text-xs text-cream/40">
                · {s.hint}
              </span>
            </motion.button>
          );
        })}
      </div>
      <motion.button
        type="button"
        onClick={() => onScenario(defaultScenario)}
        className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border border-rust/35 bg-rust/15 px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-rust/25 sm:self-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <RotateCcw className="h-4 w-4 text-rust" strokeWidth={1.75} />
        Revert to {defaultScenario}
      </motion.button>
    </div>
  );
}
