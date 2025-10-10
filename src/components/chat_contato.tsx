import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { getCurrentTimestampUTC, formatTimeBR } from '@/utils/timezone';
import { BasicMessage } from '@/types/message';

export default function ChatContato() {
  const [messages, setMessages] = useState<BasicMessage[]>([
    {
      id: 1,
      content: "Olá! 👋 Sou o assistente de IA para esclarecer dúvidas sobre o Dante AI. Estou preparado para esclarecer suas questões instantaneamente e, quando necessário, encaminhar sua mensagem diretamente para o departamento responsável. Como posso ajudá-lo hoje?",
      sender: 'bot',
      timestamp: getCurrentTimestampUTC(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.closest('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Só faz scroll automático após o carregamento inicial
    if (!isInitialLoad) {
      scrollToBottom();
    } else {
      setIsInitialLoad(false);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simular resposta da IA de atendimento
    setTimeout(() => {
      const responses = [
        "Entendi sua dúvida! O Dante AI é uma IA especializada exclusivamente em Registro de Imóveis. Oferecemos três planos: Teste Grátis (15 dias), Profissional (R$ 790/mês) e Nacional (R$ 1.920/mês). Gostaria de saber mais detalhes sobre algum plano específico?",
        
        "Ótima pergunta! Nossa base legal é atualizada constantemente e inclui: Lei 6.015/73, Código Civil, Provimentos do CNJ, Códigos de Normas Estaduais e jurisprudência atualizada. Posso agendar uma demonstração para você ver na prática como funciona?",
        
        "Claro! O Dante AI funciona com uma abordagem rigorosamente legalista, interpretando exclusivamente o que a lei determina. É uma ferramenta de apoio para profissionais de cartório. Você gostaria de testar gratuitamente por 15 dias?",
        
        "Perfeito! Vou encaminhar sua solicitação para nossa equipe comercial. Eles entrarão em contato em até 2 horas úteis no email ou telefone que você fornecer. Enquanto isso, posso responder mais alguma dúvida sobre o Dante AI?",
        
        "Entendo que precisa de informações mais específicas. Vou conectar você diretamente com um especialista. Por favor, me informe seu email e telefone para que possamos fazer o contato personalizado o mais rápido possível."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: Date.now() + 1,
        content: randomResponse,
        sender: 'bot',
        timestamp: getCurrentTimestampUTC(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden mx-auto" style={{ height: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)' }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar messages-container" style={{ height: '320px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[75%] px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-900'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-neutral-300' : 'text-neutral-500'
              }`}>
                {formatTimeBR(message.timestamp)}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-neutral-500 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-neutral-100 text-neutral-900 px-4 py-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 p-4 rounded-b-3xl">
        <div className="relative">
          <Input
            placeholder="Descreva o motivo do seu contato ou faça suas perguntas para obter resposta imediata"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-12 border-2 border-neutral-200 focus:border-orange-400 focus:ring-orange-400 pr-24 rounded-xl"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 h-8 rounded-lg flex items-center gap-1.5 text-xs font-medium"
          >
            <Send className="h-4 w-4" />
            <span>Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}