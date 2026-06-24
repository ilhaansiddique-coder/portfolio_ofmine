import { config } from '@/config';

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-sm text-slate-500 sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {config.name}. Built with Next.js &
          Tailwind.
        </p>
        <p className="font-mono text-xs">
          Projects synced live from{' '}
          <a
            href={`https://github.com/${config.github.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-neon transition-colors hover:text-neon-cyan"
          >
            @{config.github.username}
          </a>
        </p>
      </div>
    </footer>
  );
}
