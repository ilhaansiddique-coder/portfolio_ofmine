import LivePage from "@theme/pages/LivePage";
import { LIVE_STREAMS } from "@/data/products";

export default function Page() {
  return <LivePage streams={LIVE_STREAMS} />;
}
