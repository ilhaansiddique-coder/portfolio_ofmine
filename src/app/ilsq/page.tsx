import type { Metadata } from 'next';
import { fetchRepos } from '@/lib/github';
import OwnerConsole from '@/components/OwnerConsole';

// Private control panel — keep it out of search engines.
export const metadata: Metadata = {
  title: 'Owner Console',
  robots: { index: false, follow: false },
};

export default async function OwnerConsolePage() {
  // Same build-time project list the rest of the site uses.
  const repos = await fetchRepos();
  return <OwnerConsole repos={repos} />;
}
