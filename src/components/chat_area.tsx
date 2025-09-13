import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatArea() {
  return (
    <div className="flex-1 h-screen bg-blue-50 flex flex-col">
      {/* Área de mensagens */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Estado inicial - sem mensagens */}
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 bg-blue-100 rounded-2xl mb-6">
              <MessageCircle className="h-12 w-12 text-blue-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              Bem-vindo ao Dante AI
            </h3>
            
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl">
              Sua IA especializada em Registro de Imóveis. Faça perguntas sobre 
              procedimentos registrais, qualificação de títulos e legislação.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  📋 Qualificação Registral
                </h4>
                <p className="text-sm text-neutral-600">
                  Como qualificar documentos para registro
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  🏠 Registro de Imóveis
                </h4>
                <p className="text-sm text-neutral-600">
                  Procedimentos para registro de imóveis
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-colors">
                <h4 className="font-medium text-neutral-900 mb-2">
                  ⚖️ Legislação Vigente
                </h4>
                <p className="text-sm text-neutral-600">
                  Consultas sobre leis e normas
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-colors">
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

      {/* Área de input fixo na parte inferior */}
      <div className="border-t border-blue-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="Digite sua pergunta sobre Registro de Imóveis..."
              className="flex-1 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
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