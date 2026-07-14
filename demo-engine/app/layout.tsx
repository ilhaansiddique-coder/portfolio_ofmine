import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "./AppShell";

export const metadata = {
  title: "Ecom Theme Template — Preview",
  description: "Local preview of the Ecom Theme Template storefront theme.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Browser extensions (e.g. ColorZilla) inject attributes like
          cz-shortcut-listen onto <body> before hydration; suppress the
          resulting dev-only mismatch warning. */}
      <body suppressHydrationWarning>
        {/* Fonts for the storefront theme: Open Sans for all Latin text,
            Hind Siliguri for Bangla. (styles.css also @imports these, this just
            preconnects + loads them early.) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
