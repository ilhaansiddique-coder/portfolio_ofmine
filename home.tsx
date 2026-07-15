"use client";

/**
 * Ecom Theme Template HomePage — marketplace layout:
 *   1. Category tab strip (dynamic from catalogue)
 *   2. Quick-link icon row (Flash Sale / Coupons / Group Deals / …)
 *   3. Subsidy strip (discounted picks with bold prices)
 *   4. 2-column deal feed (ProductCard)
 *
 * Editable wraps every visible label; trackViewItemList fires on the feed.
 */

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { FiZap, FiGift, FiUsers, FiTruck, FiGrid } from "react-icons/fi";
import type { HomePageProps } from "@/storefront-engine/types/pages";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { Editable } from "@/storefront-engine/editor/Editable";
import { trackViewItemList } from "@/lib/analytics";
import ProductCard from "../components/ProductCard";
import { uniqueCategoriesFromProducts, discountPercent, formatMoney } from "../components/helpers";
import "../styles.css";

const QUICK = [
  { icon: FiZap,   label: "Flash Sale",    color: "#fb5d34" },
  { icon: FiGift,  label: "Coupons",       color: "#3b82f6" },
  { icon: FiUsers, label: "Group Deals",   color: "#ec4899" },
  { icon: FiTruck, label: "Free Shipping", color: "#22c55e" },
  { icon: FiGrid,  label: "More",          color: "#f59e0b" },
];

export default function HomePage({ products }: HomePageProps) {
  const settings = useSiteSettings();
  const currency = settings.currency_symbol || "৳";
  const feed = products;
  const deals = useMemo(
    () => products.filter((p) => discountPercent(p.price, p.originalPrice) != null).slice(0, 8),
    [products],
  );
  const categories = useMemo(() => uniqueCategoriesFromProducts(products).slice(0, 8), [products]);

  useEffect(() => {
    if (!feed.length) return;
    trackViewItemList({
      item_list_id: "tpl_home_feed",
      item_list_name: "Home feed",
      items: feed.slice(0, 20).map((p) => ({ id: p.id, name: p.name, category: p.category, price: p.price })),
    });
  }, [feed]);

  return (
    <div className="tpl-home">
      {/* Category tabs */}
      <div className="tpl-tabs">
        <Link href="/" className="tpl-tab tpl-tab--active">
          <Editable section="home" field="tabRecommended" defaultValue="Recommended" label="Recommended tab">
            {(v, ep) => <span {...ep}>{v}</span>}
          </Editable>
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop?category=${encodeURIComponent(c.slug)}`} className="tpl-tab">{c.name}</Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="tpl-quick">
        {QUICK.map((q, i) => {
          const Icon = q.icon;
          return (
            <Link key={i} href="/shop" className="tpl-quick__item">
              <span className="tpl-quick__icon" style={{ background: q.color }}><Icon size={22} color="#fff" /></span>
              <Editable section="home" field={`quick${i + 1}`} defaultValue={q.label} label={`Quick link ${i + 1}`}>
                {(v, ep) => <small {...ep}>{v}</small>}
              </Editable>
            </Link>
          );
        })}
      </div>

      {/* Subsidy strip */}
      {deals.length > 0 && (
        <div className="tpl-subsidy">
          <div className="tpl-subsidy__badge">
            <Editable section="home" field="subsidyTitle" defaultValue="Mega Deals" label="Subsidy title">
              {(v, ep) => <b {...ep}>{v}</b>}
            </Editable>
            <Editable section="home" field="subsidySub" defaultValue="Top brands" label="Subsidy subtitle">
              {(v, ep) => <small {...ep}>{v}</small>}
            </Editable>
          </div>
          <div className="tpl-subsidy__rail">
            {deals.map((p) => {
              const slug = p.slug || String(p.id);
              const isExternal = p.image && (p.image.startsWith("/storage/") || p.image.includes("://"));
              return (
                <Link key={p.id} href={`/products/${slug}`} className="tpl-subsidy__item">
                  <div className="tpl-subsidy__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image || "/placeholder.svg"} alt={p.name} {...(isExternal ? {} : {})} />
                  </div>
                  <span className="tpl-subsidy__price">{formatMoney(p.price, currency)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Deal feed */}
      <div className="tpl-feed">
        {feed.map((p, i) => <ProductCard product={p} key={p.id} priority={i < 4} />)}
      </div>
    </div>
  );
}
