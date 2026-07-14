import ProductPage from "@theme/pages/ProductPage";
import { PRODUCTS } from "@/data/products";

// Static export: every dynamic route must enumerate its pages up front.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug || String(p.id) }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => (p.slug || String(p.id)) === slug) || PRODUCTS[0];

  // Related = same category first, then anything else, excluding the current product.
  const sameCat = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category_slug || p.category) === (product.category_slug || product.category),
  );
  const others = PRODUCTS.filter((p) => p.id !== product.id && !sameCat.includes(p));
  const related = [...sameCat, ...others].slice(0, 5);

  return <ProductPage product={product} related={related} />;
}
