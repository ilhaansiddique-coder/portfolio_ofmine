import { BrandPage } from "@theme/pages/BrandsPage";
import { PRODUCTS } from "@/data/products";

// Static export: derive the brand pages from the brands the mock products carry.
export function generateStaticParams() {
  const slugs = new Set(
    PRODUCTS.map((p) => p.brand_slug).filter((s): s is string => Boolean(s)),
  );
  return [...slugs].map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BrandPage slug={slug} products={PRODUCTS} />;
}
