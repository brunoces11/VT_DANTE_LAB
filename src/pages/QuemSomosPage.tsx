import Header from '@/components/header';
import Assinatura from '@/components/assinatura';
import { Users, User } from 'lucide-react';

export default function QuemSomosPage() {
  const nossoTime = [
    {
      nome: 'José Eduardo',
      cargo: 'CEO',
      description: 'Idealizador, Liderança Estratégica e Visão de Negócio'
    },
    {
      nome: 'Bruno Cesar',
      cargo: 'CTO',
      description: 'Arquitetura de IA, Engenharia de Prompt e UI/UX Design'
    },
    {
      nome: 'Erik Mattfeldt',
      cargo: 'Planejamento e Marketing',
      description: 'Estratégia de mercado e crescimento'
    },
    {
      nome: 'Alessandra de Liz',
      cargo: 'Curadoria e Base Legal',
      description: 'Expertise jurídica e validação legal'
    },
    {
      nome: 'Nina',
      cargo: 'Gerência de Projeto',
      description: 'Coordenação e gestão de projetos'
    },
    {
      nome: 'Jefferson',
      cargo: 'Suporte Jurídico',
      description: 'Assistência especializada em direito'
    },
    {
      nome: 'Samara',
      cargo: 'Suporte Operacional',
      description: 'Atendimento e suporte aos usuários'
    },
    {
      nome: 'Rafaela',
      cargo: 'Suporte Logístico',
      description: 'Organização e processos internos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 mt-16">
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

          {/* Nosso Time Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nosso Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nossoTime.map((pessoa, index) => {
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                      {/* Photo Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-2 border-gray-300">
                        <User className="w-10 h-10 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pessoa.nome}</h3>
                    <p className="text-amber-700 font-medium mb-3">{pessoa.cargo}</p>
                    <p className="text-sm text-gray-600">{pessoa.description}</p>
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



        </div>
      </main>
      
      <Assinatura />
    </div>
  );
}