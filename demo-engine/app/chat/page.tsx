import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";

export default function Page() {
  return (
    <div className="tpl-page" style={{ maxWidth: 560 }}>
      <div className="tpl-panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <FiMessageCircle size={48} color="var(--tpl-primary)" />
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "14px 0 6px" }}>Messages</h1>
        <p style={{ color: "var(--tpl-muted)", margin: "0 0 22px" }}>
          Customer-support chat would live here. (Preview placeholder.) For now, reach us via the contact page.
        </p>
        <Link href="/contact" className="tpl-btn">Contact us</Link>
      </div>
    </div>
  );
}
