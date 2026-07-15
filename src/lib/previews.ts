import { asset } from '@/config';

/**
 * A standardized visual preview for a project that has no in-browser live demo.
 * Every non-demo project gets one so a visitor instantly sees what it is.
 *
 * `source` is shown as an honest badge on the preview:
 *   - 'live'         real screenshot of the project's live deployment
 *   - 'screenshot'   real screenshot committed in the project's repo (mobile apps)
 *   - 'illustrative' a representative UI mockup — clearly labelled, not the real app
 *   - 'coming-soon'  repository reserved; nothing to show yet
 *
 * `kind` picks the presentation frame: 'web' = wide, 'mobile' = tall phone.
 */
export type PreviewSource = 'live' | 'screenshot' | 'illustrative' | 'coming-soon';
export type PreviewKind = 'web' | 'mobile';

export type Preview = {
  kind: PreviewKind;
  source: PreviewSource;
  /** Preview image under /public/previews (omitted for 'coming-soon'). */
  image?: string;
};

const PREVIEWS: Record<string, Preview> = {
  // --- Real screenshots of live deployments -----------------
  'inventory-SaaS': { kind: 'web', source: 'live', image: 'inventory-SaaS' },
  'ecom-akhyanbd': { kind: 'web', source: 'live', image: 'ecom-akhyanbd' },

  // --- Real screenshots committed in the app repos ----------
  'E-commerce-main-androidApp': { kind: 'mobile', source: 'screenshot', image: 'E-commerce-main-androidApp' },
  'whatsapp_clone_with_flutter-main-androidApp': { kind: 'mobile', source: 'screenshot', image: 'whatsapp_clone_with_flutter-main-androidApp' },

  // --- Representative UI mockups (labelled illustrative) -----
  'HRM_IlhaanSq': { kind: 'web', source: 'illustrative', image: 'HRM_IlhaanSq' },
  'ecom-futurebd': { kind: 'web', source: 'illustrative', image: 'ecom-futurebd' },
  'Daily_Performance_Portal': { kind: 'web', source: 'illustrative', image: 'Daily_Performance_Portal' },
  'portfolio_rehedeen': { kind: 'web', source: 'illustrative', image: 'portfolio_rehedeen' },
  'agency-portfolio': { kind: 'web', source: 'illustrative', image: 'agency-portfolio' },
  'sst': { kind: 'web', source: 'illustrative', image: 'sst' },
  'akhiyanflutterapp': { kind: 'mobile', source: 'illustrative', image: 'akhiyanflutterapp' },
  'hadith-main-androidApp': { kind: 'mobile', source: 'illustrative', image: 'hadith-main-androidApp' },
  'assaaliyah': { kind: 'mobile', source: 'illustrative', image: 'assaaliyah' },

  // --- Reserved / empty repositories ------------------------
  'mega_auth_nextjs_postgresql': { kind: 'web', source: 'coming-soon' },
  'admission_management_system': { kind: 'web', source: 'coming-soon' },
  'flyngo_tours_n_travels': { kind: 'web', source: 'coming-soon' },
  'medicine_inventory_saas': { kind: 'web', source: 'coming-soon' },
  'shomokal_hajjnumra': { kind: 'web', source: 'coming-soon' },
  'social_portal_as_linkedIn': { kind: 'web', source: 'coming-soon' },
};

export function previewFor(repoName: string): (Preview & { imageUrl?: string }) | null {
  const p = PREVIEWS[repoName];
  if (!p) return null;
  return { ...p, imageUrl: p.image ? asset(`/previews/${p.image}.webp`) : undefined };
}
