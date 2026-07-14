'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Globe, Phone, MessageCircle, FileText } from 'lucide-react';
import { config } from '@/config';
import { SectionHeading } from './Section';

export default function Contact() {
  const { social } = config;

  const items = [
    social.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${social.whatsapp}`,
    },
    social.phone && {
      icon: Phone,
      label: 'Call',
      href: `tel:${social.phone}`,
    },
    social.email && {
      icon: Mail,
      label: 'Email',
      href: `mailto:${social.email}`,
    },
    social.github && { icon: Github, label: 'GitHub', href: social.github },
    social.resume && { icon: FileText, label: 'Resume', href: social.resume },
    social.linkedin && { icon: Linkedin, label: 'LinkedIn', href: social.linkedin },
    social.twitter && { icon: Twitter, label: 'Twitter', href: social.twitter },
    social.website && { icon: Globe, label: 'Website', href: social.website },
  ].filter(Boolean) as { icon: typeof Github; label: string; href: string }[];

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <SectionHeading eyebrow="Say hello" title="Get In Touch" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line bg-card p-10 text-center sm:p-14"
      >
        <p className="relative text-lg text-slate-300">
          Have a web app, SaaS dashboard, backend system or mobile product in mind? I&apos;m open to discussing serious builds and long-term engineering work.
        </p>

        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          {items.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={
                href.startsWith('mailto:') || href.startsWith('tel:')
                  ? undefined
                  : '_blank'
              }
              rel="noreferrer"
              className="btn-ghost"
            >
              <Icon size={18} /> {label}
            </a>
          ))}
        </div>

        {items.length === 0 && (
          <p className="relative mt-6 text-sm text-slate-500">
            Add your links in{' '}
            <code className="font-mono text-neon-cyan">src/config.ts</code> →{' '}
            <code className="font-mono text-neon-cyan">social</code>.
          </p>
        )}
      </motion.div>
    </section>
  );
}
