'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { config, asset } from '@/config';
import type { Repo } from '@/lib/github';
import { deriveCategory, prettyName } from '@/lib/enrich';
import { useVisibility } from '@/lib/visibility';

const groups = ['All work', 'Platforms', 'Systems', 'Mobile', 'Interfaces'];
const groupFor = (repo: Repo) => {
  const category = deriveCategory(repo);
  if (/saas|commerce|dashboard|auth/i.test(category)) return 'Platforms';
  if (/mobile/i.test(category)) return 'Mobile';
  if (/theme|portfolio/i.test(category)) return 'Interfaces';
  return 'Systems';
};
const selectedImages: Record<string, string> = {
  sales_IMS_with_hrm_n_accounts: 'inventory-SaaS',
  'inventory-SaaS': 'inventory-SaaS',
  'ecom-akhyanbd': 'ecom-akhyanbd',
};
const titleFor = (repo: Repo) => config.projectOverrides[repo.name]?.title ?? prettyName(repo.name);

export default function Projects({ repos }: { repos: Repo[] }) {
  const { hidden } = useVisibility();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All work');
  const published = useMemo(() => repos.filter((repo) => !hidden.includes(repo.name) && !/planned|reserved|implementation not yet published/i.test(repo.description ?? '')), [repos, hidden]);
  const featured = published.filter((repo) => selectedImages[repo.name]).slice(0, 2);
  const filtered = published.filter((repo) => {
    const copy = config.projectOverrides[repo.name];
    const text = [repo.name, copy?.title, copy?.tagline, repo.description, ...(copy?.skills ?? []), ...repo.topics, repo.language].join(' ').toLowerCase();
    return (group === 'All work' || groupFor(repo) === group) && text.includes(query.trim().toLowerCase());
  });
  return (
    <section id="projects" className="scroll-mt-24">
      <header className="work-header">
        <div><h2>Selected projects</h2><p>Commerce, business software and real-time applications. The interfaces, the decisions and the source behind my work.</p></div>
        <a href="#project-library">Browse {published.length} projects</a>
      </header>
      <div className="selected-work">
        {featured.map((repo) => {
          const copy = config.projectOverrides[repo.name];
          return <article key={repo.id}>
            <figure>
              <Link href={`/projects/${repo.name}`}><img src={asset(`/previews/${selectedImages[repo.name]}.webp`)} alt={`${titleFor(repo)} interface`} width={1200} height={750} loading="lazy" /></Link>
              <figcaption>Interface captured from the project deployment</figcaption>
            </figure>
            <h3><Link href={`/projects/${repo.name}`}>{titleFor(repo)}</Link></h3>
            <p>{copy?.tagline ?? repo.description}</p>
            <div className="work-actions"><Link href={`/projects/${repo.name}`}>Read case study</Link><Link href={`/${repo.name}/`}>Open project</Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer">Source code</a></div>
          </article>;
        })}
      </div>
      <div id="project-library" className="scroll-mt-28">
        <div className="library-toolbar"><h3>All projects</h3><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search projects" placeholder="Search by project or technology" />{query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}</div>
        <div className="work-filters" aria-label="Filter projects">{groups.map((item) => <button type="button" key={item} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
        <p role="status" className="sr-only">{filtered.length} projects found</p>
        <div>{filtered.map((repo) => <article className="work-row" key={repo.id}>
          <div><h4><Link href={`/projects/${repo.name}`}>{titleFor(repo)}</Link></h4><p>{config.projectOverrides[repo.name]?.tagline ?? repo.description ?? 'Source code and implementation details available in the repository.'}</p></div>
          <div><span className="work-kind">{deriveCategory(repo)}</span><p>{config.projectOverrides[repo.name]?.skills?.slice(0, 4).join(', ') ?? repo.language ?? 'See repository'}</p></div>
          <div className="work-actions"><Link href={`/${repo.name}/`}>Open project</Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer" aria-label={`View ${titleFor(repo)} source on GitHub`}>Code</a><Link href={`/projects/${repo.name}`}>Case study</Link></div>
        </article>)}</div>
        {filtered.length === 0 && <div className="empty-work"><p>No projects match these filters.</p><button type="button" onClick={() => { setGroup('All work'); setQuery(''); }}>Reset filters</button></div>}
        <div className="work-actions"><a href={config.social.github} target="_blank" rel="noreferrer">View GitHub profile</a></div>
      </div>
    </section>
  );
}
