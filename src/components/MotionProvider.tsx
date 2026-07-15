'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Framer Motion animates via JS, so the `prefers-reduced-motion` block in
 * globals.css does not reach it. `reducedMotion="user"` makes Framer honour the
 * OS setting: transform/layout animations are dropped while opacity fades are
 * kept, so nothing is left stranded at opacity:0.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
