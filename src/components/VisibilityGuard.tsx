'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeOff, ArrowLeft } from 'lucide-react';
import { useVisibility } from '@/lib/visibility';

/**
 * Wraps a project's detail-page content. If the project is hidden in this
 * browser and owner mode is OFF, the content is replaced with a "private"
 * notice — so a hidden card's detail page can't be reached by its URL either.
 *
 * Note: this is a client-side guard (the page itself is statically rendered),
 * so it hides the project for THIS browser. To make a project private to the
 * public, add it to `config.github.hidden` and redeploy — then the page is
 * never generated at all. Owner mode always shows the content (with a banner).
 */
export default function VisibilityGuard({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const { owner, hidden } = useVisibility();
  const [mounted, setMounted] = useState(false);

  // Render server content on first paint to avoid a hydration mismatch, then
  // re-evaluate against localStorage once we're on the client.
  useEffect(() => setMounted(true), []);

  const isHidden = hidden.includes(name);

  if (mounted && isHidden && !owner) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-5">
        <div className="pointer-events-none absolute inset-0 grid-bg" />
        <div className="relative mx-auto max-w-md rounded-2xl border border-line bg-card p-8 text-center">
          <EyeOff className="mx-auto mb-4 text-amber-400" size={32} />
          <h1 className="mb-2 text-xl font-semibold text-white">
            This project is private
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            It has been hidden from view. If you&apos;re the owner, unlock owner
            mode to see it again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neon/40 bg-neon/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neon/20"
          >
            <ArrowLeft size={15} /> Back to portfolio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {mounted && owner && isHidden && (
        <div className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-amber-400/15 px-4 py-2 text-center text-xs font-medium text-amber-200 backdrop-blur">
          <EyeOff size={13} />
          Hidden from the public — only visible to you in owner mode.
        </div>
      )}
      {children}
    </>
  );
}
