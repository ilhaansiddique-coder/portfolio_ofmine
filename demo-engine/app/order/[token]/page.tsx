import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

/**
 * In production this route is rendered by the ENGINE, not the theme (there is
 * no theme slot for order confirmation). This stub just gives the checkout
 * redirect a friendly place to land in the preview.
 */
// Static export: the checkout stub always mints the token "demo" (see
// stubs/lib/api.ts), so that is the only confirmation page that can be reached.
export function generateStaticParams() {
  return [{ token: "demo" }];
}

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="tpl-page" style={{ maxWidth: 560 }}>
      <div className="tpl-panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <FiCheckCircle size={56} color="var(--tpl-primary)" />
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "16px 0 8px" }}>Order placed! 🎉</h1>
        <p style={{ color: "var(--tpl-muted)", margin: "0 0 6px" }}>
          Thank you for your purchase. Your order reference is:
        </p>
        <p style={{ fontWeight: 700, marginTop: 0 }}>{token}</p>
        <p style={{ color: "var(--tpl-muted)", fontSize: 13, margin: "16px 0 24px" }}>
          (In the live store this confirmation page is rendered by the engine, not the theme.)
        </p>
        <Link href="/" className="tpl-btn">Continue shopping</Link>
      </div>
    </div>
  );
}
