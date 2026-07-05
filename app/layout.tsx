import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://githubportifoliogenerator.vercel.app';

const siteDescription =
  'Transforme seu perfil GitHub em um portfólio profissional em segundos. ' +
  'Análise automática de repositórios, linguagens e projetos para criar uma apresentação elegante das suas habilidades como desenvolvedor.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GitHub Portfolio Generator — Crie seu portfólio em segundos',
    template: '%s | GitHub Portfolio Generator',
  },
  description: siteDescription,
  applicationName: 'GitHub Portfolio Generator',
  keywords: [
    'GitHub portfolio generator',
    'portfólio desenvolvedor',
    'criar portfólio GitHub',
    'portfolio programador',
    'GitHub profile portfolio',
    'developer portfolio generator',
    'portfólio online grátis',
    'Next.js',
    'open source portfolio',
    'GitHub API portfolio',
  ],
  authors: [{ name: 'GitHub Portfolio Generator' }],
  creator: 'GitHub Portfolio Generator',
  category: 'developer tools',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'GitHub Portfolio Generator',
    title: 'GitHub Portfolio Generator — Crie seu portfólio em segundos',
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Portfolio Generator — Crie seu portfólio em segundos',
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GitHub Portfolio Generator',
  description: siteDescription,
  url: siteUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Análise automática de repositórios GitHub',
    'Geração de portfólio em tempo real',
    'Personalização via portfolio.json',
    'Linha do tempo de experiência profissional',
    'Suporte a links sociais (LinkedIn, website, email)',
    'SEO otimizado com Open Graph e Twitter Card',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}