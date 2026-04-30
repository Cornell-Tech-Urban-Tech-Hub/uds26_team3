"use client";

import { motion } from "framer-motion";
import { LineChart, ExternalLink } from "lucide-react";
import { withBasePath } from "@/lib/withBasePath";

export function LineRaceEmbed() {
  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mint/75">
            <LineChart className="h-3.5 w-3.5" />
            Interactive chart
          </p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-cream sm:text-3xl">
            S0 vs S2 — pollutant trajectories (line race)
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-cream/65">
            Apache ECharts animation: O₃, NO₂, SO₂, and PM over the modeled
            horizon. Served from your exported{" "}
            <code className="rounded bg-white/[0.08] px-1 font-mono text-xs text-mint/90">
              line-race.html
            </code>{" "}
            in <code className="rounded bg-white/[0.08] px-1 font-mono text-xs">public/</code>.
          </p>
        </div>
        <a
          href={withBasePath("/line-race.html")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm text-cream/90 transition hover:border-mint/35 hover:bg-white/[0.08]"
        >
          <ExternalLink className="h-4 w-4" />
          Open full page
        </a>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d1210] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <iframe
          title="S0 vs S2 air quality line race (ECharts)"
          src={withBasePath("/line-race.html")}
          className="h-[min(72vh,640px)] w-full border-0"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}
