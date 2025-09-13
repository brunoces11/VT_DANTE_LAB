import React from 'react';
import { useState } from 'react';
import { MessageCircle, Send, Scale, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Olá! Como posso ajudá-lo com questões de Registro de Imóveis hoje?",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: 2,
      content: "Preciso saber sobre os procedimentos para registro de uma escritura de compra e venda.",
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: 3,
      content: "Para o registro de uma escritura de compra e venda, é necessário verificar:\n\n1. **Qualificação registral** - Análise da cadeia dominial\n2. **Documentação** - Certidões negativas atualizadas\n3. **Tributos** - ITBI quitado\n4. **Forma** - Escritura pública lavrada em cartório\n\nTodos os documentos devem estar em conformidade com a Lei 6.015/73 e as normas do CNJ.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Adicionar mensagem de loading do bot
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Simular resposta da IA após 2-3 segundos
    setTimeout(() => {
      const responses = [
        "Com base na legislação vigente, especificamente na Lei 6.015/73 (Lei de Registros Públicos), posso orientá-lo sobre esse procedimento.\n\nPara essa situação específica, é necessário verificar:\n\n• **Documentação exigida**\n• **Prazos legais**\n• **Tributos incidentes**\n• **Qualificação registral**\n\nPoderia fornecer mais detalhes sobre o caso específico?",
        
        "Segundo o artigo 167 da Lei 6.015/73 e as normas do CNJ, esse procedimento requer atenção especial aos seguintes aspectos:\n\n**1. Análise da cadeia dominial**\n**2. Verificação de ônus e gravames**\n**3. Conferência da documentação**\n**4. Cálculo de emolumentos**\n\nA qualificação registral deve ser rigorosa para garantir a segurança jurídica do ato.",
        
        "De acordo com a legislação de Registro de Imóveis, essa questão envolve procedimentos específicos que devem ser observados:\n\n• **Base legal**: Lei 6.015/73\n• **Normas complementares**: CNJ\n• **Jurisprudência**: STJ e tribunais estaduais\n\nCada caso possui particularidades que devem ser analisadas individualmente. Precisa de orientação sobre algum aspecto específico?",
        
        "Para essa questão registral, é fundamental observar os princípios do Registro de Imóveis:\n\n**Princípio da Legalidade** - Todos os atos devem estar em conformidade com a lei\n**Princípio da Continuidade** - Manutenção da cadeia dominial\n**Princípio da Especialidade** - Identificação precisa do imóvel\n\nA análise deve ser criteriosa para evitar vícios que possam comprometer o registro."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Remover mensagem de loading e adicionar resposta real
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: randomResponse,
          sender: 'bot',
          timestamp: new Date(),
        }];
      });
      
      setIsLoading(false);
    }, Math.random() * 1000 + 2000); // 2-3 segundos aleatório
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header do Chat */}
      <div className="flex flex-row items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Dante AI - Registro de Imóveis
            </h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-neutral-500">Especialista Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-[85%] ${
                message.sender === 'user'
                  ? 'flex-row-reverse space-x-reverse'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                  message.sender === 'user'
                    ? 'bg-neutral-900'
                    : 'bg-gradient-to-br from-orange-500 to-orange-600'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Scale className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Conteúdo da mensagem */}
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analisando legislação...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs ${
                          message.sender === 'user'
                            ? 'text-neutral-300'
                            : 'text-neutral-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre Registro de Imóveis..."
            disabled={isLoading}
            className="flex-1 bg-white border-neutral-200 focus:border-orange-400 focus:ring-orange-400"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Dante AI pode cometer erros. Verifique informações importantes com a legislação oficial.
        </p>
      </div>
    </div>
  );
}