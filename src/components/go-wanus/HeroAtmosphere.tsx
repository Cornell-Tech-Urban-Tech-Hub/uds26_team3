"use client";

import { motion } from "framer-motion";

export function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1814] via-[#0a0f0c] to-[#050807]" />

      <motion.div
        className="mesh-blob absolute -left-[25%] top-[5%] h-[75vmin] w-[75vmin] rounded-full bg-[radial-gradient(circle,rgba(110,184,154,0.12)_0%,transparent_62%)] blur-3xl"
        animate={{ opacity: [0.4, 0.75, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="mesh-blob absolute left-[28%] top-[-8%] h-[42vmin] w-[42vmin] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.11)_0%,transparent_58%)] blur-3xl"
        animate={{ opacity: [0.2, 0.45, 0.25] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="mesh-blob absolute -right-[20%] top-[30%] h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(110,184,154,0.09)_0%,transparent_58%)] blur-3xl"
        style={{ animationDelay: "-5s" }}
        animate={{ opacity: [0.25, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-[20%] h-[45vmin] w-[45vmin] rounded-full bg-[radial-gradient(circle,rgba(196,92,62,0.07)_0%,transparent_55%)] blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 grid-animated opacity-35 mix-blend-screen" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(136,201,161,0.06) 0%, transparent 40%)",
        }}
      />

      <svg
        className="absolute bottom-0 left-0 right-0 h-[42%] w-full text-mint/20"
        preserveAspectRatio="none"
        viewBox="0 0 1200 320"
        aria-hidden
      >
        <defs>
          <linearGradient id="heroBranch" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#88c9a1" stopOpacity="0" />
            <stop offset="45%" stopColor="#88c9a1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6eb89a" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,280 Q300,200 600,240 T1200,180 L1200,320 L0,320 Z"
          fill="url(#heroBranch)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <motion.path
          d="M0,220 C200,280 400,120 600,200 S1000,140 1200,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="svg-trace"
          style={{ animationDelay: "0.3s" }}
        />
        <motion.path
          d="M0,260 C250,180 500,300 750,220 S1050,280 1200,240"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeOpacity="0.5"
          className="svg-trace"
          style={{ animationDelay: "0.8s" }}
        />
      </svg>

      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          className="float-particle absolute h-1 w-1 rounded-full bg-mint/60 shadow-[0_0_12px_rgba(136,201,161,0.35)]"
          style={{
            left: `${6 + (i * 7) % 88}%`,
            top: `${12 + (i * 9) % 58}%`,
            animationDelay: `${i * 0.35}s`,
          }}
          animate={{ opacity: [0.15, 0.55, 0.2] }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
