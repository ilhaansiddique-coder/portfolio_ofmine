import { BrandPage } from "@theme/pages/BrandsPage";
import { BRANDS } from "@theme/components/brands";
import { PRODUCTS } from "@/data/products";

// Static export: a brand page must be generated for every brand the theme can
// link to. That's the union of two sources — brands the mock products belong to,
// AND the theme's own brand directory, which may list brands that own no
// products yet (those render as a valid, empty brand page rather than a 404).
export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const p of PRODUCTS) if (p.brand_slug) slugs.add(p.brand_slug);
  for (const b of BRANDS) if (b?.slug) slugs.add(b.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BrandPage slug={slug} products={PRODUCTS} />;
}
