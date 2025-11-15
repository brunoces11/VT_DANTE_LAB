import Header from '@/components/header';
import Assinatura from '@/components/assinatura';
import { Users, User, CheckCircle, Shield, FileText, Eye, Target } from 'lucide-react';

export default function QuemSomosPage() {
  const nossoTime = [
    {
      nome: 'José Eduardo de Souza',
      cargo: 'CEO/IDEALIZADOR',
      description: '35 anos de experiência no mercado Extrajudicial'
    },
    {
      nome: 'Bruno Cesar',
      cargo: 'CTO',
      description: 'Arquitetura de IA, Engenharia de Prompt e UI/UX Design'
    },
    {
      nome: 'Alessandra de Liz',
      cargo: 'Curadoria e Base Legal',
      description: 'Substituta Legal no Tabelionato de Notas e Protestos de Florianópolis/SC'
    },
    {
      nome: 'Erik Mattfeldt',
      cargo: 'Consultor de Negócios',
      description: 'Especialista em novos negócios, formalização de processos e IA. 25 anos de experiência em processo de transformação digital.'
    }
  ];

  const diferenciais = [
    {
      icon: CheckCircle,
      titulo: 'Especialistas por natureza',
      descricao: 'Conteúdo treinado em bases regulatórias e prática registral/notarial.'
    },
    {
      icon: Target,
      titulo: 'Inovação com rigor',
      descricao: 'Tecnologia de ponta, sempre fundamentada e verificável.'
    },
    {
      icon: Eye,
      titulo: 'Transparência e rastreabilidade',
      descricao: 'Respostas com fontes e histórico de respostas.'
    },
    {
      icon: Shield,
      titulo: 'Segurança e privacidade',
      descricao: 'Design orientado à LGPD e princípios de mínimo necessário.'
    },
    {
      icon: FileText,
      titulo: 'Impacto real',
      descricao: 'Padronização, eficiência e mitigação de risco no dia a dia.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Users className="w-16 h-16 text-amber-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Quem Somos</h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Somos o <span className="font-semibold text-amber-700">Dante</span>, uma legaltech especializada em segurança jurídica para o ecossistema extrajudicial.
              Unimos IA vertical em Direito Registral e Notarial a rigor técnico e aderência estrita à legislação
              (CNJ, provimentos estaduais e normas técnicas aplicáveis), para transformar a formalização de atos em
              processos mais rápidos, precisos e auditáveis sem abrir mão do legalismo que garante confiança jurídica.
            </p>
          </div>

          {/* O que nos define Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">O que nos define</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diferenciais.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-8 h-8 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.descricao}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Nosso Time Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Nosso Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {nossoTime.map((pessoa, index) => {
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-300">
                        <User className="w-12 h-12 text-amber-700" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pessoa.nome}</h3>
                    <p className="text-amber-700 font-medium mb-3 uppercase text-sm tracking-wide">{pessoa.cargo}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{pessoa.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mission Section */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Democratizar o acesso ao conhecimento jurídico em Direito Registral e Notarial, por meio de uma IA
                confiável que une precisão técnica, fundamentação normativa e uso simples.
              </p>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
                Nosso propósito é empoderar profissionais do Direito, equipes das serventias extrajudiciais (cartórios)
                e cidadãos, entregando respostas rápidas, verificáveis e alinhadas à legislação vigente, para elevar a
                segurança jurídica e a eficiência do atendimento jurídico.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Assinatura />
    </div>
  );
}
