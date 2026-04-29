"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function AnimatedPercent({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const c = animate(0, value, {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = v.toFixed(1) + suffix;
      },
    });
    return () => c.stop();
  }, [value, suffix]);

  return <span ref={ref}>0.0{suffix}</span>;
}

const sparkPath =
  "M0,80 C40,75 60,20 100,45 S160,10 200,30 S260,5 300,15 S340,0 400,8";

export function ImpactVisuals() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-mint/25 bg-gradient-to-b from-[var(--glass)] to-black/20 p-6 shadow-[0_0_50px_rgba(26,48,38,0.2)] backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mint">
          20-year eco-benefit trajectory
        </p>
        <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-arch">
          S2 vs. baseline
        </p>
        <div className="relative mt-6 h-40 w-full">
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff3dd" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fff3dd" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${sparkPath} L400,100 L0,100 Z`} fill="url(#sparkFill)" />
            <motion.path
              d={sparkPath}
              fill="none"
              stroke="#fff3dd"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            {[0, 100, 200, 300, 400].map((x) => (
              <line
                key={x}
                x1={x}
                y1="0"
                x2={x}
                y2="100"
                stroke="white"
                strokeWidth="0.3"
                opacity="0.06"
              />
            ))}
          </svg>
          <div className="absolute bottom-1 left-0 right-0 flex justify-between text-[0.6rem] font-mono text-arch/35">
            <span>Y0</span>
            <span>Y5</span>
            <span>Y10</span>
            <span>Y15</span>
            <span>Y20</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-light tabular-nums text-mint">
            <AnimatedPercent value={21.4} suffix="%" />
          </span>
          <span className="text-sm text-arch/60">modeled increase under S2</span>
        </div>
      </motion.div>

      <motion.div
        className="relative overflow-hidden rounded-3xl border border-rust/20 bg-gradient-to-b from-[var(--glass)] to-rust/5 p-6 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-rust/90">
          NYC DOT streetscape studies · retail range
        </p>
        <p className="mt-1 text-2xl font-[family-name:var(--font-display)] text-arch">
          Potential sales lift
        </p>
        <div className="relative mt-8 py-2">
          <div className="h-4 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rust/40 via-rust/70 to-mint/90"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs font-mono text-arch/50">
            <span>0%</span>
            <span className="text-mint">48%</span>
            <span className="text-mint/80">172%</span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-arch/65">
          Reported range from corridor redesign contexts—local validation with BID
          sales panels tightens the band.
        </p>
        <motion.div
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-arch/55"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="h-1.5 w-12 rounded-full bg-gradient-to-r from-rust/60 to-mint" />
          Observed range · not a guarantee
        </motion.div>
      </motion.div>
    </div>
  );
}
