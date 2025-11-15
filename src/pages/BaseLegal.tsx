import React from 'react';
import Header from '@/components/header';
import Assinatura from '@/components/assinatura';
import { Calendar, FileText, CheckCircle, Clock } from 'lucide-react';

export default function BaseLegal() {
  const legalUpdates = [
    {
      date: '15/Jan/2025',
      title: 'Lei 6.015/73 - Lei de Registros Públicos',
      description: 'Atualização completa da base legal com as últimas alterações e interpretações jurisprudenciais.',
      status: 'updated',
      category: 'Lei Federal'
    },
    {
      date: '12/Jan/2025',
      title: 'Provimento CNJ nº 88/2019',
      description: 'Normas gerais da atividade notarial e de registro - versão consolidada.',
      status: 'updated',
      category: 'Provimento CNJ'
    },
    {
      date: '10/Jan/2025',
      title: 'Código Civil - Arts. 1.245 a 1.247',
      description: 'Artigos específicos sobre registro de imóveis e transmissão de propriedade.',
      status: 'updated',
      category: 'Lei Federal'
    },
    {
      date: '08/Jan/2025',
      title: 'Lei 8.935/94 - Lei dos Cartórios',
      description: 'Regulamentação dos serviços notariais e de registro.',
      status: 'updated',
      category: 'Lei Federal'
    },
    {
      date: '05/Jan/2025',
      title: 'Provimento CNJ nº 65/2017',
      description: 'Institui modelos únicos de certidões de nascimento, casamento e óbito.',
      status: 'updated',
      category: 'Provimento CNJ'
    },
    {
      date: '03/Jan/2025',
      title: 'Código de Normas - SC',
      description: 'Código de Normas da Corregedoria-Geral da Justiça de Santa Catarina.',
      status: 'updated',
      category: 'Norma Estadual'
    },
    {
      date: '28/Dez/2024',
      title: 'Provimento CNJ nº 47/2016',
      description: 'Dispõe sobre a gratuidade do registro de nascimento e do assento de óbito.',
      status: 'updated',
      category: 'Provimento CNJ'
    },
    {
      date: '20/Dez/2024',
      title: 'Lei 13.465/17 - Marco Legal da Regularização Fundiária',
      description: 'Regularização fundiária rural e urbana - REURB.',
      status: 'updated',
      category: 'Lei Federal'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-14 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Base Legal — Atualizações do Dataset
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Transparência e atualização contínua são pilares do Dante-IA.
              Nosso dataset é revisado periodicamente com base nas mudanças legislativas e orientações da Corregedoria e do CNJ, mantendo a atuação da IA segura, legalista e tecnicamente precisa.
            </p>
          </div>

          {/* Visão Legalista Card */}
          <div className="mb-12">
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Visão Legalista Pura e Simples da Lei
              </h2>
              <p className="text-neutral-700 mb-4">
                O Dante foi desenvolvido com uma abordagem rigorosamente legalista: interpretar e aplicar exclusivamente o que a lei determina, sem interpretações subjetivas ou opiniões pessoais.
              </p>
              <p className="text-neutral-700 mb-4">
                Nossa IA segue o rigor hierárquico das normas jurídicas, retornando de forma clara e direta o que a legislação vigente estabelece sobre cada procedimento registral. Isso permite que profissionais de cartório tenham acesso a uma fonte confiável e atualizada da base legal atual.
              </p>
              <p className="text-neutral-700">
                <strong>Importante:</strong> Você, como profissional de cartório, mantém total liberdade para aplicar as leis conforme sua interpretação e experiência. O Dante serve como base de apoio para auxiliar sua serventia no suporte e tomadas de decisão fundamentadas.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Histórico de Atualizações
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {legalUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {/* Status indicator */}
                    <div className="flex-shrink-0 mt-1">
                      {update.status === 'updated' ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {update.title}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            update.status === 'updated' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {update.status === 'updated' ? 'Atualizado' : 'Pendente'}
                          </span>
                          <span className="text-sm text-neutral-500">{update.date}</span>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 mb-2">
                        {update.description}
                      </p>
                      
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-700">
                        {update.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-12 text-center">
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Processo de Atualização
              </h3>
              <p className="text-neutral-600 mb-4">
                Nossa equipe jurídica monitora constantemente as mudanças na legislação 
                e atualiza a base de conhecimento do Dante AI para garantir informações 
                sempre precisas e atualizadas.
              </p>
              <div className="flex justify-center space-x-6 text-sm text-neutral-500">
                <span>• Monitoramento diário</span>
                <span>• Validação jurídica</span>
                <span>• Atualização automática</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Assinatura />
    </div>
  );
}