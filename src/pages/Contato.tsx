import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Contato() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Olá! 👋 Sou o assistente de atendimento do Dante AI. Como posso ajudá-lo hoje? Posso esclarecer dúvidas sobre nossos serviços, funcionalidades, planos ou qualquer outra questão sobre o Dante AI.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
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
        timestamp: new Date(),
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
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-14 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-6">
              Contato | Formulário Inteligente
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Converse com nossa IA de atendimento e obtenha respostas instantâneas para suas dúvidas sobre funcionalidades, planos, implementação ou qualquer aspecto do Dante AI. Nossa inteligência artificial está preparada para esclarecer suas questões e, quando necessário, encaminhar sua mensagem diretamente para o departamento responsável.
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
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
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
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
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua pergunta sobre o Dante AI..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-neutral-200 focus:border-orange-400 focus:ring-orange-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                💡 Dica: Seja específico sobre sua dúvida para receber a melhor orientação
              </p>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Email</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Para questões comerciais e suporte técnico
              </p>
              <a href="mailto:contato@dante-ai.com" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                contato@dante-ai.com
              </a>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Telefone</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Atendimento comercial
              </p>
              <a href="tel:+5511999999999" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                (11) 99999-9999
              </a>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Localização</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Sede administrativa
              </p>
              <p className="text-orange-600 font-medium text-sm">
                São Paulo, SP
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-neutral-900 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você a implementar o Dante AI 
              no seu cartório. Agende uma demonstração personalizada!
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              <MessageCircle className="mr-2 h-4 w-4" />
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}