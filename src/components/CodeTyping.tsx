'use client';

import { useEffect, useMemo, useState } from 'react';
import { config } from '@/config';

/**
 * A "typewriter" animation inside a mock code-editor window: an object
 * literal describing me, typed out character by character with a blinking
 * caret. The contents are built from the real portfolio data (project count,
 * the languages and domains actually present in my repos) so it can't drift
 * out of sync with the Projects section.
 *
 * No typing library — the code is modelled as coloured tokens, and we simply
 * reveal the first N characters of their concatenation.
 */
type Token = { text: string; className?: string };

const KEYWORD = 'text-fuchsia-400';
const PROP = 'text-neon-cyan';
const STRING = 'text-emerald-300';
const NUMBER = 'text-amber-300';
const PUNCT = 'text-slate-500';
const PLAIN = 'text-slate-200';

const TYPE_MS = 22; // per character

function buildTokens(
  projectCount: number,
  stack: string[],
  domains: string[]
): Token[] {
  const t: Token[] = [];
  const push = (text: string, className?: string) => t.push({ text, className });

  // Render up to `max` entries, then a literal "…" to signal there are more.
  const list = (items: string[], max: number) => {
    const head = items.slice(0, max);
    const more = items.length > max;
    push('[', PUNCT);
    head.forEach((item, i) => {
      push(`'${item}'`, STRING);
      if (i < head.length - 1 || more) push(', ', PUNCT);
    });
    if (more) push('...', PUNCT);
    push('],\n', PUNCT);
  };

  push('const', KEYWORD);
  push(' developer', PLAIN);
  push(' = ', PUNCT);
  push('{\n', PUNCT);

  push('  name', PROP);
  push(': ', PUNCT);
  push(`'${config.name}'`, STRING);
  push(',\n', PUNCT);

  push('  role', PROP);
  push(': ', PUNCT);
  push(`'${config.role}'`, STRING);
  push(',\n', PUNCT);

  push('  stack', PROP);
  push(': ', PUNCT);
  list(stack, 4);

  push('  building', PROP);
  push(': ', PUNCT);
  list(domains, 3);

  push('  projects', PROP);
  push(': ', PUNCT);
  push(String(projectCount), NUMBER);
  push(',\n', PUNCT);

  push('  shipsDaily', PROP);
  push(': ', PUNCT);
  push('true', KEYWORD);
  push(',\n', PUNCT);

  push('}', PUNCT);

  return t;
}

export default function CodeTyping({
  projectCount,
  stack,
  domains,
}: {
  projectCount: number;
  stack: string[];
  domains: string[];
}) {
  const tokens = useMemo(
    () => buildTokens(projectCount, stack, domains),
    [projectCount, stack, domains]
  );
  const total = useMemo(
    () => tokens.reduce((n, tok) => n + tok.text.length, 0),
    [tokens]
  );

  const [shown, setShown] = useState(0);

  useEffect(() => {
    // Honour reduced-motion: show the finished snippet, don't animate.
    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches;
    if (reduced) {
      setShown(total);
      return;
    }

    setShown(0);
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= total) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);

    return () => clearInterval(id);
  }, [total]);

  const done = shown >= total;

  // Reveal only the first `shown` characters across the token stream.
  let remaining = shown;
  const visible = tokens.map((tok, i) => {
    if (remaining <= 0) return null;
    const slice = tok.text.slice(0, remaining);
    remaining -= slice.length;
    return (
      <span key={i} className={tok.className}>
        {slice}
      </span>
    );
  });

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-card shadow-glow">
      {/* Editor window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-xs text-slate-500">
          developer.ts
        </span>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-5 text-left font-mono text-[13px] leading-relaxed sm:text-sm">
        <code className="whitespace-pre">
          {visible}
          <span
            aria-hidden
            className={`ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-neon ${
              done ? 'animate-pulse' : ''
            }`}
          />
        </code>
      </pre>
    </div>
  );
}
