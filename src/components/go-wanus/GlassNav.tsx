"use client";

import { useState, useEffect } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavExploreDropdown } from "./NavExploreDropdown";

const links = [
  { href: "#research", label: "Insights" },
  { href: "#scenarios", label: "Transformation" },
  { href: "#simulation", label: "Prediction" },
  { href: "#behavioral", label: "Behavioral" },
  { href: "#financials", label: "Outcome" },
  { href: "#stakeholders", label: "Consensus" },
  { href: "#reference", label: "Reference" },
];

export function GlassNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
        <nav
            className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 backdrop-blur-xl sm:px-6 ${
            scrolled
              ? "border-white/[0.12] bg-[rgba(7,10,9,0.82)]"
              : "border-white/[0.08] bg-[rgba(7,10,9,0.55)]"
          }`}
          aria-label="Primary"
        >
          <a
            href="#"
            className="group flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-tight text-cream"
          >
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-canopy text-[#0a100d] shadow-[0_0_24px_rgba(136,201,161,0.25)]"
              whileHover={{ scale: 1.05, rotate: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Leaf className="h-5 w-5" />
            </motion.span>
            <span>
              GO-Wanus
              <span className="text-mint"> Green</span>
            </span>
          </a>
          <div className="hidden items-center gap-2 md:flex">
            <NavExploreDropdown />
            <ul className="flex items-center gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-cream/85 transition hover:bg-white/[0.08] hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cream/15 text-cream md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/[0.1] bg-[rgba(7,10,9,0.92)] backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col p-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="block rounded-lg px-4 py-3 text-cream hover:bg-white/[0.08] hover:text-cream"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
