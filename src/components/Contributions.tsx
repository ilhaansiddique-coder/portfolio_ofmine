'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, GitCommitHorizontal, CalendarDays } from 'lucide-react';
import type { Contributions as ContribData, ContribDay } from '@/lib/contributions';
import { config } from '@/config';
import { SectionHeading } from './Section';

const LEVEL_COLORS = [
  'rgba(255,255,255,0.06)',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

type Week = (ContribDay | null)[];

export default function Contributions({ data }: { data: ContribData }) {
  const { weeks, monthLabels } = useMemo(() => buildGrid(data.days), [data.days]);

  return (
    <section id="activity" className="scroll-mt-24 py-24">
      <SectionHeading eyebrow="Consistency" title="I Push Code Every Day" />

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<GitCommitHorizontal size={20} />}
          value={data.total.toLocaleString()}
          label="Contributions / yr"
          tint="text-neon"
        />
        <StatCard
          icon={<Flame size={20} />}
          value={data.currentStreak.toString()}
          label="Current streak"
          tint="text-orange-400"
        />
        <StatCard
          icon={<Trophy size={20} />}
          value={data.longestStreak.toString()}
          label="Longest streak"
          tint="text-amber-400"
        />
        <StatCard
          icon={<CalendarDays size={20} />}
          value={data.bestDay.count.toString()}
          label="Best day"
          tint="text-neon-cyan"
        />
      </div>

      {/* Heatmap card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-line bg-card p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">
            {data.available
              ? `${data.total.toLocaleString()} contributions in the last year`
              : 'Contribution activity'}
          </h3>
          <a
            href={`https://github.com/${config.github.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 transition-colors hover:text-neon"
          >
            @{config.github.username}
          </a>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-2">
            {/* Month labels */}
            <div className="flex pl-9">
              {weeks.map((_, wi) => (
                <div
                  key={wi}
                  className="w-[15px] text-[10px] text-slate-500"
                  style={{ minWidth: 15 }}
                >
                  {monthLabels[wi] ?? ''}
                </div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {/* Weekday labels */}
              <div className="mr-1 flex flex-col gap-[3px] pt-[1px]">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={i}
                    className="h-3 text-[9px] leading-3 text-slate-500"
                    style={{ width: 24 }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <Cell key={di} day={day} delay={(wi * 7 + di) * 0.0006} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-slate-500">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-[3px]"
              style={{ backgroundColor: c }}
            />
          ))}
          <span>More</span>
        </div>

        {!data.available && (
          <p className="mt-3 text-center text-xs text-slate-500">
            Live calendar loads at build time on GitHub Actions (sandbox preview shown).
          </p>
        )}
      </motion.div>
    </section>
  );
}

function Cell({ day, delay }: { day: ContribDay | null; delay: number }) {
  if (!day) return <div className="h-3 w-3" />;
  const color = LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0];
  const title =
    day.date && !day.date.startsWith('cell-')
      ? `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`
      : undefined;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay }}
      title={title}
      className="h-3 w-3 rounded-[3px] ring-1 ring-inset ring-white/5"
      style={{ backgroundColor: color }}
    />
  );
}

function StatCard({
  icon,
  value,
  label,
  tint,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="card-hover rounded-2xl border border-line bg-card p-4 text-center"
    >
      <div className={`mb-1 flex justify-center ${tint}`}>{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </motion.div>
  );
}

/** Group daily contributions into Sunday-aligned week columns + month labels. */
function buildGrid(days: ContribDay[]): {
  weeks: Week[];
  monthLabels: (string | null)[];
} {
  if (days.length === 0) return { weeks: [], monthLabels: [] };

  const isReal = !days[0].date.startsWith('cell-');

  // Pad the start so the first column begins on Sunday.
  let padded: (ContribDay | null)[] = [...days];
  if (isReal) {
    const firstWeekday = new Date(days[0].date + 'T00:00:00').getDay(); // 0=Sun
    padded = [...Array(firstWeekday).fill(null), ...days];
  }

  const weeks: Week[] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // One month label per column, shown when the month changes.
  const monthLabels: (string | null)[] = weeks.map((week, wi) => {
    const firstReal = week.find((d) => d && !d.date.startsWith('cell-'));
    if (!firstReal) return null;
    const month = new Date(firstReal.date + 'T00:00:00').getMonth();
    const prevWeek = weeks[wi - 1];
    const prevReal = prevWeek?.find((d) => d && !d.date.startsWith('cell-'));
    const prevMonth = prevReal
      ? new Date(prevReal.date + 'T00:00:00').getMonth()
      : -1;
    return month !== prevMonth ? MONTHS[month] : null;
  });

  return { weeks, monthLabels };
}
