import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Code, TrendingUp, Scale, UserCheck, Headphones, Truck } from 'lucide-react';

export default function QuemSomosPage() {
  const socios = [
    {
      nome: 'José Eduardo',
      cargo: 'CEO',
      icon: Crown,
      description: 'Liderança estratégica e visão de negócio'
    },
    {
      nome: 'Bruno Cesar',
      cargo: 'CTO',
      icon: Code,
      description: 'Arquitetura tecnológica e desenvolvimento'
    },
    {
      nome: 'Erik Mattfeldt',
      cargo: 'Planejamento e Marketing',
      icon: TrendingUp,
      description: 'Estratégia de mercado e crescimento'
    },
    {
      nome: 'Alessandra de Liz',
      cargo: 'Curadoria e Base Legal',
      icon: Scale,
      description: 'Expertise jurídica e validação legal'
    }
  ];

  const equipe = [
    {
      nome: 'Nina',
      cargo: 'Gerência de Projeto',
      icon: UserCheck,
      description: 'Coordenação e gestão de projetos'
    },
    {
      nome: 'Jefferson',
      cargo: 'Suporte Jurídico',
      icon: Scale,
      description: 'Assistência especializada em direito'
    },
    {
      nome: 'Samara',
      cargo: 'Suporte Operacional',
      icon: Headphones,
      description: 'Atendimento e suporte aos usuários'
    },
    {
      nome: 'Rafaela',
      cargo: 'Suporte Logístico',
      icon: Truck,
      description: 'Organização e processos internos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para página inicial
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-amber-700" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quem Somos</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos uma equipe especializada em tecnologia jurídica, dedicada a revolucionar o acesso 
              à informação legal através da inteligência artificial aplicada ao direito registral e notarial.
            </p>
          </div>

          {/* Sócios Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sócios Fundadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socios.map((socio, index) => {
                const IconComponent = socio.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-amber-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{socio.nome}</h3>
                    <p className="text-amber-700 font-medium mb-3">{socio.cargo}</p>
                    <p className="text-sm text-gray-600">{socio.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Equipe Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossa Equipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipe.map((membro, index) => {
                const IconComponent = membro.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-blue-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{membro.nome}</h3>
                    <p className="text-blue-700 font-medium mb-3">{membro.cargo}</p>
                    <p className="text-sm text-gray-600">{membro.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mission Section */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Democratizar o acesso à informação jurídica especializada em direito registral e notarial, 
                oferecendo uma ferramenta de inteligência artificial que combina precisão técnica, 
                embasamento legal sólido e facilidade de uso. Nosso objetivo é empoderar profissionais 
                do direito, cartórios e cidadãos com respostas rápidas, confiáveis e fundamentadas na 
                legislação vigente.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Precisão Legal</h3>
                <p className="text-gray-600">
                  Compromisso com a exatidão e fundamentação jurídica em todas as respostas fornecidas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Inovação Tecnológica</h3>
                <p className="text-gray-600">
                  Uso da mais avançada tecnologia de IA para revolucionar o acesso à informação jurídica.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Foco no Cliente</h3>
                <p className="text-gray-600">
                  Dedicação total em oferecer a melhor experiência e suporte aos nossos usuários.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link 
              to="/" 
              className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para página inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}