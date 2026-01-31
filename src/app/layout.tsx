import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FastGross Pro × DISTRAM | Plateforme B2B Grossiste Alimentaire',
  description: 'Plateforme B2B intelligente pour grossistes alimentaires. 6 IAs spécialisées : Scan Menu, Prospection, Anti-Churn, Tournées, Stocks, Assistant Commercial.',
  keywords: 'grossiste alimentaire, B2B, IA, foodservice, kebab, tacos, halal, Lyon, Montpellier, Bordeaux',
  authors: [{ name: 'Face Media' }],
  openGraph: {
    title: 'FastGross Pro × DISTRAM',
    description: 'Plateforme B2B intelligente pour grossistes alimentaires',
    url: 'https://facemediagrossiste.web.app',
    siteName: 'FastGross Pro',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastGross Pro × DISTRAM',
    description: 'Plateforme B2B intelligente pour grossistes alimentaires',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
