"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Compass } from "lucide-react";

const links = [
  {
    href: "#research",
    label: "Insights",
    sub: "Motivation · context · canopy gap",
  },
  {
    href: "#scenarios",
    label: "Transformation",
    sub: "Intervention · planting · S0–S2",
  },
  {
    href: "#simulation",
    label: "Prediction",
    sub: "GAMA · agent methodology",
  },
  {
    href: "#behavioral",
    label: "Behavioral Overflow",
    sub: "Pedestrian & vehicle logic flows",
  },
  {
    href: "#financials",
    label: "Outcome",
    sub: "Pollutants · dwell · retail signal",
  },
  {
    href: "#stakeholders",
    label: "Consensus & Action",
    sub: "GCC · BID · DOT · delivery",
  },
  {
    href: "#reference",
    label: "Reference",
    sub: "Websites · tools · datasets",
  },
];

export function NavExploreDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm font-medium text-cream/90 shadow-sm backdrop-blur-sm transition hover:border-mint/40 hover:bg-white/[0.08]"
      >
        <Compass className="h-4 w-4 text-mint" strokeWidth={1.5} />
        Explore
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-[60] w-72 overflow-hidden rounded-2xl border border-white/[0.1] bg-[rgba(7,10,9,0.95)] p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl"
            role="listbox"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="block rounded-xl px-3 py-2.5 text-cream transition hover:bg-mint/15"
                onClick={() => setOpen(false)}
                role="option"
              >
                <span className="font-medium">{l.label}</span>
                <span className="mt-0.5 block text-xs text-cream/50">{l.sub}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
