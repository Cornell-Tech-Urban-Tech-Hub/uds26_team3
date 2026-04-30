"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ReactCompareSlider,
  ReactCompareSliderCssVars,
} from "react-compare-slider";
import { Columns2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type FeatureCollection,
  type MapBase,
  type PointFeature,
  normalizeToEpsg4326,
  polygonToPath,
  toPercent,
  useMapBase,
} from "@/lib/mapBase";
import { withBasePath } from "@/lib/withBasePath";
import { SoftWhiteMapBase } from "./SoftWhiteMapBase";

type TreesState = {
  trees: PointFeature[];
  loading: boolean;
  error: string | null;
};

function useTreeInventory(): TreesState {
  const [state, setState] = useState<TreesState>({
    trees: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(withBasePath("/data_from_gama/gowanus_bid_trees.geojson"));
        if (!res.ok) throw new Error("Failed to load tree data");
        const data = normalizeToEpsg4326(
          (await res.json()) as FeatureCollection
        );
        const trees = data.features.filter(
          (feature): feature is PointFeature =>
            feature.geometry?.type === "Point"
        );
        if (!cancelled) setState({ trees, loading: false, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({
            trees: [],
            loading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function sampleGreenRamp(t: number) {
  // Reversed four-band ramp: sparse = deep green, dense = light green.
  if (t < 0.25) return [18, 74, 47];
  if (t < 0.5) return [56, 130, 80];
  if (t < 0.75) return [111, 184, 110];
  return [178, 224, 168];
}

function generateHeatmapDataUrl(
  points: { x: number; y: number; weight: number }[]
) {
  const width = 960;
  const height = 540;
  const density = new Float32Array(width * height);

  points.forEach((point) => {
    const px = Math.round((point.x / 100) * (width - 1));
    const py = Math.round((point.y / 100) * (height - 1));
    const sigma = 4.5 + point.weight * 2.25;
    const radius = Math.ceil(sigma * 3);
    const sigma2 = sigma * sigma;

    for (let y = py - radius; y <= py + radius; y += 1) {
      if (y < 0 || y >= height) continue;
      const dy = y - py;
      for (let x = px - radius; x <= px + radius; x += 1) {
        if (x < 0 || x >= width) continue;
        const dx = x - px;
        const dist2 = dx * dx + dy * dy;
        if (dist2 > radius * radius) continue;
        density[y * width + x] +=
          Math.exp(-dist2 / (2 * sigma2)) * point.weight;
      }
    }
  });

  const nonZero = Array.from(density)
    .filter((value) => value > 0)
    .sort((a, b) => a - b);
  const lowCut = nonZero.length
    ? nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * 0.42))]
    : 0;
  const highCut = nonZero.length
    ? nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * 0.985))]
    : 1;

  const heatCanvas = document.createElement("canvas");
  heatCanvas.width = width;
  heatCanvas.height = height;
  const heatCtx = heatCanvas.getContext("2d");
  if (!heatCtx) return null;

  const img = heatCtx.createImageData(width, height);
  const data = img.data;

  for (let pixel = 0; pixel < density.length; pixel += 1) {
    const v = density[pixel];
    const i = pixel * 4;
    if (v < lowCut || highCut <= lowCut) {
      data[i + 3] = 0;
      continue;
    }

    const tRaw = Math.min(1, Math.max(0, (v - lowCut) / (highCut - lowCut)));
    const t = Math.pow(tRaw, 0.72);
    const [r, g, b] = sampleGreenRamp(t);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = t < 0.25 ? 54 : t < 0.5 ? 104 : t < 0.75 ? 166 : 226;
  }
  heatCtx.putImageData(img, 0, 0);
  return heatCanvas.toDataURL("image/png");
}

type Props = {
  base: MapBase | null;
  trees: PointFeature[];
  loading: boolean;
  error: string | null;
};

function BaselinePointMap({ base, trees, loading, error }: Props) {
  const circleYScale = 16 / 9;
  const prepared = useMemo(() => {
    if (!base) return null;
    const points = trees.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return {
        ...toPercent(lng, lat, base.bbox),
        dbh: Number(feature.properties?.DBH) || 4,
      };
    });
    const bidPaths = base.bidPolygons.map((polygon) =>
      polygonToPath(polygon, base.bbox)
    );
    const canalPaths = base.canalPolygons.map((polygon) =>
      polygonToPath(polygon, base.bbox)
    );
    return { points, bidPaths, canalPaths };
  }, [base, trees]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {base && prepared && <SoftWhiteMapBase base={base} title="OSM baseline map" />}
      {prepared && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {prepared.canalPaths.map((path, idx) => (
            <path
              key={`canal-${idx}`}
              d={`${path} Z`}
              fill="rgba(74,139,184,0.35)"
              stroke="rgba(43,105,159,0.82)"
              strokeWidth={0.28}
            />
          ))}
          {prepared.bidPaths.map((path, idx) => (
            <path
              key={idx}
              d={`${path} Z`}
              fill="rgba(110,184,154,0.08)"
              stroke="rgba(196,92,62,0.92)"
              strokeWidth={0.35}
            />
          ))}
          {prepared.points.map((point, idx) => (
            <ellipse
              key={idx}
              cx={point.x}
              cy={point.y}
              rx={0.2}
              ry={0.2 * circleYScale}
              fill="rgba(53,116,85,0.9)"
              stroke="rgba(226,238,230,0.85)"
              strokeWidth={0.1}
            />
          ))}
        </svg>
      )}
      {loading && (
        <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg border border-white/20 bg-black/55 px-3 py-1.5 text-xs text-cream/85 backdrop-blur-sm">
          Loading OSM + GAMA data...
        </div>
      )}
      {error && (
        <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg border border-rust/40 bg-black/70 px-3 py-1.5 text-xs text-rust">
          Data load failed: {error}
        </div>
      )}
    </div>
  );
}

