import type { Metadata } from 'next';

interface GitHubUserMeta {
  name?: string;
  login?: string;
  bio?: string;
  avatar_url?: string;
  html_url?: string;
  location?: string;
  company?: string;
  public_repos?: number;
  followers?: number;
  blog?: string;
}

async function fetchGitHubUser(uname: string): Promise<GitHubUserMeta | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${uname}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<GitHubUserMeta>;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const uname = (await params).username;
  const data = await fetchGitHubUser(uname);

  if (!data) {
    return {
      title: `${uname} | Portfólio`,
      description: `Portfólio de ${uname} no GitHub`,
    };
  }

  const displayName = data.name || data.login || uname;
  const description = data.bio
    ? `${data.bio} — Portfólio de ${displayName} no GitHub`
    : `Portfólio profissional de ${displayName}: projetos open source, habilidades e contribuições no GitHub.`;

  return {
    title: `${displayName} | Portfólio`,
    description,
    alternates: {
      canonical: `/${uname}`,
    },
    openGraph: {
      type: 'profile',
      title: `${displayName} — Portfólio GitHub`,
      description,
      url: `/${uname}`,
      images: data.avatar_url
        ? [{ url: data.avatar_url, alt: `Foto de perfil de ${displayName}` }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} — Portfólio GitHub`,
      description,
      images: data.avatar_url ? [data.avatar_url] : undefined,
    },
  };
}

export default async function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const uname = (await params).username;
  const data = await fetchGitHubUser(uname);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://githubportifoliogenerator.vercel.app';
  const displayName = data?.name || data?.login || uname;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `Portfólio de ${displayName}`,
    url: `${siteUrl}/${uname}`,
    mainEntity: {
      '@type': 'Person',
      name: displayName,
      alternateName: uname,
      description: data?.bio || undefined,
      image: data?.avatar_url || undefined,
      url: data?.html_url || `https://github.com/${uname}`,
      sameAs: [
        data?.html_url || `https://github.com/${uname}`,
        data?.blog || undefined,
      ].filter(Boolean),
      worksFor: data?.company
        ? { '@type': 'Organization', name: data.company }
        : undefined,
      homeLocation: data?.location
        ? { '@type': 'Place', name: data.location }
        : undefined,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GitHub Portfolio Generator', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: displayName, item: `${siteUrl}/${uname}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
