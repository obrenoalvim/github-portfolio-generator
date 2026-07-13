"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Code,
  ArrowLeft,
  Linkedin,
  Globe,
  Mail,
} from 'lucide-react';
import ExperienceTimeline from '@/components/ExperienceTimeline';


interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  company: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  email: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  topics: string[];
}

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  summary?: string;
  highlights?: string[];
}

interface Config {
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  sections?: {
    about?: string;
    skills?: string[];
    featured?: string[];
    experience?: ExperienceItem[];
  };
  social?: {
    linkedin?: string;
    website?: string;
    email?: string;
  };
}

// Metadata básico (genérico)



export default function UsernamePage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [autoLinkedin, setAutoLinkedin] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (uname: string) => {
    try {
      setLoading(true);
      setError(null);

      // Perfil
      const userResponse = await fetch(`https://api.github.com/users/${uname}`);
      if (!userResponse.ok) {
        throw new Error('Usuário não encontrado');
      }
      const userData: GitHubUser = await userResponse.json();
      setUser(userData);

      // Repositórios
      const reposResponse = await fetch(
        `https://api.github.com/users/${uname}/repos?sort=updated&per_page=20`
      );
      const reposData: Repository[] = await reposResponse.json();

      const unameLower = String(uname).toLowerCase();
      const filteredRepos = reposData
        .filter((repo) => !repo.name.toLowerCase().includes('fork'))
        .filter((repo) => {
          const repoNameLower = repo.name.toLowerCase();
          return (
            repoNameLower !== 'config' &&
            repoNameLower !== 'readme' &&
            repoNameLower !== unameLower
          );
        });
      setRepositories(filteredRepos);

      // Config opcional
      try {
        const configResponse = await fetch(
          `https://api.github.com/repos/${uname}/config/contents/portfolio.json`
        );
        if (configResponse.ok) {
          const configData = await configResponse.json();
          const base64 = String(configData.content || '').replace(/\n/g, '');
          if (base64) {
            const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
            const text = new TextDecoder('utf-8').decode(binary);
            const configContent: Config = JSON.parse(text);
            setConfig(configContent);
          }
        }
      } catch {
        // Config é opcional
      }

      // LinkedIn detectado via Social accounts do GitHub (opcional)
      try {
        const socialResponse = await fetch(
          `https://api.github.com/users/${uname}/social_accounts`
        );
        if (socialResponse.ok) {
          const socialAccounts: { provider: string; url: string }[] = await socialResponse.json();
          setAutoLinkedin(socialAccounts.find((a) => a.provider === 'linkedin')?.url);
        }
      } catch {
        // Social accounts é opcional
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchUserData(username);
  }, [username]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !user) {
    return <ErrorState error={error} onBack={() => router.push('/')} />;
  }

  const theme = config?.theme || {};
  const primaryColor = theme.primaryColor || '#3B82F6';
  const backgroundColor = theme.backgroundColor || '#F8FAFC';

  const linkedinUrl = config?.social?.linkedin
    ? `https://linkedin.com/in/${config.social.linkedin}`
    : autoLinkedin;

  const featuredRepos = config?.sections?.featured && config.sections
    ? repositories.filter((repo) => config.sections!.featured?.includes(repo.name))
    : repositories.slice(0, 6);

  const topLanguages = repositories
    .filter((repo) => !!repo.language)
    .reduce<Record<string, number>>((acc, repo) => {
      const lang = repo.language as string;
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

  const sortedLanguages = Object.entries(topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <main className="min-h-screen" style={{ backgroundColor }}>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8 text-center">
                <Image
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  width={128}
                  height={128}
                  priority
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
                />
                
                <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                  {user.name || user.login}
                </h1>
                
                <p className="text-gray-600 mb-4">@{user.login}</p>
                
                {user.bio && (
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {config?.sections?.about || user.bio}
                  </p>
                )}

                <div className="space-y-3 text-sm text-gray-600">
                  {user.location && (
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.company && (
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(user.created_at).getFullYear()}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center flex-wrap gap-3 mt-6">
                  <Button variant="outline" size="sm" asChild>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  
                  {linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  
                  {(config?.social?.website || user.blog) && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={config?.social?.website || user.blog} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}

                  {(config?.social?.email || user.email) && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${config?.social?.email || user.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats abaixo do card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-none shadow-lg text-center">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                    {user.public_repos}
                  </div>
                  <div className="text-gray-600">Repositórios</div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg text-center">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                    {user.followers}
                  </div>
                  <div className="text-gray-600">Seguidores</div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg text-center">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                    {repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
                  </div>
                  <div className="text-gray-600">Stars Total</div>
                </CardContent>
              </Card>
            </div>

            {/* Tecnologias abaixo do card */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" style={{ color: primaryColor }} />
                  <span>Principais Tecnologias</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {config?.sections?.skills ? (
                    config.sections.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    sortedLanguages.map(([language, count]) => (
                      <Badge key={language} variant="secondary" className="text-sm py-1 px-3">
                        {language} ({count})
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Linha do tempo de experiência no topo da coluna direita */}
            <ExperienceTimeline
              experiences={config?.sections?.experience || []}
              primaryColor={primaryColor}
            />
          </div>
        </div>

        {/* Repositories */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center space-x-3">
            <BookOpen className="h-8 w-8" style={{ color: primaryColor }} />
            <span>Projetos em Destaque</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRepos.map((repo) => (
              <Card key={repo.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-1">
                      {repo.name}
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  {repo.description && (
                    <CardDescription className="line-clamp-2">
                      {repo.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Topics */}
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Stats and Language */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        {repo.language && (
                          <span className="flex items-center space-x-1">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: primaryColor }}
                            />
                            <span>{repo.language}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forks_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {repositories.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  Ver todos os {user.public_repos} repositórios no GitHub
                  <Github className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Portfólio gerado automaticamente via{' '}
            <a href="/" className="font-medium hover:underline" style={{ color: primaryColor }}>
              GitHub Portfolio Generator
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-24 mb-8" />
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton className="w-3 h-3 rounded-full mt-2" />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onBack }: { error: string | null; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="p-6 bg-red-50 rounded-full w-fit mx-auto">
          <Github className="h-12 w-12 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Ops! Algo deu errado
          </h1>
          <p className="text-gray-600">
            {error || 'Não foi possível carregar o perfil do GitHub'}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <p className="text-sm text-gray-500">
            Verifique se o nome de usuário está correto e se o perfil é público
          </p>
        </div>
      </div>
    </div>
  );
}