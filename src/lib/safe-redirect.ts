// Placeholder origin used only to resolve the candidate path; never used in output.
const BASE = "http://localhost";

/**
 * Returns `next` as a same-origin relative path (pathname + search + hash) if it is
 * safe to redirect to, otherwise `fallback`. Only single-leading-slash paths pass:
 * `//host`, `/\host`, any backslash, control characters and anything that resolves
 * to another origin are rejected.
 */
export function safeRedirectPath(next: unknown, fallback: string): string {
  if (typeof next !== "string" || next.length === 0 || next.length > 2048) return fallback;
  if (next[0] !== "/" || next[1] === "/") return fallback;
  if (next.includes("\\")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(next)) return fallback;

  let url: URL;
  try {
    url = new URL(next, BASE);
  } catch {
    return fallback;
  }
  if (url.origin !== BASE) return fallback;

  const path = `${url.pathname}${url.search}${url.hash}`;
  // Normalisation (e.g. "/.//host") must not produce a protocol-relative path.
  if (path[0] !== "/" || path[1] === "/") return fallback;
  return path;
}
