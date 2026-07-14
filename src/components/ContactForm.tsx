'use client';

import { useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { config } from '@/config';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Toast = {
  id: number;
  type: 'success' | 'error';
  message: string;
};

const initial: FormState = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const addToast = (type: Toast['type'], message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (form.subject.trim().length < 3) e.subject = 'Subject must be at least 3 characters';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    if (form.message.length > 5000) e.message = 'Message must be under 5000 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const accessKey = config.contactFormAccessKey;

    // No key configured yet: hand the message to the visitor's mail client
    // rather than posting into the void (a static export has no /api route).
    if (!accessKey) {
      const body = `From: ${form.name} <${form.email}>\n\n${form.message}`;
      window.location.href =
        `mailto:${config.social.email}` +
        `?subject=${encodeURIComponent(form.subject)}` +
        `&body=${encodeURIComponent(body)}`;
      addToast('success', 'Opening your email app to send the message…');
      return;
    }

    setLoading(true);
    try {
      // Web3Forms accepts the post directly from the browser and emails it,
      // so this works on any static host (Netlify, GitHub Pages, …).
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: 'Portfolio contact form',
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        addToast(
          'error',
          json.message || 'Something went wrong. Please try again.'
        );
        return;
      }

      addToast('success', 'Message sent successfully! I’ll get back to you soon.');
      setForm(initial);
      setErrors({});
    } catch {
      addToast('error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="relative">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Name
            </label>
            <input
              id="cf-name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="John Doe"
              className={`w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-neon/60 focus:bg-surface focus:ring-1 focus:ring-neon/30 ${
                errors.name ? 'border-red-500/60' : 'border-line'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="john@example.com"
              className={`w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-neon/60 focus:bg-surface focus:ring-1 focus:ring-neon/30 ${
                errors.email ? 'border-red-500/60' : 'border-line'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="cf-subject" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Subject
          </label>
          <input
            id="cf-subject"
            type="text"
            value={form.subject}
            onChange={(e) => update('subject', e.target.value)}
            placeholder="Let's collaborate on..."
            className={`w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-neon/60 focus:bg-surface focus:ring-1 focus:ring-neon/30 ${
              errors.subject ? 'border-red-500/60' : 'border-line'
            }`}
          />
          {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="cf-message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
            Message
          </label>
          <textarea
            id="cf-message"
            rows={5}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Tell me about your project, idea, or just say hello..."
            className={`w-full resize-none rounded-xl border bg-surface/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-neon/60 focus:bg-surface focus:ring-1 focus:ring-neon/30 ${
              errors.message ? 'border-red-500/60' : 'border-line'
            }`}
          />
          <div className="mt-1 flex justify-between">
            {errors.message ? (
              <p className="text-xs text-red-400">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-500">{form.message.length}/5000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={18} /> Send Message
            </>
          )}
        </button>
      </motion.form>

      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200'
                : 'border-red-500/40 bg-red-950/90 text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-400" />
            )}
            <p className="max-w-xs text-sm">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-2 shrink-0 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
