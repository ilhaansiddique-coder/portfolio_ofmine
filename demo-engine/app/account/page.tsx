import AccountPage from "@theme/pages/AccountPage";

// AccountPage reads ?tab= via useSearchParams and wraps itself in a Suspense
// boundary, so the route can render it directly.
export default function Page() {
  return <AccountPage />;
}
