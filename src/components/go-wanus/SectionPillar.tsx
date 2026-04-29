"use client";

import { motion } from "framer-motion";

type Props = {
  step: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionPillar({ step, eyebrow, title, subtitle, className = "" }: Props) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
          <span
            className="inline-flex min-w-[2.75rem] items-center justify-center rounded-xl border border-[rgba(167,139,250,0.35)] bg-[rgba(109,40,217,0.12)] px-2.5 py-1.5 font-mono text-[0.7rem] font-semibold tabular-nums tracking-widest text-[#c4b5fd]"
            aria-hidden
          >
            {step}
          </span>
          <div
            className="hidden h-12 w-px bg-gradient-to-b from-[rgba(125,211,252,0.45)] to-transparent sm:block"
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-[#7dd3fc]/75">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-light leading-tight text-arch md:text-[2.35rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-arch/60">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
