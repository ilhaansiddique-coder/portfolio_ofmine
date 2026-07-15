"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CartProvider } from "@/lib/CartContext";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import themeManifest from "@theme/manifest";
import Navbar from "@theme/chrome/Navbar";
import Footer from "@theme/chrome/Footer";
import CartDrawer from "@theme/chrome/CartDrawer";

/**
 * Wraps every preview page in the engine providers + the theme's own chrome
 * (Navbar / Footer / CartDrawer), inside the scope div the real site layout
 * adds.
 *
 * Every theme scopes its entire stylesheet under `.theme-<manifest id>`, so
 * this class MUST track the theme being previewed — hardcoding one theme's id
 * renders every other theme completely unstyled.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  return (
    <SiteSettingsProvider>
      <CartProvider>
        <div className={`theme-${themeManifest.id}`}>
          <Navbar
            onSearchOpen={() => router.push("/shop")}
            onCartOpen={() => setCartOpen(true)}
            onAuthOpen={() => alert("Account panel (demo) — handled by the engine in production.")}
          />
          <main>{children}</main>
          <Footer />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
      </CartProvider>
    </SiteSettingsProvider>
  );
}
