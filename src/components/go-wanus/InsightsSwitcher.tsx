"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { withBasePath } from "@/lib/withBasePath";

type InsightKey = "gap" | "forest" | "friction" | "deficit";

type InsightImage = { src: string; caption: string };

type Insight = {
  id: string;
  key: InsightKey;
  title: string;
  desc: string;
  images: InsightImage[];
};

const insights: Insight[] = [
  {
    id: "01",
    key: "gap",
    title: "Redevelopment Gap",
    desc: "Gowanus is transforming to mixed-use, but private development does not automatically generate public shade or walkable comfort.",
    images: [
      {
        src: withBasePath("/insight-01-construction.png"),
        caption: "Many developments are taking place in Gowanus. However, most of these projects are driven by revenue generation rather than community welfare and resilience.",
      },
      {
        src: withBasePath("/insight-01-street.png"),
        caption: "The left side of the street, where a private apartment is located, features well-maintained greenery, while the public streetscape on the right remains largely bare. This contrast demonstrates that community greening requires a systematic plan.",
      },
    ],
  },
  {
    id: "02",
    key: "forest",
    title: "Young Urban Forest",
    desc: "Street trees are largely young, low-diversity, and frequently non-native, which limits long-term canopy resilience.",
    images: [
      {
        src: withBasePath("/insight-02-tree.png"),
        caption: "This is a typical young street tree in Gowanus: small, fragile, and enclosed within a tree guard. While the guard seems to protect the tree, it reflects a workaround for poor sidewalk tree bed planning rather than a true solution.",
      },
    ],
  },
  {
    id: "03",
    key: "friction",
    title: "Sidewalk Friction",
    desc: "Legacy tree bed sizing and hardscape geometry create root conflict, pavement damage, and pedestrian discomfort.",
    images: [
      {
        src: withBasePath("/insight-03-sidewalk.png"),
        caption: "Small tree pits and narrow sidewalks force roots to push against pavement, causing damage and making walking less comfortable. The mismatch between historic planning and current greening goals left many trees with severely limited space to grow.",
      },
    ],
  },
  {
    id: "04",
    key: "deficit",
    title: "Structural Deficit",
    desc: "Volunteer planting helps, but without municipal coordination and maintenance structure, impacts are fragmented.",
    images: [
      {
        src: withBasePath("/insight-04-community.png"),
        caption: "The Tree Network, led by the Gowanus Canal Conservancy, regularly recruits volunteers for tree planting, but limited funding keeps the overall impact modest.",
      },
    ],
  },
];

function VisualPanel({ item }: { item: Insight }) {
  const [activeImg, setActiveImg] = useState<number | null>(null);

  if (item.images.length === 0) {
    return (
      <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[#a78bfa]/20 bg-black/20 text-center">
        <ImageIcon className="h-8 w-8 text-mint/90" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.23em] text-mint/90">
          Image coming for {item.id}
        </p>
      </div>
    );
  }

  const caption = activeImg !== null ? item.images[activeImg]?.caption : null;

  return (
    <div className="flex h-full min-h-[400px] flex-col gap-3">
      {item.images.map((img, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setActiveImg(activeImg === i ? null : i)}
          className={`relative flex-1 overflow-hidden rounded-2xl border-2 transition ${
            activeImg === i
              ? "border-mint/50 shadow-[0_0_20px_rgba(136,201,161,0.2)]"
              : "border-transparent hover:border-mint/25"
          }`}
        >
          <img
            src={img.src}
            alt={`${item.title} ${i + 1}`}
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 transition ${activeImg === i ? "bg-black/10" : "bg-transparent"}`} />
          <div className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 font-mono text-[0.8rem] uppercase tracking-widest text-cream/60 backdrop-blur-sm">
            {activeImg === i ? "click to hide" : "click for caption"}
          </div>
        </button>
      ))}

      <AnimatePresence>
        {caption && (
          <motion.p
            key={activeImg}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-mint/15 bg-black/30 px-4 py-3 text-sm leading-relaxed text-cream/80"
          >
            {caption}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InsightsSwitcher() {
  const [active, setActive] = useState<InsightKey>(insights[0].key);
  const current = insights.find((item) => item.key === active) ?? insights[0];

  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.05fr]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[#7dd3fc]/20 bg-[linear-gradient(160deg,rgba(8,34,31,0.9)_0%,rgba(7,10,9,0.95)_70%)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="relative h-full">
            <VisualPanel item={current} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-4">
        {insights.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                isActive
                  ? "border-mint/35 bg-[linear-gradient(140deg,rgba(16,64,55,0.35)_0%,rgba(8,22,19,0.95)_85%)] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                  : "border-white/[0.07] bg-white/[0.03] hover:border-[#7dd3fc]/25 hover:bg-white/[0.05]"
              }`}
            >
              <p className="font-mono text-sm text-mint">{item.id}</p>
              <h4 className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-none text-cream">
                {item.title}
              </h4>
              <p className="mt-3 text-base leading-relaxed text-cream/90">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
