// Preview stub — the real engine sanitizes blog HTML. Mock content is trusted,
// so we pass it through unchanged.
export function sanitizeRichText(html: string): string {
  return html || "";
}
