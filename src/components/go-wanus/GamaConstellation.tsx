"use client";

import { motion } from "framer-motion";
import { TramFront, Shuffle, Mountain, PersonStanding } from "lucide-react";

const personas: {
  icon: typeof TramFront;
  label: string;
  position: "top" | "right" | "bottom" | "left";
}[] = [
  { icon: TramFront, label: "Commuters", position: "top" },
  { icon: Shuffle, label: "Locals", position: "right" },
  { icon: Mountain, label: "Visitors", position: "bottom" },
  { icon: PersonStanding, label: "Joggers", position: "left" },
];

const posClass: Record<string, string> = {
  top: "left-1/2 top-0 -translate-x-1/2",
  right: "right-0 top-1/2 -translate-y-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2",
  left: "left-0 top-1/2 -translate-y-1/2",
};

export function GamaConstellation() {
  return (
    <div className="mx-auto w-full max-w-md py-8">
      <div
        className="relative mx-auto w-full"
        style={{ paddingBottom: "100%", maxWidth: "22rem" }}
      >
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full text-mint/[0.18]"
            viewBox="0 0 200 200"
            aria-hidden
            preserveAspectRatio="xMidYMid meet"
          >
            {personas.map((p) => {
              const c = 100;
              const arm = 72;
              const angles: Record<string, [number, number]> = {
                top: [0, -arm],
                right: [arm, 0],
                bottom: [0, arm],
                left: [-arm, 0],
              };
              const [ex, ey] = angles[p.position]!;
              return (
                <line
                  key={p.label}
                  x1={c}
                  y1={c}
                  x2={c + ex}
                  y2={c + ey}
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              );
            })}
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              strokeDasharray="4 8"
              opacity="0.6"
            />
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 w-[5.5rem] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="flex h-[5.5rem] w-full flex-col items-center justify-center rounded-2xl border border-mint/35 bg-gradient-to-br from-[#142018] via-forest-mid/70 to-[#0a120e] text-center shadow-[0_0_32px_rgba(0,0,0,0.45)]"
              animate={{
                boxShadow: [
                  "0 0 28px rgba(0,0,0,0.35)",
                  "0 0 44px rgba(136,201,161,0.2)",
                  "0 0 28px rgba(0,0,0,0.35)",
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-mint">
                GAMA
              </span>
              <span className="mt-0.5 text-[0.6rem] text-[#fff3dd]/50">
                agent core
              </span>
            </motion.div>
          </div>

          {personas.map((p, i) => (
            <motion.div
              key={p.label}
              className={`absolute z-30 flex w-[4.5rem] flex-col items-center ${posClass[p.position]}`}
              style={{
                maxWidth: "5.5rem",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 220 }}
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-[var(--glass)] shadow-md backdrop-blur-md sm:h-14 sm:w-14"
                whileHover={{ scale: 1.08, borderColor: "rgba(136,201,161,0.5)" }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <p.icon className="h-5 w-5 text-mint sm:h-6 sm:w-6" strokeWidth={1.25} />
              </motion.div>
              <p className="mt-1.5 w-full text-center font-mono text-[0.55rem] uppercase leading-tight tracking-wider text-[#fff3dd]/65 sm:text-[0.6rem]">
                {p.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
