"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Layers, Users, Database } from "lucide-react";

const items = [
  {
    id: "gama",
    title: "Why GAMA here?",
    icon: Layers,
    body: "GAMA is an easy-to-use open source modeling and simulation environment for creating spatially explicit agent-based simulations. It allows us simulate how people and vehicles move through streets and public space. We use it here because the project must compare interventions under behaviorial and spatial constraints, where GAMA can provide scenario testing outputs with transparent, repeatable logic.",
  },
  {
    id: "personas",
    title: "Persona mix",
    icon: Users,
    body: "Commuters minimize time; locals add randomness; visitors favor canal views; joggers weight heat and air. Vehicles follow shortest path with reasonable width. Together they stress-test the trade-offs between different tree and sidewalk rules. ",
  },
  {
    id: "data",
    title: "Data & limits",
    icon: Database,
    body: "The datset that we are using includes: BID tree inventory, flood-risk layers, street and sidewalk geometry. Public unavailable datasets such as building entrance data are intentionally excluded to keep assumptions explicit. ",
  },
];

export function MethodologyAccordion() {
  const [open, setOpen] = useState<string | null>(items[0]!.id);

  return (
    <div className="mt-8 max-w-3xl space-y-2">
      <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mint/70">
        Expand for detail
      </p>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-cream transition hover:bg-white/[0.06]"
              aria-expanded={isOpen}
            >
              <item.icon className="h-5 w-5 shrink-0 text-mint" strokeWidth={1.5} />
              <span className="flex-1 font-[family-name:var(--font-display)] text-lg">
                {item.title}
              </span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-5 w-5 text-cream/50" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="border-t border-white/[0.06] px-4 pb-4 pl-12 pr-4 text-sm leading-relaxed text-cream/70">
                    {item.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
