'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Search, Layers3, Database, Radio, Smartphone, PanelsTopLeft } from 'lucide-react';
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
const categoryIcon = (repo: Repo) => {
  const category = deriveCategory(repo);
  if (/mobile/i.test(category)) return Smartphone;
  if (/real.time/i.test(category)) return Radio;
  if (/commerce/i.test(category)) return PanelsTopLeft;
  if (/saas|dashboard/i.test(category)) return Database;
  return Layers3;
};

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
        <div><h2>Software with<br />a business behind it.</h2><p>From the first screen to the data behind it. Explore my work across commerce, business platforms and real-time applications.</p></div>
        <a href="#project-library">Explore all {published.length} projects <ArrowUpRight size={18} aria-hidden="true" /></a>
      </header>
      <div className="selected-work">
        {featured.map((repo, index) => {
          const copy = config.projectOverrides[repo.name];
          return <article key={repo.id} className={`showcase showcase-${index + 1}`}>
            <div className="showcase-copy">
              <div className="showcase-meta"><span>{deriveCategory(repo)}</span><span>0{index + 1}</span></div>
              <h3><Link href={`/projects/${repo.name}`}>{titleFor(repo)}</Link></h3>
              <p>{copy?.tagline ?? repo.description}</p>
              <ul className="showcase-details">{copy?.highlights?.slice(0, 3).map((item) => <li key={item}>{item}</li>) ?? <li>Inventory, sales, HR and accounting workflows</li>}</ul>
              <div className="showcase-stack">{copy?.skills?.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="work-actions"><Link className="project-primary" href={`/projects/${repo.name}`}>Explore case study <ArrowUpRight size={17} aria-hidden="true" /></Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer" aria-label={`View ${titleFor(repo)} source code`}><Github size={18} /> Source</a></div>
              <Link className="project-service-link" href={`/${repo.name}/`}>Try workflow demo <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
            <figure className="showcase-visual">
              <Link href={`/projects/${repo.name}`}><img src={asset(`/previews/${selectedImages[repo.name]}.webp`)} alt={`${titleFor(repo)} interface`} width={1200} height={750} loading="lazy" /></Link>
              <figcaption>{repo.name === 'ecom-akhyanbd' ? 'The commerce storefront' : 'The account sign-in screen'}<span>Actual project interface</span></figcaption>
            </figure>
          </article>;
        })}
      </div>
      <div id="project-library" className="scroll-mt-28">
        <div className="library-toolbar"><div><h3>The full collection</h3><p>Different products. The same care for the details.</p></div><div className="project-search"><Search size={18} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search projects" placeholder="Find a project or technology" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</div></div>
        <div className="work-filters" aria-label="Filter projects">{groups.map((item) => <button type="button" key={item} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div>
        <p role="status" className="sr-only">{filtered.length} projects found</p>
        <div className="project-collection">{filtered.map((repo) => {
          const Icon = categoryIcon(repo);
          const copy = config.projectOverrides[repo.name];
          return <article className="collection-card" key={repo.id}>
            <div className="collection-meta"><Icon size={24} aria-hidden="true" /><span>{deriveCategory(repo)}</span></div>
            <h4><Link href={`/projects/${repo.name}`}>{titleFor(repo)}</Link></h4>
            <p>{copy?.tagline ?? repo.description ?? 'Source code and implementation details available in the repository.'}</p>
            <div className="collection-stack">{(copy?.skills?.slice(0, 3) ?? [repo.language ?? 'See repository']).map((skill) => <span key={skill}>{skill}</span>)}</div>
            <div className="collection-links"><Link href={`/${repo.name}/`}>Try demo <ArrowUpRight size={16} aria-hidden="true" /></Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer" aria-label={`View ${titleFor(repo)} source on GitHub`}><Github size={17} /></a><Link href={`/projects/${repo.name}`} aria-label={`Read ${titleFor(repo)} case study`}>Case study</Link></div>
          </article>;
        })}</div>
        {filtered.length === 0 && <div className="empty-work"><p>No projects match these filters.</p><button type="button" onClick={() => { setGroup('All work'); setQuery(''); }}>Reset filters</button></div>}
        <div className="work-actions"><a href={config.social.github} target="_blank" rel="noreferrer">View GitHub profile</a></div>
      </div>
    </section>
  );
}
