'use client';


export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="section-heading mb-8" aria-label={eyebrow}>
      <h2 className="section-title text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
