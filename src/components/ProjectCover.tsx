import {
  ShoppingCart,
  ShieldCheck,
  LayoutDashboard,
  Palette,
  Smartphone,
  UserRound,
  Code2,
  type LucideIcon,
} from 'lucide-react';

/**
 * A generated cover banner for a project — no image files, no external
 * service. The look is derived from the project's category so each card
 * reads at a glance (cart = e-commerce, shield = auth, …) while staying
 * on-brand with the site's dark/neon palette.
 */
type Theme = {
  Icon: LucideIcon;
  /** Tailwind classes for the tinted background wash. */
  wash: string;
  /** Accent colour for the icon, rules and category chip. */
  accent: string;
  /** Border tint. */
  ring: string;
};

const THEMES: Record<string, Theme> = {
  'E-commerce': {
    Icon: ShoppingCart,
    wash: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    accent: 'text-emerald-300',
    ring: 'ring-emerald-400/30',
  },
  Authentication: {
    Icon: ShieldCheck,
    wash: 'from-indigo-500/25 via-violet-500/10 to-transparent',
    accent: 'text-indigo-300',
    ring: 'ring-indigo-400/30',
  },
  'Dashboard / Admin': {
    Icon: LayoutDashboard,
    wash: 'from-amber-500/25 via-orange-500/10 to-transparent',
    accent: 'text-amber-300',
    ring: 'ring-amber-400/30',
  },
  'UI / Theme': {
    Icon: Palette,
    wash: 'from-fuchsia-500/25 via-pink-500/10 to-transparent',
    accent: 'text-fuchsia-300',
    ring: 'ring-fuchsia-400/30',
  },
  'Mobile App': {
    Icon: Smartphone,
    wash: 'from-cyan-500/25 via-sky-500/10 to-transparent',
    accent: 'text-cyan-300',
    ring: 'ring-cyan-400/30',
  },
  Portfolio: {
    Icon: UserRound,
    wash: 'from-purple-500/25 via-violet-500/10 to-transparent',
    accent: 'text-purple-300',
    ring: 'ring-purple-400/30',
  },
  'Web App': {
    Icon: Code2,
    wash: 'from-neon/25 via-neon-cyan/10 to-transparent',
    accent: 'text-neon',
    ring: 'ring-neon/30',
  },
};

const themeFor = (category: string): Theme => THEMES[category] ?? THEMES['Web App'];

export default function ProjectCover({
  title,
  category,
  language,
  variant = 'card',
}: {
  title: string;
  category: string;
  language?: string | null;
  variant?: 'card' | 'hero';
}) {
  const { Icon, wash, accent, ring } = themeFor(category);
  const isHero = variant === 'hero';

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-surface ${
        isHero ? 'aspect-[3/1]' : ''
      }`}
    >
      {/* Category-tinted wash */}
      <div className={`absolute inset-0 bg-gradient-to-br ${wash}`} />

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.5) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: isHero ? '40px 40px' : '28px 28px',
        }}
      />

      {/* Oversized watermark icon */}
      <Icon
        className={`absolute ${accent} opacity-[0.13]`}
        style={{
          right: isHero ? '-2%' : '-6%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: isHero ? '38%' : '52%',
          height: 'auto',
        }}
        strokeWidth={1}
      />

      {/* Foreground content */}
      <div
        className={`relative flex h-full flex-col justify-end ${
          isHero ? 'p-7 sm:p-10' : 'p-5'
        }`}
      >
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-bg/60 px-2.5 py-1 text-[11px] font-medium ring-1 backdrop-blur ${accent} ${ring}`}
        >
          <Icon size={12} strokeWidth={2.5} />
          {category}
        </span>

        <h3
          className={`mt-2.5 font-bold leading-tight text-white ${
            isHero ? 'text-3xl sm:text-5xl' : 'text-lg'
          }`}
        >
          {title}
        </h3>

        {language && (
          <p
            className={`mt-1 font-mono text-slate-400 ${
              isHero ? 'text-sm' : 'text-[11px]'
            }`}
          >
            {language}
          </p>
        )}
      </div>

      {/* Bottom accent rule */}
      <div
        className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent to-transparent ${accent.replace(
          'text-',
          'via-'
        )}`}
      />
    </div>
  );
}
