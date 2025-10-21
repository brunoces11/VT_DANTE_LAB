import React from 'react';
import { Link } from 'react-router-dom';
import Assinatura from '@/components/assinatura';
import { ArrowLeft } from 'lucide-react';

export default function TermosUsoPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-gray-600 mb-8">Última atualização: 21 de janeiro de 2025</p>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Bem-vindo ao Dante IA! Ao usar nossa plataforma, você concorda com estes Termos de Uso. O Dante IA é 
              uma Inteligência Artificial especializada em direito registral e notarial, focada em registro de imóveis. 
              A aceitação destes termos é obrigatória para o uso do sistema, pois nossos serviços dependem diretamente 
              do processamento das informações que você nos fornece.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Uso da Plataforma</h2>
              <p className="text-gray-700">
                Você concorda em usar o Dante IA apenas para fins lícitos e de acordo com as funcionalidades oferecidas. 
                É sua responsabilidade garantir a confidencialidade de suas credenciais de acesso. Nossa plataforma é 
                destinada exclusivamente para consultas jurídicas relacionadas ao direito registral e notarial.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Processamento de Dados e Documentos</h2>
              <p className="text-gray-700 mb-4">
                Para que os agentes de IA funcionem adequadamente, processamos os documentos e dados que você insere. 
                Garantimos que:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Todos os arquivos são processados internamente, com a finalidade exclusiva de fornecer os serviços da plataforma.</li>
                <li>Seus dados são salvos e associados apenas à sua conta. Você tem controle total para excluir permanentemente suas conversas e documentos a qualquer momento.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Histórico e Anonimização</h2>
              <p className="text-gray-700">
                Analisamos o histórico de conversas de forma anonimizada para melhorar a plataforma e desenvolver novos 
                recursos especializados em direito registral. Nenhum dado pessoal é mantido nesses históricos de análise. 
                Conforme a LGPD, você pode solicitar a anonimização completa de seus dados enviando um email para 
                <a href="mailto:contato@dante-ia.com" className="text-amber-700 hover:text-amber-800 ml-1">
                  contato@dante-ia.com
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Rescisão de Uso</h2>
              <p className="text-gray-700">
                Caso não concorde com estes termos, você não poderá utilizar o sistema. A não concordância impede o 
                funcionamento dos nossos serviços. Oferecemos múltiplas formas de exclusão de dados para garantir seu 
                controle e privacidade.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitações de Responsabilidade</h2>
              <p className="text-gray-700">
                O Dante IA fornece informações baseadas na legislação vigente, mas não substitui a consulta a um 
                advogado qualificado. As respostas fornecidas são para fins informativos e educacionais, devendo sempre 
                ser validadas por um profissional do direito antes de qualquer tomada de decisão.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contato</h2>
              <p className="text-gray-700">
                Para qualquer dúvida sobre estes Termos de Uso, entre em contato conosco através do email: 
                <a href="mailto:contato@dante-ia.com" className="text-amber-700 hover:text-amber-800 ml-1">
                  contato@dante-ia.com
                </a>.
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