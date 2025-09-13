import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatArea() {
  return (
    <div className="flex-1 bg-white relative custom-scrollbar" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Área de mensagens */}
      <div className="h-full p-6 overflow-y-auto pb-24 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Mensagens do chat */}
          <div className="space-y-4 mb-6">
            {/* Mensagem de boas-vindas */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 max-w-md text-center">
                <div className="p-3 bg-gray-100 rounded-xl mb-3 inline-block">
                  <MessageCircle className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Bem-vindo ao Dante AI
                </h3>
                <p className="text-sm text-neutral-600">
                  Sua IA especializada em Registro de Imóveis
                </p>
              </div>
            </div>
            
            {/* Exemplo de mensagens para testar scroll */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  i % 2 === 0 
                    ? 'bg-gray-50 border border-gray-200 text-neutral-900' 
                    : 'bg-orange-500 text-white'
                }`}>
                  <p className="text-sm">
                    {i % 2 === 0 
                      ? `Esta é uma resposta do Dante AI sobre registro de imóveis. Mensagem ${i + 1}.`
                      : `Esta é uma pergunta do usuário sobre procedimentos registrais. Pergunta ${i + 1}.`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Cards de sugestões */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-100 rounded-2xl mb-6">
              <MessageCircle className="h-12 w-12 text-gray-600" />
            </div>
            
            <p className="text-lg text-neutral-600 mb-6 max-w-2xl">
              Faça perguntas sobre procedimentos registrais, qualificação de títulos e legislação.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  📋 Qualificação Registral
                </h4>
                <p className="text-sm text-neutral-600">
                  Como qualificar documentos para registro
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  🏠 Registro de Imóveis
                </h4>
                <p className="text-sm text-neutral-600">
                  Procedimentos para registro de imóveis
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  ⚖️ Legislação Vigente
                </h4>
                <p className="text-sm text-neutral-600">
                  Consultas sobre leis e normas
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  📄 Análise de Documentos
                </h4>
                <p className="text-sm text-neutral-600">
                  Verificação de conformidade documental
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de input fixo na parte inferior com z-index alto */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="Digite sua pergunta sobre Registro de Imóveis..."
              className="flex-1 bg-white border-gray-200 focus:border-gray-400 focus:ring-gray-400"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-2 text-center">
            Dante AI pode cometer erros. Verifique informações importantes com a legislação oficial.
          </p>
        </div>
      </div>
    </div>
  );
}