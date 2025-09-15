import React from 'react';
import Header from '@/components/header';
import { Brain, Database, Search, CheckCircle, Scale, BookOpen, Shield, Zap } from 'lucide-react';

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Como Funciona o Dante AI
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Entenda como nossa IA vertical especializada em Registro de Imóveis 
              processa e interpreta a legislação para fornecer respostas precisas e confiáveis.
            </p>
          </div>

          {/* Destaque Principal - Visão Legalista */}
          <div className="mb-16 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-orange-500 rounded-xl flex-shrink-0">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Visão Legalista Pura e Simples da Lei
                </h2>
                <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                  O Dante foi desenvolvido com uma abordagem rigorosamente legalista: 
                  <strong> interpretar e aplicar exclusivamente o que a lei determina</strong>, 
                  sem interpretações subjetivas ou opiniões pessoais.
                </p>
                <p className="text-neutral-700 mb-4 leading-relaxed">
                  Nossa IA segue o rigor hierárquico das normas jurídicas, retornando de forma 
                  clara e direta o que a legislação vigente estabelece sobre cada procedimento registral. 
                  Isso permite que profissionais de cartório tenham acesso a uma fonte confiável 
                  e atualizada da base legal atual.
                </p>
                <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-neutral-600 italic">
                    <strong>Importante:</strong> Você, como profissional de cartório, mantém total 
                    liberdade para aplicar as leis conforme sua interpretação e experiência. 
                    O Dante serve como base de apoio para auxiliar sua serventia no suporte 
                    e tomadas de decisão fundamentadas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Como Funciona - Processo */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-12">
              Processo de Funcionamento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Etapa 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  1. Base Legal Atualizada
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Mantemos uma base de dados completa com toda a legislação vigente: 
                  leis federais, estaduais, provimentos do CNJ, códigos de normas e jurisprudência.
                </p>
              </div>

              {/* Etapa 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  2. Varredura Meticulosa
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Cada pergunta aciona uma busca detalhada na base legal, identificando 
                  todos os artigos, normas e regras aplicáveis ao caso específico.
                </p>
              </div>

              {/* Etapa 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  3. Interpretação Rigorosa
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  Nossa IA interpreta os dados seguindo rigorosamente a hierarquia legal, 
                  fornecendo respostas fundamentadas e confiáveis.
                </p>
              </div>
            </div>
          </div>

          {/* Arquitetura da IA */}
          <div className="mb-16 bg-neutral-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
              Arquitetura da IA Especializada
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-orange-600" />
                  Memória Legal Interna
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Lei 6.015/73 - Lei de Registros Públicos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Código Civil - Arts. 1.245 a 1.247</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Provimentos e Resoluções do CNJ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Códigos de Normas Estaduais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Jurisprudência dos Tribunais Superiores</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-orange-600" />
                  Processamento Inteligente
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Análise contextual da pergunta</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Identificação de normas aplicáveis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Hierarquização das fontes legais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Síntese clara e objetiva</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700">Fundamentação legal completa</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Diferenciais */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-neutral-900 text-center mb-12">
              Por que o Dante é Diferente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Especialização Vertical</h4>
                <p className="text-sm text-neutral-600">
                  100% focado em Registro de Imóveis, sem distrações ou conhecimento genérico.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Rigor Legal</h4>
                <p className="text-sm text-neutral-600">
                  Segue estritamente a hierarquia das normas jurídicas sem interpretações subjetivas.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Atualização Constante</h4>
                <p className="text-sm text-neutral-600">
                  Base legal sempre atualizada com as últimas mudanças na legislação.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Respostas Confiáveis</h4>
                <p className="text-sm text-neutral-600">
                  Cada resposta é fundamentada em fontes legais específicas e verificáveis.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center bg-neutral-900 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Pronto para Experimentar?
            </h2>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Teste o Dante AI e veja como nossa IA especializada pode auxiliar 
              sua serventia com informações precisas e atualizadas sobre Registro de Imóveis.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Iniciar Chat Gratuito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}