"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, User, Code, Star, GitFork } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/${username.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Github className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitHub Portfolio Generator
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transforme seu perfil GitHub em um portfólio profissional em segundos. 
              Nosso sistema analisa automaticamente seus repositórios, projetos e 
              atividades para criar uma apresentação elegante das suas habilidades.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Digite seu username do GitHub"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!username.trim()}
              >
                Gerar Meu Portfólio
              </Button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              Exemplo: <button 
                onClick={() => setUsername('octocat')} 
                className="text-blue-600 hover:underline font-medium"
              >
                octocat
              </button>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Análise Automática</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Analisamos automaticamente seus repositórios, linguagens de programação 
                  e contribuições para destacar suas principais habilidades e projetos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Personalização</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Crie um repositório "config" para personalizar cores, layout e 
                  informações adicionais do seu portfólio de forma totalmente customizada.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                  <GitFork className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Sempre Atualizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Seu portfólio é gerado em tempo real, sempre refletindo seus 
                  projetos mais recentes e atividades no GitHub.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Como Funciona</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-lg font-semibold">Digite seu Username</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Insira seu nome de usuário do GitHub no campo acima
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Processamento</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Coletamos dados do seu perfil e repositórios via API do GitHub
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold">Portfólio Pronto</h3>
                </div>
                <p className="text-gray-600 ml-11">
                  Seu portfólio profissional é gerado instantaneamente
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Dica de Personalização</h2>
            <div className="text-left space-y-4">
              <p className="text-gray-700">
                Para personalizar seu portfólio, crie um repositório público chamado <code className="bg-white px-2 py-1 rounded text-sm font-mono">config</code> 
                no seu GitHub com um arquivo <code className="bg-white px-2 py-1 rounded text-sm font-mono">portfolio.json</code>:
              </p>
              
              <div className="bg-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-800">{`{
  "theme": {
    "primaryColor": "#3B82F6",
    "backgroundColor": "#F8FAFC",
    "textColor": "#1E293B"
  },
  "sections": {
    "about": "Desenvolvedor apaixonado por...",
    "skills": ["JavaScript", "React", "Node.js"],
    "featured": ["repo1", "repo2", "repo3"]
  },
  "social": {
    "linkedin": "seu-linkedin",
    "website": "https://seusite.com"
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}