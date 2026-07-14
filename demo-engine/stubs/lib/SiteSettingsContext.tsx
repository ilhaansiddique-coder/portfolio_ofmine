"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface SiteSettings {
  site_name: string;
  currency_symbol: string;
  currency: string;
  address?: string;
  phone?: string;
  email?: string;
}

const SETTINGS: SiteSettings = {
  site_name: "ShopKart",
  currency_symbol: "৳",
  currency: "BDT",
  address: "Dhaka, Bangladesh",
  phone: "01XXX-XXXXXX",
  email: "support@shopkart.test",
};

const Ctx = createContext<SiteSettings>(SETTINGS);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={SETTINGS}>{children}</Ctx.Provider>;
}

export function useSiteSettings(): SiteSettings {
  return useContext(Ctx);
}
