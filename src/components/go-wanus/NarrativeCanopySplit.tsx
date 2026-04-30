"use client";

import { motion } from "framer-motion";
import { TreeDeciduous, XCircle, TrendingUp, Car, Leaf } from "lucide-react";
import { withBasePath } from "@/lib/withBasePath";

const ease = [0.22, 1, 0.36, 1] as const;

export function NarrativeCanopySplit() {
  return (
    <motion.div
      className="relative mt-14 overflow-hidden rounded-[2rem] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-10 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(167,139,250,0.5)] via-[rgba(125,211,252,0.25)] to-transparent md:block"
        aria-hidden
      />
      <div className="grid md:grid-cols-2">
        {/* Problem band — warm, muted (infographic left) */}
        <div className="relative bg-gradient-to-br from-[#2a2319] via-[#1a1610] to-[#0d0c0a] px-6 py-10 md:rounded-l-[2rem] md:py-12 md:pr-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(214,180,120,0.25)] bg-[rgba(45,38,28,0.6)] px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[#d4b896]/90">
              <XCircle className="h-3 w-3 text-[#c45c3e]" strokeWidth={2} />
              The gap
            </p>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-light leading-tight text-[#ebe4d8] md:text-3xl">
              Ecological Pressure
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9bfb0]/85">
              Street trees in Gowanus are characterized as young, sparse, and low in
              diversity. Narrow sidewalk design not only limits tree growth, but
              also damages nearly 50% of tree-adjacent sidewalks.
            </p>
            <div className="mt-8 space-y-5">
              <figure className="mx-auto w-full max-w-[26rem] overflow-hidden rounded-2xl border border-[#d4b896]/20 bg-black/25">
                <img
                  src={withBasePath("/insights-gowanus-map-2.png")}
                  alt="Gowanus context map showing surrounding neighborhoods and block-level canopy pattern"
                  className="aspect-[4/3] h-auto w-full object-cover object-center"
                  loading="lazy"
                />
              </figure>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "35%", label: "Trees under 6\" DBH" },
                  { value: "36%", label: "Native species only" },
                  { value: "~50%", label: "Sidewalks under 10 ft" },
                  { value: "15%", label: "Moderate flood risk zone" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-[#d4b896]/15 bg-black/20 px-3 py-2.5">
                    <p className="font-[family-name:var(--font-display)] text-lg text-[#c45c3e]">{s.value}</p>
                    <p className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-[#c9bfb0]/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Solution band — mint lift (infographic right) */}
        <div className="relative border-t border-white/[0.06] bg-gradient-to-br from-[#0c1812] via-[rgba(17,40,28,0.95)] to-[#070a09] px-6 py-10 md:border-l md:border-t-0 md:rounded-r-[2rem] md:py-12 md:pl-10">
          <div className="pointer-events-none absolute -right-20 top-1/2 h-[min(80%,420px)] w-[min(80%,420px)] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(136,201,161,0.14)_0%,transparent_65%)] blur-2xl" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mint">
              <Leaf className="h-3 w-3" strokeWidth={2} />
              The Future
            </p>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-light leading-tight text-cream md:text-3xl">
              Resilient &amp; Livable Streetscape
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-arch/75">
              The intervention targets streets under the most ecological pressure
              by adding ~176 trees in areas with low canopy and highest
              stormwater flood risk, and widening high-conflict corridors to
              support tree growth.
              <br /><br />
              The redesigned streetscape creates a safer, more comfortable
              pedestrian experience, encouraging longer dwell time and stronger
              local retail activity.
              <br /><br />
              Narrowed roadways reduce vehicle accessibility within the
              community, lowering gas emissions and improving pedestrian
              friendliness.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-mint/20 bg-black/25 p-4">
                <TrendingUp className="h-4 w-4 text-rust" strokeWidth={1.75} />
                <p className="mt-2 font-[family-name:var(--font-display)] text-2xl tabular-nums text-rust md:text-3xl">
                  48–172%
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-arch/55">
                  Retail range (lit. streetscape)
                </p>
              </div>
              <div className="rounded-xl border border-mint/20 bg-black/25 p-4">
                <Leaf className="h-4 w-4 text-mint" strokeWidth={1.75} />
                <p className="mt-2 font-mono text-2xl tabular-nums text-mint md:text-3xl">
                  +83.1%
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-arch/55">
                  Pedestrian dwell (vs. S0)
                </p>
              </div>
              <div className="rounded-xl border border-mint/20 bg-black/25 p-4">
                <TreeDeciduous className="h-4 w-4 text-mint" strokeWidth={1.75} />
                <p className="mt-2 font-mono text-2xl tabular-nums text-mint md:text-3xl">
                  +13.8%
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-arch/55">
                  Ecological benefit signal
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                <Car className="h-4 w-4 text-arch/45" strokeWidth={1.5} />
                <p className="mt-2 font-mono text-2xl tabular-nums text-arch/70 md:text-3xl">
                  −10.7%
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-arch/50">
                  Vehicle trips — explicit trade-off
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
