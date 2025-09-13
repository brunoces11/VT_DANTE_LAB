import React from 'react';
import { MessageCircle, Send, Scale, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatArea() {
  // Mock data para demonstração
  const mockMessages = [
    {
      id: 1,
      content: "Olá! Como posso ajudá-lo com questões de Registro de Imóveis hoje?",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: false
    },
    {
      id: 2,
      content: "Preciso saber sobre os procedimentos para registro de uma escritura de compra e venda.",
      sender: 'user',
      timestamp: new Date(),
      isLoading: false
    },
    {
      id: 3,
      content: "Para o registro de uma escritura de compra e venda, é necessário verificar:\n\n1. **Qualificação registral** - Análise da cadeia dominial\n2. **Documentação** - Certidões negativas atualizadas\n3. **Tributos** - ITBI quitado\n4. **Forma** - Escritura pública lavrada em cartório\n\nTodos os documentos devem estar em conformidade com a Lei 6.015/73 e as normas do CNJ.",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: false
    }
  ];

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
        {mockMessages.map((message) => (
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
            placeholder="Digite sua pergunta sobre Registro de Imóveis..."
            className="flex-1 bg-white border-neutral-200 focus:border-orange-400 focus:ring-orange-400"
          />
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Dante AI pode cometer erros. Verifique informações importantes com a legislação oficial.
        </p>
      </div>
    </div>
  );
}
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