"use client";

import { useEffect, useState } from "react";
import { dissolve, flatten } from "@turf/turf";
import { withBasePath } from "@/lib/withBasePath";

export type Geometry = GeoJSON.Geometry;
export type Feature = GeoJSON.Feature<Geometry>;
export type FeatureCollection = GeoJSON.FeatureCollection<Geometry>;
export type PointFeature = GeoJSON.Feature<GeoJSON.Point>;
export type LineFeature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>;

export type BBox = {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export type MapBase = {
  bbox: BBox;
  bidPolygons: [number, number][][];
  canalPolygons: [number, number][][];
  osmEmbedUrl: string;
};

export type MapBaseState = {
  base: MapBase | null;
  loading: boolean;
  error: string | null;
};

type GeoJsonCrs = {
  type?: string;
  properties?: { name?: string };
};

type FeatureCollectionWithCrs = FeatureCollection & {
  crs?: GeoJsonCrs;
};

const WEB_MERCATOR_MAX_LAT = 85.05112878;
const WEB_MERCATOR_RADIUS = 6378137;
const MAP_VIEW_ASPECT_RATIO = 16 / 9;
const MAP_CONTEXT_EXPANSION = 1.28;

function latToMercatorY(lat: number) {
  const clamped = Math.max(
    -WEB_MERCATOR_MAX_LAT,
    Math.min(WEB_MERCATOR_MAX_LAT, lat)
  );
  const rad = (clamped * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

export function toPercent(lng: number, lat: number, bbox: BBox) {
  const x = ((lng - bbox.minLng) / (bbox.maxLng - bbox.minLng || 1)) * 100;
  const mercatorMinY = latToMercatorY(bbox.minLat);
  const mercatorMaxY = latToMercatorY(bbox.maxLat);
  const mercatorY = latToMercatorY(lat);
  const y =
    (1 - (mercatorY - mercatorMinY) / (mercatorMaxY - mercatorMinY || 1)) * 100;
  return { x, y };
}

export function polygonToPath(polygon: [number, number][], bbox: BBox) {
  if (polygon.length === 0) return "";
  return polygon
    .map(([lng, lat], i) => {
      const { x, y } = toPercent(lng, lat, bbox);
      return `${i === 0 ? "M" : "L"}${x.toFixed(3)} ${y.toFixed(3)}`;
    })
    .join(" ");
}

export function lineToPath(line: [number, number][], bbox: BBox) {
  return polygonToPath(line, bbox);
}

function mercatorToLngLat(x: number, y: number): [number, number] {
  const lng = (x * 180) / (Math.PI * WEB_MERCATOR_RADIUS);
  const lat =
    (Math.atan(Math.sinh(y / WEB_MERCATOR_RADIUS)) * 180) / Math.PI;
  return [lng, lat];
}

function lngToMercatorX(lng: number): number {
  return (lng * Math.PI * WEB_MERCATOR_RADIUS) / 180;
}

function latToMercatorMetersY(lat: number): number {
  return latToMercatorY(lat) * WEB_MERCATOR_RADIUS;
}

function mercatorYToLat(y: number): number {
  return (Math.atan(Math.sinh(y / WEB_MERCATOR_RADIUS)) * 180) / Math.PI;
}

function expandBBoxForContext(bbox: BBox, factor: number): BBox {
  const cx = (lngToMercatorX(bbox.minLng) + lngToMercatorX(bbox.maxLng)) / 2;
  const cy = (latToMercatorMetersY(bbox.minLat) + latToMercatorMetersY(bbox.maxLat)) / 2;
  const halfW = ((lngToMercatorX(bbox.maxLng) - lngToMercatorX(bbox.minLng)) / 2) * factor;
  const halfH =
    ((latToMercatorMetersY(bbox.maxLat) - latToMercatorMetersY(bbox.minLat)) / 2) *
    factor;

  return {
    minLng: ((cx - halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    maxLng: ((cx + halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    minLat: mercatorYToLat(cy - halfH),
    maxLat: mercatorYToLat(cy + halfH),
  };
}

function fitBBoxToAspectRatio(bbox: BBox, targetAspect: number): BBox {
  const minX = lngToMercatorX(bbox.minLng);
  const maxX = lngToMercatorX(bbox.maxLng);
  const minY = latToMercatorMetersY(bbox.minLat);
  const maxY = latToMercatorMetersY(bbox.maxLat);
  const width = Math.max(1e-9, maxX - minX);
  const height = Math.max(1e-9, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const currentAspect = width / height;

  let halfW = width / 2;
  let halfH = height / 2;
  if (currentAspect < targetAspect) {
    halfW = (height * targetAspect) / 2;
  } else {
    halfH = width / targetAspect / 2;
  }

  return {
    minLng: ((cx - halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    maxLng: ((cx + halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    minLat: mercatorYToLat(cy - halfH),
    maxLat: mercatorYToLat(cy + halfH),
  };
}

export function scaleBBoxInMercator(bbox: BBox, factor: number): BBox {
  const minX = lngToMercatorX(bbox.minLng);
  const maxX = lngToMercatorX(bbox.maxLng);
  const minY = latToMercatorMetersY(bbox.minLat);
  const maxY = latToMercatorMetersY(bbox.maxLat);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const halfW = ((maxX - minX) / 2) * factor;
  const halfH = ((maxY - minY) / 2) * factor;

  return {
    minLng: ((cx - halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    maxLng: ((cx + halfW) * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    minLat: mercatorYToLat(cy - halfH),
    maxLat: mercatorYToLat(cy + halfH),
  };
}

export function translateBBoxInMercator(
  bbox: BBox,
  dxMeters: number,
  dyMeters: number
): BBox {
  const minX = lngToMercatorX(bbox.minLng) + dxMeters;
  const maxX = lngToMercatorX(bbox.maxLng) + dxMeters;
  const minY = latToMercatorMetersY(bbox.minLat) + dyMeters;
  const maxY = latToMercatorMetersY(bbox.maxLat) + dyMeters;

  return {
    minLng: (minX * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    maxLng: (maxX * 180) / (Math.PI * WEB_MERCATOR_RADIUS),
    minLat: mercatorYToLat(minY),
    maxLat: mercatorYToLat(maxY),
  };
}

function transformCoordinatesTo4326(
  coordinates: unknown,
  fromEpsg3857: boolean
): unknown {
  if (!fromEpsg3857) return coordinates;
  if (!Array.isArray(coordinates)) return coordinates;

  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    const [x, y] = coordinates as [number, number];
    const [lng, lat] = mercatorToLngLat(x, y);
    const rest = (coordinates as number[]).slice(2);
    return [lng, lat, ...rest];
  }

  return coordinates.map((nested) =>
    transformCoordinatesTo4326(nested, fromEpsg3857)
  );
}

function detectEpsg3857ByRange(fc: FeatureCollection): boolean {
  for (const feature of fc.features) {
    const geom = feature.geometry;
    if (!geom || geom.type === "GeometryCollection") continue;
    const stack: unknown[] = [geom.coordinates];
    while (stack.length) {
      const cur = stack.pop();
      if (!Array.isArray(cur)) continue;
      if (
        cur.length >= 2 &&
        typeof cur[0] === "number" &&
        typeof cur[1] === "number"
      ) {
        const x = Math.abs(cur[0] as number);
        const y = Math.abs(cur[1] as number);
        if (x > 180 || y > 90) return true;
        continue;
      }
      cur.forEach((v) => stack.push(v));
    }
  }
  return false;
}

export function normalizeToEpsg4326(
  raw: FeatureCollectionWithCrs
): FeatureCollection {
  const crsName = raw.crs?.properties?.name?.toUpperCase() ?? "";
  const declared3857 =
    crsName.includes("3857") ||
    crsName.includes("900913") ||
    crsName.includes("102100");
  const inferred3857 = detectEpsg3857ByRange(raw);
  const fromEpsg3857 = declared3857 || inferred3857;

  if (!fromEpsg3857) return raw;

  return {
    ...raw,
    features: raw.features.map((feature) => {
      if (!feature.geometry) return feature;
      if (feature.geometry.type === "GeometryCollection") return feature;
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: transformCoordinatesTo4326(
            feature.geometry.coordinates,
            true
          ) as GeoJSON.Position[] | GeoJSON.Position[][] | GeoJSON.Position[][][],
        },
      };
    }) as GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>[],
  };
}

export function extractPolygons(data: FeatureCollection): [number, number][][] {
  const polygons: [number, number][][] = [];
  data.features.forEach((feature) => {
    if (!feature.geometry) return;
    if (feature.geometry.type === "Polygon") {
      feature.geometry.coordinates.forEach((ring) =>
        polygons.push(ring as [number, number][])
      );
      return;
    }
    if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach((poly) => {
        poly.forEach((ring) => polygons.push(ring as [number, number][]));
      });
    }
  });
  return polygons;
}

function mergePolygons(data: FeatureCollection): [number, number][][] {
  try {
    const flattened = flatten(data) as GeoJSON.FeatureCollection<GeoJSON.Polygon>;
    const dissolved = dissolve(flattened);
    return extractPolygons(dissolved as unknown as FeatureCollection);
  } catch {
    return extractPolygons(data);
  }
}

export function getBBoxFromPolygons(polygons: [number, number][][]): BBox {
  const allCoords = polygons.flat();
  if (allCoords.length === 0) {
    return { minLng: -74.001, minLat: 40.672, maxLng: -73.975, maxLat: 40.689 };
  }
  const lngs = allCoords.map(([lng]) => lng);
  const lats = allCoords.map(([, lat]) => lat);
  return {
    minLng: Math.min(...lngs),
    minLat: Math.min(...lats),
    maxLng: Math.max(...lngs),
    maxLat: Math.max(...lats),
  };
}

export function useMapBase(): MapBaseState {
  const [state, setState] = useState<MapBaseState>({
    base: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [bidRes, canalRes] = await Promise.all([
          fetch(withBasePath("/data_from_gama/BID_vector.geojson")),
          fetch(withBasePath("/data_from_gama/canel.geojson")),
        ]);
        if (!bidRes.ok || !canalRes.ok) {
          throw new Error("Failed to load BID or canal data file");
        }

        const bid = normalizeToEpsg4326(
          (await bidRes.json()) as FeatureCollectionWithCrs
        );
        const canal = normalizeToEpsg4326(
          (await canalRes.json()) as FeatureCollectionWithCrs
        );
        const bidPolygons = extractPolygons(bid);
        const canalPolygons = mergePolygons(canal);
        const tightBbox = getBBoxFromPolygons(bidPolygons);
        const padLng = (tightBbox.maxLng - tightBbox.minLng) * 0.08;
        const padLat = (tightBbox.maxLat - tightBbox.minLat) * 0.08;
        const paddedBbox: BBox = {
          minLng: tightBbox.minLng - padLng,
          minLat: tightBbox.minLat - padLat,
          maxLng: tightBbox.maxLng + padLng,
          maxLat: tightBbox.maxLat + padLat,
        };
        const contextBbox = expandBBoxForContext(paddedBbox, MAP_CONTEXT_EXPANSION);
        const bbox = fitBBoxToAspectRatio(contextBbox, MAP_VIEW_ASPECT_RATIO);
        const osmEmbedUrl =
          `https://www.openstreetmap.org/export/embed.html?layer=mapnik&bbox=` +
          `${bbox.minLng}%2C${bbox.minLat}%2C${bbox.maxLng}%2C${bbox.maxLat}`;

        if (!cancelled) {
          setState({
            base: { bbox, bidPolygons, canalPolygons, osmEmbedUrl },
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            base: null,
            loading: false,
            error:
              err instanceof Error ? err.message : "Unknown data loading error",
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
