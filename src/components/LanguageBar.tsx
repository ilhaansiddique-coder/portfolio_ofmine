import type { LanguageStat } from '@/lib/github';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Shell: '#89e051',
  Vue: '#41b883',
  SCSS: '#c6538c',
};

const color = (name: string) => LANG_COLORS[name] ?? '#7c5cff';

export default function LanguageBar({ languages }: { languages: LanguageStat[] }) {
  if (!languages.length) return null;

  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {languages.map((l) => (
          <div
            key={l.name}
            style={{ width: `${l.percent}%`, backgroundColor: color(l.name) }}
            title={`${l.name} ${l.percent}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {languages.map((l) => (
          <span key={l.name} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color(l.name) }}
            />
            {l.name} <span className="text-slate-500">{l.percent}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
