import ShopPage from "@theme/pages/ShopPage";
import { PRODUCTS, CATEGORIES } from "@/data/products";

export default function Page() {
  return <ShopPage initialProducts={PRODUCTS} apiCategories={CATEGORIES} />;
}
