"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const groups = [
  {
    id: "flood",
    label: "Flood-tolerant natives",
    dot: "bg-[#7dd3fc]",
    textColor: "text-[#7dd3fc]",
    borderColor: "border-[#7dd3fc]/25",
    bg: "bg-[linear-gradient(160deg,rgba(10,30,50,0.92),rgba(7,10,9,0.97))]",
    glow: "rgba(125,211,252,0.12)",
    species: [
      { latin: "Taxodium distichum", common: "Bald Cypress" },
      { latin: "Nyssa sylvatica", common: "Black Gum" },
      { latin: "Quercus bicolor", common: "Swamp White Oak" },
      { latin: "Quercus lyrata", common: "Overcup Oak" },
    ],
  },
  {
    id: "urban",
    label: "Urban-resilient natives",
    dot: "bg-mint",
    textColor: "text-mint",
    borderColor: "border-mint/25",
    bg: "bg-[linear-gradient(160deg,rgba(10,35,25,0.92),rgba(7,10,9,0.97))]",
    glow: "rgba(136,201,161,0.12)",
    species: [
      { latin: "Celtis occidentalis", common: "Hackberry" },
      { latin: "Gymnocladus dioicus", common: "Kentucky Coffeetree" },
      { latin: "Liquidambar styraciflua", common: "Sweetgum" },
      { latin: "Quercus macrocarpa", common: "Bur Oak" },
      { latin: "Quercus muehlenbergii", common: "Chinkapin Oak" },
      { latin: "Quercus rubra", common: "Northern Red Oak" },
      { latin: "Juniperus virginiana", common: "Eastern Redcedar" },
    ],
  },
  {
    id: "diversity",
    label: "Diversity-focused additions",
    dot: "bg-[#a78bfa]",
    textColor: "text-[#a78bfa]",
    borderColor: "border-[#a78bfa]/25",
    bg: "bg-[linear-gradient(160deg,rgba(20,12,40,0.92),rgba(7,10,9,0.97))]",
    glow: "rgba(167,139,250,0.10)",
    species: [
      { latin: "Amelanchier canadensis", common: "Serviceberry" },
      { latin: "Cercis canadensis", common: "Eastern Redbud" },
    ],
  },
] as const;

export function SpeciesAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mt-10 space-y-3">
      {groups.map((g) => {
        const isOpen = open === g.id;
        return (
          <motion.div
            key={g.id}
            className={`relative overflow-hidden rounded-2xl border ${g.borderColor} ${g.bg}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {/* glow */}
            <div
              className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full blur-2xl"
              style={{ background: `radial-gradient(circle,${g.glow} 0%,transparent 70%)` }}
            />
            {/* header button */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : g.id)}
              className="relative flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${g.dot}`} />
                <span className={`font-mono text-xs uppercase tracking-[0.28em] ${g.textColor}`}>
                  {g.label}
                </span>
              </div>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <ChevronDown className={`h-4 w-4 ${g.textColor}`} />
              </motion.span>
            </button>

            {/* dropdown body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="relative border-t border-white/[0.06] px-6 pb-6 pt-4 space-y-0">
                    {g.species.map((sp, i) => (
                      <motion.li
                        key={sp.latin}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] py-3 last:border-0"
                      >
                        <p className="font-[family-name:var(--font-display)] text-base italic leading-snug text-cream">
                          {sp.latin}
                        </p>
                        <p className={`shrink-0 font-mono text-[0.65rem] ${g.textColor}/80`}>
                          {sp.common}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
