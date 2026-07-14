import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { config } from '@/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ilhaansiddique-coder.github.io/portfolio_ofmine';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${config.name} — ${config.role}`,
    template: `%s — ${config.name}`,
  },
  description: config.tagline,
  keywords: ['Full-Stack Developer', 'Next.js', 'TypeScript', 'PostgreSQL', 'React', 'Node.js', 'Portfolio'],
  authors: [{ name: config.name }],
  creator: config.name,
  openGraph: {
    title: `${config.name} — ${config.role}`,
    description: config.tagline,
    url: baseUrl,
    siteName: `${config.name} Portfolio`,
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: config.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.name} — ${config.role}`,
    description: config.tagline,
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly,
          etc.) inject attributes like `cz-shortcut-listen` onto <body> on the
          client, which otherwise triggers a harmless hydration warning. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
