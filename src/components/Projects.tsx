'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Boxes, Github, Search, ShoppingBag, X } from 'lucide-react';
import type { Repo } from '@/lib/github';
import { config } from '@/config';
import { deriveCategory, prettyName } from '@/lib/enrich';
import { useVisibility } from '@/lib/visibility';

const groupFor = (repo: Repo) => {
  const category = deriveCategory(repo);
  if (/saas|commerce|dashboard|auth/i.test(category)) return 'Platforms';
  if (/mobile/i.test(category)) return 'Mobile';
  if (/theme|portfolio/i.test(category)) return 'Interfaces';
  return 'Systems';
};
const groups = ['All work', 'Platforms', 'Systems', 'Mobile', 'Interfaces'];

export default function Projects({ repos }: { repos: Repo[] }) {
  const { hidden } = useVisibility();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All work');
  const published = useMemo(() => repos.filter((repo) => !hidden.includes(repo.name) && !/planned|reserved|implementation not yet published/i.test(repo.description ?? '')), [repos, hidden]);
  const featured = published.filter((repo) => ['sales_IMS_with_hrm_n_accounts', 'ecom-akhyanbd'].includes(repo.name));
  const filtered = published.filter((repo) => {
    const copy = config.projectOverrides[repo.name];
    const haystack = [repo.name, copy?.title, copy?.tagline, repo.description, ...(copy?.skills ?? []), ...repo.topics, repo.language].join(' ').toLowerCase();
    return (group === 'All work' || groupFor(repo) === group) && haystack.includes(query.trim().toLowerCase());
  });

  return (
    <section id="projects" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="portfolio-eyebrow"><span /> The project collection</p>
          <h2 className="mt-5 text-4xl font-medium leading-[1.1] tracking-[-0.045em] text-white sm:text-6xl">Built for the way<br /><span className="bloom-text">business works.</span></h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">SaaS platforms, commerce experiences and the systems behind them. Explore the work, then go deeper into the code.</p>
        </div>
        <a href="#project-library" className="inline-flex items-center gap-3 self-start rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300 transition hover:border-blue-400/60 hover:text-white md:self-auto">Explore {published.length} projects <ArrowDown size={15} /></a>
      </div>

      {featured.length > 0 && <div className="mb-20 grid gap-6 lg:grid-cols-2">
        {featured.map((repo, index) => <FeaturedProject key={repo.id} repo={repo} index={index} />)}
      </div>}

      <div id="project-library" className="scroll-mt-28">
        <div className="mb-7 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="portfolio-eyebrow">The complete collection</p><h3 className="mt-2 text-2xl font-medium tracking-tight text-white">Explore the work <span className="ml-2 align-middle font-mono text-xs text-slate-500">/{String(published.length).padStart(2, '0')}</span></h3></div>
          <div className="relative w-full lg:w-72">
            <Search size={16} aria-hidden="true" className="absolute left-3.5 top-3.5 text-slate-500" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search projects" placeholder="Search projects or technology" className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-500" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-3.5 text-slate-400"><X size={16} /></button>}
          </div>
        </div>
        <div aria-label="Filter projects" className="mb-8 flex flex-wrap gap-2">{groups.map((item) => <button type="button" key={item} aria-pressed={group === item} onClick={() => setGroup(item)} className={`rounded-full border px-4 py-2 text-xs font-medium transition ${group === item ? 'border-white bg-white text-slate-950' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}>{item}</button>)}</div>
        <p role="status" className="sr-only">{filtered.length} projects found</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((repo, index) => <LibraryCard key={repo.id} repo={repo} index={index} />)}</div>
        {filtered.length === 0 && <div className="rounded-2xl border border-white/10 p-12 text-center"><p className="text-slate-300">No projects match these filters.</p><button type="button" onClick={() => { setGroup('All work'); setQuery(''); }} className="mt-4 text-sm text-blue-400">Reset filters</button></div>}
        <a href={config.social.github} target="_blank" rel="noreferrer" className="mx-auto mt-10 flex w-fit items-center gap-2 text-sm text-slate-400 hover:text-white"><Github size={16} /> View GitHub profile <ArrowUpRight size={15} /></a>
      </div>
    </section>
  );
}

function FeaturedProject({ repo, index }: { repo: Repo; index: number }) {
  const copy = config.projectOverrides[repo.name];
  const isInventory = repo.name === 'sales_IMS_with_hrm_n_accounts';
  const Icon = isInventory ? Boxes : ShoppingBag;
  return (
    <article className={`featured-project ${isInventory ? 'featured-inventory' : 'featured-commerce'} group`}>
      <div className="relative flex min-h-64 flex-col justify-between overflow-hidden border-b border-white/10 p-7 sm:p-9">
        <div aria-hidden="true" className="project-orbit" />
        <div className="relative flex items-center justify-between"><span className="rounded-full border border-white/15 bg-slate-950/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200">Featured / 0{index + 1}</span><Icon size={23} className="text-white/70" /></div>
        <div className="relative mt-12"><p className="text-xs uppercase tracking-[0.2em] text-white/50">{isInventory ? 'Business operations, connected' : 'A storefront. An entire platform.'}</p><p className="mt-3 text-4xl font-medium tracking-[-0.04em] text-white sm:text-5xl">{isInventory ? 'Inventory' : 'Akhyan'}<span className="ml-3 font-light text-white/40">{isInventory ? 'SaaS' : 'Commerce'}</span></p></div>
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-9">
        <p className="portfolio-eyebrow">{copy?.category}</p>
        <h3 className="mt-3 text-2xl font-medium tracking-tight text-white"><Link href={`/projects/${repo.name}`} className="hover:text-blue-300">{copy?.title}</Link></h3>
        <p className="mt-4 text-sm leading-7 text-slate-400">{copy?.summary}</p>
        <div className="mb-7 mt-6 flex flex-wrap gap-2">{copy?.skills?.slice(0, 5).map((skill) => <span key={skill} className="portfolio-tag">{skill}</span>)}</div>
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6"><Link href={`/projects/${repo.name}`} className="inline-flex items-center gap-2 text-sm font-medium text-white">Explore the project <ArrowUpRight size={17} className="text-blue-400" /></Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer" aria-label={`View ${copy?.title ?? repo.name} source on GitHub`} className="text-slate-400 hover:text-white"><Github size={19} /></a></div>
      </div>
    </article>
  );
}

function LibraryCard({ repo, index }: { repo: Repo; index: number }) {
  const copy = config.projectOverrides[repo.name];
  const title = copy?.title ?? prettyName(repo.name);
  const tags = copy?.skills?.slice(0, 3) ?? (repo.topics.length ? repo.topics.slice(0, 3) : [repo.language ?? 'Source on GitHub']);
  return (
    <article className="library-card group flex flex-col rounded-2xl border border-white/10 p-6 sm:p-7">
      <div className="mb-7 flex items-center justify-between"><span className="text-[10px] font-medium uppercase tracking-[0.14em] text-blue-300/80">{deriveCategory(repo)}</span><span aria-hidden="true" className="font-mono text-xs text-slate-600">{String(index + 1).padStart(2, '0')}</span></div>
      <h4 className="text-xl font-medium leading-7 tracking-tight text-white"><Link href={`/projects/${repo.name}`} className="transition hover:text-blue-300">{title}</Link></h4>
      <p className="mb-6 mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{copy?.tagline ?? repo.description ?? `Explore the ${prettyName(repo.name)} implementation and source code.`}</p>
      <div className="mb-7 mt-auto flex flex-wrap gap-1.5">{tags.map((tag) => <span key={tag} className="portfolio-tag">{tag}</span>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5"><Link href={`/projects/${repo.name}`} className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white">Case study <ArrowUpRight size={14} /></Link><a href={repo.htmlUrl} target="_blank" rel="noreferrer" aria-label={`View ${title} source on GitHub`} className="text-slate-500 hover:text-white"><Github size={16} /></a></div>
    </article>
  );
}
