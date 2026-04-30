"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type FeatureCollection,
  type LineFeature,
  type MapBase,
  type PointFeature,
  lineToPath,
  normalizeToEpsg4326,
  polygonToPath,
  scaleBBoxInMercator,
  translateBBoxInMercator,
  toPercent,
  useMapBase,
} from "@/lib/mapBase";
import { withBasePath } from "@/lib/withBasePath";
import { SoftWhiteMapBase } from "./SoftWhiteMapBase";

type S = "S0" | "S1" | "S2";

type ScenarioLayers = {
  treesFull: PointFeature[];
  treesNew: PointFeature[];
  streetChange: LineFeature[];
  loading: boolean;
  error: string | null;
};

function useScenarioLayers(): ScenarioLayers {
  const [state, setState] = useState<ScenarioLayers>({
    treesFull: [],
    treesNew: [],
    streetChange: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [fullRes, newRes, streetRes] = await Promise.all([
          fetch(withBasePath("/data_from_gama/bid_trees_full.geojson")),
          fetch(withBasePath("/data_from_gama/bid_trees_new.geojson")),
          fetch(withBasePath("/data_from_gama/street_change.geojson")),
        ]);
        if (!fullRes.ok || !newRes.ok || !streetRes.ok) {
          throw new Error("Failed to load scenario layers");
        }
        const fullData = normalizeToEpsg4326(
          (await fullRes.json()) as FeatureCollection
        );
        const newData = normalizeToEpsg4326(
          (await newRes.json()) as FeatureCollection
        );
        const streetData = normalizeToEpsg4326(
          (await streetRes.json()) as FeatureCollection
        );

        const treesFull = fullData.features.filter(
          (f): f is PointFeature => f.geometry?.type === "Point"
        );
        const treesNew = newData.features.filter(
          (f): f is PointFeature => f.geometry?.type === "Point"
        );
        const streetChange = streetData.features.filter(
          (f): f is LineFeature =>
            f.geometry?.type === "LineString" ||
            f.geometry?.type === "MultiLineString"
        );

        if (!cancelled) {
          setState({
            treesFull,
            treesNew,
            streetChange,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            treesFull: [],
            treesNew: [],
            streetChange: [],
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

type StreetSegment = { path: string; bucket: 0 | 1 | 2 };

const STREET_BUCKETS = [
  { stroke: "rgba(252,165,165,0.9)", width: 0.45, label: "0 – 2 ft" },
  { stroke: "rgba(124,58,237,0.92)", width: 0.55, label: "2 – 4 ft" },
  { stroke: "rgba(46,16,101,0.95)", width: 0.7, label: "> 4 ft" },
] as const;

function bucketForChange(value: number): 0 | 1 | 2 {
  if (value <= 2) return 0;
  if (value <= 4) return 1;
  return 2;
}

function buildStreetSegments(
  features: LineFeature[],
  base: MapBase
): StreetSegment[] {
  const segments: StreetSegment[] = [];
  features.forEach((feature) => {
    const value = Number(feature.properties?.st_change) || 0;
    if (value <= 0) return;
    const bucket = bucketForChange(value);
    if (feature.geometry.type === "LineString") {
      segments.push({
        path: lineToPath(
          feature.geometry.coordinates as [number, number][],
          base.bbox
        ),
        bucket,
      });
      return;
    }
    if (feature.geometry.type === "MultiLineString") {
      feature.geometry.coordinates.forEach((line) => {
        segments.push({
          path: lineToPath(line as [number, number][], base.bbox),
          bucket,
        });
      });
    }
  });
  return segments;
}

export function ScenarioMapPanel({
  scenario,
  mapFrameClassName = "",
}: {
  scenario: S;
  mapFrameClassName?: string;
}) {
  const { base, loading: baseLoading, error: baseError } = useMapBase();
  const {
    treesFull,
    treesNew,
    streetChange,
    loading: layersLoading,
    error: layersError,
  } = useScenarioLayers();

  const showS1 = scenario === "S1" || scenario === "S2";
  const showS2 = scenario === "S2";
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ xMeters: 0, yMeters: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);
  const circleYScale = 16 / 9;
  const loading = baseLoading || layersLoading;
  const error = baseError ?? layersError;
  const zoomedBaseBbox = useMemo(
    () => (base ? scaleBBoxInMercator(base.bbox, 1 / zoom) : null),
    [base, zoom]
  );
  const pointScale = Math.min(2.4, Math.max(0.7, Math.pow(zoom, 0.75)));

  const prepared = useMemo(() => {
    if (!base || !zoomedBaseBbox) return null;
    const pannedBbox = translateBBoxInMercator(
      zoomedBaseBbox,
      pan.xMeters,
      pan.yMeters
    );
    const renderBase: MapBase = { ...base, bbox: pannedBbox };
    const bidPaths = base.bidPolygons.map((polygon) =>
      polygonToPath(polygon, renderBase.bbox)
    );
    const canalPaths = base.canalPolygons.map((polygon) =>
      polygonToPath(polygon, renderBase.bbox)
    );
    const fullPoints = treesFull.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return {
        ...toPercent(lng, lat, renderBase.bbox),
        dbh: Number(feature.properties?.DBH) || 4,
      };
    });
    const newPoints = treesNew.map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return {
        ...toPercent(lng, lat, renderBase.bbox),
        dbh: Number(feature.properties?.DBH) || 4,
      };
    });
    const streetSegments = buildStreetSegments(streetChange, renderBase);
    return { bidPaths, canalPaths, fullPoints, newPoints, streetSegments, renderBase };
  }, [base, zoomedBaseBbox, treesFull, treesNew, streetChange, pan.xMeters, pan.yMeters]);

  const scenarioLabel = scenario === "S0" ? "Scenario 0" : scenario === "S1" ? "Scenario 1" : "Scenario 2";

  return (
    <div>
      <div
        className={`relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.08] bg-white shadow-[0_16px_56px_rgba(0,0,0,0.45)] ${mapFrameClassName}`}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest("[data-map-controls='true']")) return;
          if (!zoomedBaseBbox) return;
          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startPanX: pan.xMeters,
            startPanY: pan.yMeters,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current || !zoomedBaseBbox) return;
          if (event.pointerId !== dragRef.current.pointerId) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;

          const dxPx = event.clientX - dragRef.current.startX;
          const dyPx = event.clientY - dragRef.current.startY;
          const metersPerPixelX =
            ((zoomedBaseBbox.maxLng - zoomedBaseBbox.minLng) * 111319.49079327358) /
            rect.width;
          const mercMinY = Math.log(
            Math.tan((Math.PI / 4) + ((zoomedBaseBbox.minLat * Math.PI) / 180) / 2)
          );
          const mercMaxY = Math.log(
            Math.tan((Math.PI / 4) + ((zoomedBaseBbox.maxLat * Math.PI) / 180) / 2)
          );
          const metersPerPixelY = ((mercMaxY - mercMinY) * 6378137) / rect.height;

          setPan({
            xMeters: dragRef.current.startPanX - dxPx * metersPerPixelX,
            yMeters: dragRef.current.startPanY + dyPx * metersPerPixelY,
          });
        }}
        onPointerUp={(event) => {
          if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          if (dragRef.current?.pointerId === event.pointerId) {
            dragRef.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
      >
        <div className="absolute inset-0 origin-center">
          {prepared && (
            <SoftWhiteMapBase
              base={prepared.renderBase}
              title={`OSM scenario ${scenario} map`}
            />
          )}

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
                  key={`bid-${idx}`}
                  d={`${path} Z`}
                  fill="rgba(110,184,154,0.06)"
                  stroke="rgba(196,92,62,0.92)"
                  strokeWidth={0.35}
                />
              ))}

              {showS2 && (
                <g>
                  {prepared.streetSegments.map((seg, idx) => {
                    const cfg = STREET_BUCKETS[seg.bucket];
                    return (
                      <path
                        key={`sw-${idx}`}
                        d={seg.path}
                        fill="none"
                        stroke={cfg.stroke}
                        strokeWidth={cfg.width}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })}
                </g>
              )}

              {prepared.fullPoints.map((point, idx) => (
                <ellipse
                  key={`tf-${idx}`}
                  cx={point.x}
                  cy={point.y}
                  rx={0.2 * pointScale}
                  ry={0.2 * pointScale * circleYScale}
                  fill="rgba(53,116,85,0.92)"
                  stroke="rgba(226,238,230,0.85)"
                  strokeWidth={0.1}
                />
              ))}

              {showS1 && (
                <g>
                  {prepared.newPoints.map((point, idx) => (
                    <ellipse
                      key={`tn-${idx}`}
                      cx={point.x}
                      cy={point.y}
                      rx={0.2 * pointScale}
                      ry={0.2 * pointScale * circleYScale}
                      fill="rgba(225,29,72,0.95)"
                      stroke="rgba(255,228,234,0.95)"
                      strokeWidth={0.12}
                    />
                  ))}
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Legend card (top-left) */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[58%] rounded-2xl border border-black/5 bg-white/92 px-3.5 py-2.5 text-[0.7rem] text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-slate-500">
            Legend
          </p>
          <div className="mt-1.5 flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[rgb(53,116,85)] ring-1 ring-white" />
              <span className="text-slate-700">Original Trees</span>
              <span className="text-slate-400">· {treesFull.length}</span>
            </span>
            {showS1 && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-[rgb(225,29,72)] ring-1 ring-white" />
                <span className="text-slate-700">Newly Planted Trees</span>
                <span className="text-slate-400">· {treesNew.length}</span>
              </motion.span>
            )}
            {showS2 && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="mt-1 border-t border-slate-200 pt-1.5"
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-wider text-slate-500">
                  Sidewalks Change (ft)
                </p>
                <div className="mt-1 flex flex-col gap-1">
                  {STREET_BUCKETS.map((cfg, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-[3px] w-5 rounded-full"
                        style={{ background: cfg.stroke }}
                      />
                      <span className="text-slate-600">{cfg.label}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scenario badge (top-right) */}
        <div className="absolute right-3 top-3 z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={scenario}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="inline-block rounded-full border border-mint/40 bg-black/65 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-mint backdrop-blur-md"
            >
              {scenarioLabel}
            </motion.span>
          </AnimatePresence>
        </div>

        <div
          data-map-controls="true"
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/92 px-2 py-1.5 shadow-[0_6px_18px_rgba(15,23,42,0.12)] backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
            className="h-6 w-6 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:bg-slate-50"
            aria-label="Zoom out map"
          >
            -
          </button>
          <span className="min-w-[3.2rem] text-center font-mono text-[0.65rem] text-slate-600">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))))}
            className="h-6 w-6 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:bg-slate-50"
            aria-label="Zoom in map"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setPan({ xMeters: 0, yMeters: 0 })}
            className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
          >
            Center
          </button>
        </div>

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

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={scenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 text-center text-sm text-cream/75"
        >
          {{
            S0: "S0 Baseline: existing conditions, no structural changes.",
            S1: "S1 Moderate: Trees added to low-canopy region and flood-zone (red dots). Sidewalk geometry unchanged.",
            S2: "S2 Full: all S1 trees plus wider sidewalk corridors (violet) and additional canopy coverage.",
          }[scenario]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
