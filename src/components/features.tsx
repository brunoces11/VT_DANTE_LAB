import React from 'react';
import { Brain, FileText, Shield, Clock, CheckCircle, BookOpen } from 'lucide-react';

export default function Features() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl mb-4">
            Tudo que você precisa para o Registro de Imóveis
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Nossa IA combina conhecimento jurídico especializado com tecnologia 
            avançada para entregar respostas precisas e fundamentadas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  IA Especializada
                </h3>
                <p className="text-neutral-600 mb-4">
                  Dante é treinado exclusivamente em legislação e procedimentos de 
                  Registro de Imóveis.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Base de conhecimento atualizada
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Respostas precisas e objetivas
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Foco exclusivo em RI
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Qualificação Registral
                </h3>
                <p className="text-neutral-600 mb-4">
                  Auxilia na análise documental e qualificação de títulos para 
                  registro, seguindo rigorosamente a legislação.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Análise de documentos
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Verificação de conformidade
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Orientação para procedimentos
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Base Legal Completa
                </h3>
                <p className="text-neutral-600 mb-4">
                  Atualizada rigorosamente das leis, jurisprudências legislação 
                  federal e estadual e normas do CNJ.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Legislação federal e estadual
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Normas do CNJ
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Jurisprudência atualizada
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  Segurança Jurídica
                </h3>
                <p className="text-neutral-600 mb-4">
                  Garante confiabilidade e segurança nos procedimentos registrais, 
                  evitando erros e flexões.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Procedimentos validados
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prevenção de erros
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Conformidade legal
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Respostas Instantâneas</h4>
            <p className="text-sm text-neutral-600">
              Obtenha informações precisas em segundos, sem necessidade de extensas 
              pesquisas em manuais.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Suporte Especializado</h4>
            <p className="text-sm text-neutral-600">
              Evolui e se mantém atualizada no Registro de Imóveis sem uma complexa 
              compilação.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl border border-neutral-200">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Atualização Constante</h4>
            <p className="text-sm text-neutral-600">
              Base de conhecimento sempre atualizada com as últimas mudanças na 
              legislação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}