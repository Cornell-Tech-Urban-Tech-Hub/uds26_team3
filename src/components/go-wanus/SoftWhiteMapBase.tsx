"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { MapBase } from "@/lib/mapBase";

export function SoftWhiteMapBase({
  base,
  title,
}: {
  base: MapBase;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      interactive: false,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      keyboard: false,
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      map.resize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.fitBounds(
      [
        [base.bbox.minLng, base.bbox.minLat],
        [base.bbox.maxLng, base.bbox.maxLat],
      ],
      { animate: false, padding: 0 }
    );
  }, [base]);

  return (
    <>
      <div
        ref={containerRef}
        role="img"
        aria-label={title}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          filter: "grayscale(1) saturate(0.08) brightness(1.14) contrast(0.72)",
          opacity: 0.96,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/20" />
    </>
  );
}
