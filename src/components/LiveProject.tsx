'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, Globe, Code2, Loader2 } from 'lucide-react';
import type { LiveTab } from '@/lib/preview';

const ICONS: Record<LiveTab['id'], typeof Globe> = {
  live: Globe,
  run: Code2,
};

export default function LiveProject({
  tabs,
  title,
}: {
  tabs: LiveTab[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const tab = tabs[active];

  // Never leave the loader spinning forever (some sites block onload events).
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), tab.id === 'run' ? 12000 : 7000);
    return () => clearTimeout(t);
  }, [active, nonce, tab.id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-glow">
      {/* Browser-style chrome bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </span>
          <div className="flex gap-1">
            {tabs.map((t, i) => {
              const Icon = ICONS[t.id];
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    i === active
                      ? 'bg-neon/15 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setNonce((n) => n + 1)}
            title="Reload preview"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RefreshCw size={14} />
          </button>
          <a
            href={tab.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Open in new tab <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Live frame */}
      <div className="relative aspect-[16/10] w-full bg-bg">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg/60 backdrop-blur-sm">
            <Loader2 className="animate-spin text-neon" size={28} />
            <p className="text-sm text-slate-400">
              {tab.id === 'run'
                ? 'Booting the project in your browser…'
                : 'Loading live preview…'}
            </p>
          </div>
        )}
        <iframe
          key={`${tab.id}-${nonce}`}
          src={tab.url}
          title={`${title} — ${tab.label}`}
          onLoad={() => setLoading(false)}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-popups-to-escape-sandbox"
          allow="cross-origin-isolated"
        />
      </div>

      <p className="border-t border-line px-4 py-2.5 text-xs text-slate-500">
        {tab.note}
      </p>
    </div>
  );
}