function HeatmapAfterMap({ base, trees, loading, error }: Props) {
  const prepared = useMemo(() => {
    if (!base) return null;
    const points = trees.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const dbh = Number(feature.properties?.DBH) || 4;
      return {
        ...toPercent(lng, lat, base.bbox),
        weight: Math.max(0.35, Math.min(1.25, dbh / 9)),
      };
    });
    const heatOverlayUrl = generateHeatmapDataUrl(points);
    const bidPaths = base.bidPolygons.map((polygon) =>
      polygonToPath(polygon, base.bbox)
    );
    const canalPaths = base.canalPolygons.map((polygon) =>
      polygonToPath(polygon, base.bbox)
    );
    return { heatOverlayUrl, bidPaths, canalPaths };
  }, [base, trees]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {base && prepared && <SoftWhiteMapBase base={base} title="OSM heatmap base" />}
      {prepared && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {prepared.canalPaths.map((path, idx) => (
            <path
              key={`canal-${idx}`}
              d={`${path} Z`}
              fill="rgba(74,139,184,0.32)"
              stroke="rgba(43,105,159,0.82)"
              strokeWidth={0.28}
            />
          ))}
          {prepared.heatOverlayUrl && (
            <image
              href={prepared.heatOverlayUrl}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="none"
              opacity="0.95"
            />
          )}
          {prepared.bidPaths.map((path, idx) => (
            <path
              key={idx}
              d={`${path} Z`}
              fill="rgba(110,184,154,0.08)"
              stroke="rgba(196,92,62,0.92)"
              strokeWidth={0.35}
            />
          ))}
        </svg>
      )}
      {loading && (
        <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg border border-white/20 bg-black/55 px-3 py-1.5 text-xs text-cream/85 backdrop-blur-sm">
          Loading heatmap from tree points...
        </div>
      )}
      {error && (
        <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg border border-rust/40 bg-black/70 px-3 py-1.5 text-xs text-rust">
          Data load failed: {error}
        </div>
      )}
    </div>
  );
}

export function TransformationSlider() {
  const [pos, setPos] = useState(50);
  const { base, loading: baseLoading, error: baseError } = useMapBase();
  const { trees, loading: treesLoading, error: treesError } = useTreeInventory();
  const loading = baseLoading || treesLoading;
  const error = baseError ?? treesError;
  const compareKey = useMemo(
    () => `compare-${pos}-${base ? "loaded" : "empty"}`,
    [base, pos]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[#7dd3fc]/75">
            01 · Status Quo
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-cream md:text-3xl">
            Current Tree Distribution Analysis
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-arch/70">
            Compare the current BID tree inventory as point distribution and
            density heatmap layers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPos(5)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm text-cream/90 transition hover:border-mint/30 hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-4 w-4 text-[#7dd3fc]" strokeWidth={1.75} />
            Distribution
          </button>
          <button
            type="button"
            onClick={() => setPos(50)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm text-cream/90 transition hover:border-mint/30 hover:bg-white/[0.08]"
          >
            <Columns2 className="h-4 w-4 text-mint" strokeWidth={1.5} />
            Split
          </button>
          <button
            type="button"
            onClick={() => setPos(95)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-sm text-cream/90 transition hover:border-mint/30 hover:bg-white/[0.08]"
          >
            Heatmap
            <ChevronRight className="h-4 w-4 text-[#bef264]" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_16px_56px_rgba(0,0,0,0.45)]"
          style={{ [ReactCompareSliderCssVars.handleColor]: "#88c9a1" } as CSSProperties}
        >
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-[#7dd3fc]/35 bg-black/60 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-[#7dd3fc] backdrop-blur-md">
            Distribution
          </div>
          <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-[#a3e635]/35 bg-black/60 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-[#bef264] backdrop-blur-md">
            Heatmap
          </div>
          <ReactCompareSlider
            key={compareKey}
            defaultPosition={pos}
            className="aspect-[16/9] w-full max-h-[min(60vh,520px)]"
            itemOne={
              <BaselinePointMap
                base={base}
                trees={trees}
                loading={loading}
                error={error}
              />
            }
            itemTwo={
              <HeatmapAfterMap
                base={base}
                trees={trees}
                loading={loading}
                error={error}
              />
            }
          />
        </div>
        <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.25em] text-cream/35">
          Drag the handle · BID boundary uses `data_from_gama/BID_vector` · OSM basemap
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-arch/75">
          There are 876 living trees in the Gowanus BID, but they are unevenly
          distributed. Most are young and non-native, providing limited canopy
          cover for residents.
        </p>
      </div>
    </motion.div>
  );
}
