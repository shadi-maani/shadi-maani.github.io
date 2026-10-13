export function sanitizeImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  if (url.startsWith("/") || url.startsWith("data:")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    return null;
  }
  return null;
}

export function sanitizeExternalLink(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }
  return "";
}
