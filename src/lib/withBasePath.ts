const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;

  // Keep local dev URLs root-based; only prepend when app is actually served
  // from the GitHub Pages subpath.
  if (typeof window === "undefined") return path;
  const onBasePath =
    window.location.pathname === BASE_PATH ||
    window.location.pathname.startsWith(`${BASE_PATH}/`);
  const onGithubPages = window.location.hostname.endsWith("github.io");

  if (!onBasePath && !onGithubPages) return path;
  return `${BASE_PATH}${path}`;
}

