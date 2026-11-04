'use client';

import { Code2, Database, ShieldCheck, ServerCog } from 'lucide-react';
import { config } from '@/config';
import { SectionHeading } from './Section';

const icons = [Code2, Database, ShieldCheck, ServerCog];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-24">
      <SectionHeading eyebrow="Engineering capabilities" title="From product interface to deployment" />

      <div className="grid gap-5 md:grid-cols-2">
        {config.services.map((service, index) => {
          const Icon = icons[index] ?? Code2;
          return (
            <article
              key={service.title}
              className="card-hover rounded-2xl border border-line bg-card p-6"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-400">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.skills.map((skill) => (
                  <span key={skill}
              className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
