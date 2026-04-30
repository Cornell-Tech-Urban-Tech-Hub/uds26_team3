"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, ArrowRight } from "lucide-react";
import { SectionPillar } from "./SectionPillar";
import { withBasePath } from "@/lib/withBasePath";

const steps = [
  {
    id: 1,
    month: "Month 1",
    title: "GCC Technical Review",
    side: "right",
    img: null,
    href: "https://gowanuscanalconservancy.org/",
    imgContain: false,
    invertImg: false,
  },
  {
    id: 2,
    month: "Month 3",
    title: "BID Steering Consensus",
    side: "left",
    img: withBasePath("/bid-site-2.png"),
    href: "https://gowanusimprovementdistrict.org/get-involved",
    imgContain: false,
    invertImg: false,
  },
  { id: 3, month: "Month 4", title: "DOT Pilot Permitting", side: "right", img: null, href: "https://www.nyc.gov/html/dot/html/home/home.shtml", imgContain: false, invertImg: false },
  { id: 4, month: "Month 7", title: "Tree Installation", side: "left", img: withBasePath("/step-04-street.png"), href: null, imgContain: false, invertImg: false },
  { id: 5, month: "Month 9", title: "Data Collection & Feedback", side: "right", img: withBasePath("/step-05-street.png"), href: null, imgContain: false, invertImg: false },
];

export function ConsensusAction() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const active = steps.find((s) => s.id === activeStep);

  return (
    <section id="stakeholders" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionPillar
          step="06"
          eyebrow="Stakeholders & delivery"
          title="Consensus & Action"
          subtitle="A 9-month approval pipeline aligning GCC, BID, and DOT authority with on-the-ground stewardship."
        />

        <div className="mt-8 h-px bg-white/[0.06]" />

        {/* Two-column body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Left — Negotiation + Budget + Image */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-cream">
                Simulation as a Negotiation Platform
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                Our GAMA model is not just a tool; it is a common language. By
                identifying gap sites, we achieve canopy goals while respecting
                local parking needs and avoiding rigid DOT/Parks friction
                points.
              </p>
            </div>

            {/* Budget table */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mint/70">
                Estimated Budget
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-cream/70">Tree Planting</span>
                  <span className="font-mono text-cream">$580,800</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-cream/70">Sidewalk Widening</span>
                  <span className="font-mono text-cream">$250K – $420K</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-cream/50">
                    Total Capital Required
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl text-mint">
                    ~$830,000
                  </span>
                </div>
              </div>
            </div>

            {/* Panel — iframe for linked steps, photo for image steps */}
            <div className="relative flex min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-2 py-1 font-mono text-[0.55rem] uppercase tracking-wider text-white/90">
                Preview
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <AnimatePresence mode="wait">
                {active?.href && !active.img ? (
                  <motion.div
                    key={`iframe-${active.id}`}
                    className="flex w-full flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest text-mint/60">
                        {active.title}
                      </p>
                      <a
                        href={active.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[0.55rem] text-mint/50 transition hover:text-mint"
                      >
                        ↗ open
                      </a>
                    </div>
                    <iframe
                      src={active.href}
                      title={active.title}
                      className="h-64 w-full flex-1 bg-white"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </motion.div>
                ) : active?.img ? (
                  <motion.div
                    key={`img-${active.id}`}
                    className="relative flex w-full flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
                      <p className="font-mono text-[0.55rem] uppercase tracking-widest text-mint/60">
                        {active.title}
                      </p>
                      {active.href && (
                        <a
                          href={active.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[0.55rem] text-mint/50 transition hover:text-mint"
                        >
                          ↗ open
                        </a>
                      )}
                    </div>
                    <img
                      src={active.img}
                      alt={active.title}
                      className={`h-64 w-full flex-1 ${active.imgContain ? "object-contain p-4" : "object-cover object-center"} ${active.invertImg ? "invert brightness-90" : ""}`}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeStep ?? "empty"}
                    className="flex w-full flex-col items-center justify-center gap-3 p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ImageIcon className="h-8 w-8 text-cream/20" strokeWidth={1} />
                    <p className="font-mono text-[0.9rem] uppercase tracking-widest text-cream/25">
                      {active ? `${active.title} — plug in image` : "Please click any timeline step to preview"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — 9-month timeline */}
          <div>
            <p className="mb-6 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-cream/40">
              9-Month Approval Pipeline
            </p>
            <p className="mb-5 text-base font-semibold text-white">
              Click any timeline card to show its corresponding content in the
              preview panel on the left.
            </p>
            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-mint/20" />

              <div className="flex flex-col gap-6">
                {steps.map((step) => {
                  const isActive = activeStep === step.id;
                  const isLeft = step.side === "left";
                  return (
                    <div key={step.id} className="relative flex items-center">
                      {/* Left card */}
                      <div className="flex-1 pr-6">
                        {isLeft && (
                          <motion.button
                            type="button"
                            onClick={() =>
                              setActiveStep(isActive ? null : step.id)
                            }
                            className={`w-full rounded-xl border p-4 text-left transition ${
                              isActive
                                ? "border-mint/40 bg-mint/[0.08]"
                                : "border-white/[0.08] bg-white/[0.03] hover:border-mint/25 hover:bg-white/[0.06]"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-mint/60">
                              {step.month}
                            </p>
                            <p className="mt-1 text-sm font-medium text-cream">
                              {step.title}
                            </p>
                            {step.href && (
                              <p className="mt-1 font-mono text-[0.5rem] text-mint/50">
                                ↗ {step.href.replace("https://", "")}
                              </p>
                            )}
                          </motion.button>
                        )}
                      </div>

                      {/* Node */}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition ${
                          isActive
                            ? "border-mint bg-mint text-base"
                            : "border-mint/40 bg-base text-mint"
                        }`}
                      >
                        {step.id}
                      </div>

                      {/* Right card */}
                      <div className="flex-1 pl-6">
                        {!isLeft && (
                          <motion.button
                            type="button"
                            onClick={() =>
                              setActiveStep(isActive ? null : step.id)
                            }
                            className={`w-full rounded-xl border p-4 text-left transition ${
                              isActive
                                ? "border-mint/40 bg-mint/[0.08]"
                                : "border-white/[0.08] bg-white/[0.03] hover:border-mint/25 hover:bg-white/[0.06]"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-mint/60">
                              {step.month}
                            </p>
                            <p className="mt-1 text-sm font-medium text-cream">
                              {step.title}
                            </p>
                            {step.href && (
                              <p className="mt-1 font-mono text-[0.5rem] text-mint/50">
                                ↗ {step.href.replace("https://", "")}
                              </p>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
