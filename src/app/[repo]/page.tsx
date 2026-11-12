import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchRepos } from '@/lib/github';
import { deriveInsight } from '@/lib/enrich';
import StaticDemo from '@/components/StaticDemo';

// Each repository ships an interactive browser-only workflow simulation.
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
  return <StaticDemo repo={repo.name} title={insight.title} source={repo.htmlUrl} />;
}
