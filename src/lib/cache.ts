import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Tiny on-disk JSON cache for GitHub responses.
 *
 * Why: the unauthenticated GitHub API allows only 60 requests/hour. Once a
 * fetch succeeds we persist it here, so when GitHub later rate-limits us
 * (403) the site still renders from the last good copy instead of going
 * blank. The cache survives `npm run clean` (it lives outside .next) and is
 * git-ignored. Add a token to skip rate limits entirely.
 */
const CACHE_DIR = path.join(process.cwd(), '.gh-cache');

const keyFor = (key: string) =>
  crypto.createHash('sha1').update(key).digest('hex');

export async function readCache<T = unknown>(key: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(
      path.join(CACHE_DIR, keyFor(key) + '.json'),
      'utf-8'
    );
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeCache(key: string, data: unknown): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(CACHE_DIR, keyFor(key) + '.json'),
      JSON.stringify(data)
    );
  } catch {
    /* cache is best-effort; ignore write failures */
  }
}
