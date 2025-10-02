import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatNeoMsgProps {
  onFirstMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatNeoMsg({ onFirstMessage, isLoading }: ChatNeoMsgProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '56px'; // Reset to standard height
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 220; // 220px max height
      const minHeight = 56; // Standard height
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      
      // Só mostrar scroll quando necessário
      if (newHeight >= maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
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
          <style jsx>{`
            textarea::-webkit-scrollbar {
              width: 6px;
            }
            textarea::-webkit-scrollbar-track {
              background: #f9fafb;
              border-radius: 3px;
            }
            textarea::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
            }
            textarea::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre Registro de Imóveis..."
              className="w-full bg-white border-2 border-neutral-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 resize-none text-base leading-relaxed transition-all duration-200 shadow-inner"
              disabled={isLoading}
              style={{
                height: '56px',
                paddingRight: '176px', // Espaço para botão com margin 10px
                paddingTop: '15px',
                paddingBottom: '15px',
                maxHeight: '220px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f9fafb'
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute bg-orange-500 text-white hover:bg-orange-600 px-6 flex items-center space-x-2 transition-all duration-200"
              style={{
                right: '10px',
                top: '10px',
                bottom: '10px',
                height: '36px',
                maxWidth: '170px'
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span className="text-sm font-medium">Iniciar Chat</span>
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