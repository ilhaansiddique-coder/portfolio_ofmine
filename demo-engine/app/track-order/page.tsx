import { Suspense } from "react";
import TrackOrderPage from "@theme/pages/TrackOrderPage";

// TrackOrderPage reads the URL (?order=) via useSearchParams, so it must be
// wrapped in a Suspense boundary per the Next.js app-router contract.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <TrackOrderPage />
    </Suspense>
  );
}
