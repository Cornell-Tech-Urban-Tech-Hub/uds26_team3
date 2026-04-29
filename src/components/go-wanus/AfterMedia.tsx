"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import { styleFitContainer } from "react-compare-slider";
import { driveFileIdFromUserInput, drivePreviewUrl } from "@/lib/googleDrive";

type Props = {
  videoSrc: string;
};

/**
 * After side of compare: hosted MP4 URL, or Google Drive (iframe preview).
 */
export function AfterMedia({ videoSrc }: Props) {
  const fileId = driveFileIdFromUserInput(videoSrc);

  if (fileId) {
    return (
      <iframe
        title="Proposed green street vision (video)"
        src={drivePreviewUrl(fileId)}
        className="h-full w-full min-h-full border-0 bg-black"
        style={styleFitContainer() as CSSProperties}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }

  return <AfterVideoFile src={videoSrc} />;
}

function AfterVideoFile({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="h-full w-full"
      style={styleFitContainer()}
      aria-label="Proposed green street vision"
    />
  );
}
