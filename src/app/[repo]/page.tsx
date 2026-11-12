import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchRepos } from '@/lib/github';
import { deriveInsight } from '@/lib/enrich';

// Nginx takes over these paths when an actual app upstream is connected.
// Until then, never pass a screenshot or an invented interface off as a demo.
export async function generateStaticParams() {
  return (await fetchRepos()).map((repo) => ({ repo: repo.name }));
}

export async function generateMetadata({ params }: { params: { repo: string } }): Promise<Metadata> {
  return { title: params.repo, robots: { index: false, follow: true } };
}

export default async function ProjectApp({ params }: { params: { repo: string } }) {
  const repo = (await fetchRepos()).find((item) => item.name === params.repo);
  if (!repo) notFound();
  const insight = deriveInsight(repo, []);
  return (
    <main className="demo-status">
      <Link href="/#projects">Back to portfolio</Link>
      <h1>{insight.title}</h1>
      <p>This application’s live service has not been connected to this portfolio address yet. Its original interface and backend will run here once its separate service is deployed and routed to this path.</p>
      <nav aria-label="Project resources"><Link href={`/projects/${repo.name}`}>Read case study</Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer">View source code</a></nav>
    </main>
  );
}
