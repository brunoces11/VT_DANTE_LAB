import React from 'react';
import { Link } from 'react-router-dom';
import Assinatura from '@/components/assinatura';
import { ArrowLeft } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
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
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-gray-600 mb-8">Última atualização: 21 de janeiro de 2025</p>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              A sua privacidade é fundamental para nós do Dante IA. Esta Política de Privacidade explica como coletamos, 
              usamos, armazenamos e protegemos suas informações. Ao utilizar nossa plataforma, você concorda com as 
              práticas descritas aqui.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Coleta de Informações</h2>
              <p className="text-gray-700 mb-4">
                Coletamos as informações que você nos fornece diretamente, como dados de criação de conta (nome, email). 
                Também processamos os documentos e dados que você insere em nossa plataforma para o uso dos nossos 
                agentes de IA especializados em direito registral e notarial.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso das Informações</h2>
              <p className="text-gray-700 mb-4">As informações são usadas para:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fornecer, manter e melhorar nossos serviços, incluindo o treinamento e a operação dos agentes de IA especializados em registro de imóveis.</li>
                <li>Processar seus documentos e dados para fornecer as respostas e análises jurídicas solicitadas. Todos os documentos são processados internamente para garantir a confidencialidade.</li>
                <li>Analisar o histórico de conversas de forma anonimizada para entender o comportamento do usuário e desenvolver novos recursos. Seus dados pessoais não são associados a esses históricos.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Armazenamento e Exclusão de Dados</h2>
              <p className="text-gray-700 mb-4">
                Seus dados e documentos são armazenados de forma segura e associados exclusivamente à sua conta. 
                Oferecemos ferramentas para que você tenha controle total sobre suas informações:
              </p>
              <p className="text-gray-700">
                Você pode excluir conversas individuais ou todos os seus documentos a qualquer momento. A exclusão é 
                permanente e remove os dados de nossos sistemas.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Seus Direitos (LGPD)</h2>
              <p className="text-gray-700">
                De acordo com a Lei Geral de Proteção de Dados (LGPD) do Brasil, você tem o direito de solicitar a 
                anonimização dos seus dados. Para fazer essa solicitação, entre em contato conosco pelo email: 
                <a href="mailto:contato@dante-ia.com" className="text-amber-700 hover:text-amber-800 ml-1">
                  contato@dante-ia.com
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Compartilhamento de Informações</h2>
              <p className="text-gray-700">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando 
                exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contato</h2>
              <p className="text-gray-700">
                Se tiver qualquer dúvida sobre esta política, entre em contato conosco: 
                <a href="mailto:contato@dante-ia.com" className="text-amber-700 hover:text-amber-800 ml-1">
                  contato@dante-ia.com
                </a>
              </p>
            </section>
          </div>

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
      
      <Assinatura />
    </div>
  );
}