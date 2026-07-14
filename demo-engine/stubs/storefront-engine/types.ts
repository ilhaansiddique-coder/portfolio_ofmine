// Loose stand-in for the engine's manifest type — enough to type manifest.ts.
export interface StorefrontThemeV2 {
  id: string;
  label: string;
  description: string;
  tags: string[];
  pages: Record<string, () => Promise<unknown>>;
  chrome: Record<string, () => Promise<unknown>>;
}
