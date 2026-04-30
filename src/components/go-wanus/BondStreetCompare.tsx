"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderCssVars,
  styleFitContainer,
} from "react-compare-slider";
import { MapPin, Sparkles } from "lucide-react";
import { withBasePath } from "@/lib/withBasePath";

const BEFORE = withBasePath("/sidewalk_before.png");
const AFTER_IMG = withBasePath("/sidewalk.png");

export function BondStreetCompare() {
  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-3">
        <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mint/75">
          <MapPin className="h-3.5 w-3.5" />
          245 Bond Street, Gowanus
        </p>
        {/* <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-cream/80">
          What Can a Green Future Bring?
        </p> */}
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black/35 shadow-[0_12px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        style={
          {
            [ReactCompareSliderCssVars.handleColor]: "#88c9a1",
          } as CSSProperties
        }
      >
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-black/55 px-2.5 py-1 text-[0.6rem] font-mono uppercase tracking-wider text-cream/85 backdrop-blur-md">
          Before
        </div>
        <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-mint/30 bg-black/55 px-2.5 py-1 text-[0.6rem] font-mono uppercase tracking-wider text-cream backdrop-blur-md">
          <Sparkles className="h-3 w-3" />
          After
        </div>

        <ReactCompareSlider
          className="aspect-[16/10] w-full max-h-[min(58vh,480px)]"
          defaultPosition={52}
          itemOne={
            <ReactCompareSliderImage
              src={BEFORE}
              alt="245 Bond Street today — Street View still"
              style={styleFitContainer({ objectPosition: "center" })}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={AFTER_IMG}
              alt="Reimagined Bond Street with enhanced greenery"
              style={styleFitContainer({ objectPosition: "center" })}
            />
          }
        />
      </div>

      <p className="mt-3 text-center text-xs text-cream/40">
        After: sidewalk design rendering
      </p>
    </motion.div>
  );
}
