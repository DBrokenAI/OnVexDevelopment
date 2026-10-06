export function cn(...inputs: Array<string | number | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Returns `next` only if it is a same-site path ("/admin/tasks"), else `fallback`.
 * Rejects "//evil.com" and "/\evil.com", which browsers treat as other hosts.
 */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  try {
    const base = "http://onvex.invalid";
    const url = new URL(next, base);
    return url.origin === base ? url.pathname + url.search + url.hash : fallback;
  } catch {
    return fallback;
  }
}

/** "Maria Lopez" → "ML", "dan@onvex.dev" → "DA". */
export function initials(nameOrEmail: string): string {
  const base = nameOrEmail.split("@")[0].trim();
  const words = base.split(/[\s._-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase() || "?";
}
