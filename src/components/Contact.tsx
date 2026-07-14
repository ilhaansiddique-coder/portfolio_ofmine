'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Globe, Phone, MessageCircle, FileText } from 'lucide-react';
import { config } from '@/config';
import { SectionHeading } from './Section';
import ContactForm from './ContactForm';

export default function Contact() {
  const { social } = config;
  const whatsappNumber = social.whatsapp.replace(/\D/g, '');

  const items = [
    social.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}`,
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
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-line bg-card p-8 sm:p-12"
      >
        {/* Soft glow bleeding in from the top edge of the card. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full bg-neon/20 blur-3xl"
        />

        <p className="relative text-center text-lg text-slate-300">
          Have a web app, SaaS dashboard, backend system or mobile product in mind? I&apos;m open to discussing serious builds and long-term engineering work.
        </p>

        <div className="relative mt-8">
          <ContactForm />
        </div>

        {items.length > 0 && (
          <div className="relative mt-10">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                or reach me directly
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
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
          </div>
        )}

        {items.length === 0 && (
          <p className="relative mt-6 text-center text-sm text-slate-500">
            Add your links in{' '}
            <code className="font-mono text-neon-cyan">src/config.ts</code> →{' '}
            <code className="font-mono text-neon-cyan">social</code>.
          </p>
        )}
      </motion.div>
    </section>
  );
}
