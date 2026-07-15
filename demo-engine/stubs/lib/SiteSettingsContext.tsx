"use client";

import { createContext, useContext, type ReactNode } from "react";
import themeManifest from "@theme/manifest";

export interface SiteSettings {
  site_name: string;
  currency_symbol: string;
  currency: string;
  address?: string;
  phone?: string;
  email?: string;
}

// The store name comes from the theme being previewed — hardcoding one theme's
// name brands every other theme's demo with the wrong shop.
const SETTINGS: SiteSettings = {
  site_name: themeManifest.label,
  currency_symbol: "৳",
  currency: "BDT",
  address: "Dhaka, Bangladesh",
  phone: "01XXX-XXXXXX",
  email: "hello@demo.store",
};

const Ctx = createContext<SiteSettings>(SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={SETTINGS}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}
