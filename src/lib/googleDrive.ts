/**
 * Google Drive "share link" file IDs for embedded previews.
 * Preview URL works in iframes; direct MP4 URLs are not used.
 */
export const DRIVE = {
  /** 245 Bond St – after (green vision) for compare slider */
  bondAfter: "1qPL0Up7rLf0KJ_vlqnJ7P6fhi240SSY8",
  /** GAMA live demo / screen capture */
  gamaDemo: "1C_-ndF9lU4SGAztWgnbmaZY71eYW1AlQ",
} as const;

export function drivePreviewUrl(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/** Accepts a full share URL, `/preview` URL, or raw file id */
export function driveFileIdFromUserInput(
  input: string | null | undefined,
): string | null {
  if (!input?.trim()) return null;
  const t = input.trim();
  const m = t.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1]!;
  if (/^[a-zA-Z0-9_-]{10,}$/.test(t)) return t;
  return null;
}
