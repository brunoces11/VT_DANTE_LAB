import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatNeoMsgProps {
  onFirstMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatNeoMsg({ onFirstMessage, isLoading }: ChatNeoMsgProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onFirstMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white px-8">
      <div className="w-full max-w-[800px] text-center">
        {/* Welcome Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Bem-vindo ao Dante-IA
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Seu assistente especializado em <strong>Registro de Imóveis</strong>. 
            Faça sua pergunta sobre procedimentos registrais, legislação vigente ou qualificação de títulos.
          </p>
        </div>

        {/* Suggestions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[600px] mx-auto">
            <div className="bg-neutral-50 rounded-lg p-4 text-left border border-neutral-200 hover:border-orange-300 transition-colors cursor-pointer"
                 onClick={() => setInputValue('Como fazer o registro de uma escritura de compra e venda?')}>
              <h3 className="font-semibold text-neutral-900 mb-2">📋 Procedimentos Registrais</h3>
              <p className="text-sm text-neutral-600">Orientações sobre registro de títulos e documentos</p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 text-left border border-neutral-200 hover:border-orange-300 transition-colors cursor-pointer"
                 onClick={() => setInputValue('Quais são os documentos necessários para registro de imóvel?')}>
              <h3 className="font-semibold text-neutral-900 mb-2">📄 Documentação</h3>
              <p className="text-sm text-neutral-600">Documentos exigidos e qualificação registral</p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 text-left border border-neutral-200 hover:border-orange-300 transition-colors cursor-pointer"
                 onClick={() => setInputValue('Como calcular emolumentos para registro de imóvel?')}>
              <h3 className="font-semibold text-neutral-900 mb-2">💰 Emolumentos</h3>
              <p className="text-sm text-neutral-600">Cálculo de taxas e tributos registrais</p>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 text-left border border-neutral-200 hover:border-orange-300 transition-colors cursor-pointer"
                 onClick={() => setInputValue('Qual a legislação aplicável ao registro de imóveis?')}>
              <h3 className="font-semibold text-neutral-900 mb-2">⚖️ Legislação</h3>
              <p className="text-sm text-neutral-600">Lei 6.015/73 e normas do CNJ</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre Registro de Imóveis..."
              className="w-full bg-white border-neutral-300 focus:border-orange-400 focus:ring-orange-400 h-14 pr-32 text-base"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white hover:bg-orange-600 h-8 px-6 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="text-sm font-medium">Iniciar Conversa</span>
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-neutral-500 mt-3">
            Dante-IA como toda inteligência artificial pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}