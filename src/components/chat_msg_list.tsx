import React from 'react';
import { User, Home, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatLoader from './chat_loader';
import { formatDateTimeBR } from '@/utils/timezone';

// Função para pré-processar texto e converter listas numeradas em markdown
const preprocessMarkdown = (text: string): string => {
  let processed = text;
  
  // 1. Detectar e converter listas numeradas
  // Padrão: "1. Texto" ou "1.Texto" (com ou sem espaço)
  processed = processed.replace(/(\d+)\.(\s*)([^\n]+)/g, (match, number, space, content) => {
    return `${number}. ${content.trim()}`;
  });
  
  // 2. Garantir quebras de linha adequadas antes de listas
  // Se há texto antes de uma lista numerada, adicionar quebra dupla
  processed = processed.replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2');
  
  // 3. Garantir quebras de linha após listas
  // Se há texto após uma lista numerada, adicionar quebra
  processed = processed.replace(/(\d+\.\s[^\n]+)\n([^\d\n])/g, '$1\n\n$2');
  
  // 4. Limpar múltiplas quebras de linha excessivas
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  return processed;
};

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

interface ChatMsgListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMsgList({ messages, messagesEndRef }: ChatMsgListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex justify-center">
      <div className="w-full max-w-[950px] space-y-6">
        {messages.filter(message => !message.isLoading).map((message) => (
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
                    : ''
                }`}
                style={message.sender === 'bot' ? { backgroundColor: '#B14627' } : {}}
              >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Home className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Conteúdo da mensagem */}
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-900 mb-[30px]'
                }`}
              >
                {message.sender === 'bot' ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-neutral-900 prose-headings:font-semibold prose-h1:text-xl prose-h1:mb-3 prose-h2:text-lg prose-h2:mb-2 prose-h3:text-base prose-h3:mb-2 prose-h4:text-sm prose-h4:mb-1 prose-p:text-sm prose-p:leading-relaxed prose-p:mb-3 prose-strong:text-neutral-900 prose-strong:font-semibold prose-ul:text-sm prose-ul:mb-3 prose-ol:text-sm prose-ol:mb-3 prose-li:text-sm prose-li:mb-1 prose-blockquote:text-sm prose-blockquote:border-orange-300 prose-blockquote:bg-orange-50 prose-blockquote:px-3 prose-blockquote:py-2 prose-blockquote:rounded prose-blockquote:mb-3 prose-code:text-xs prose-code:bg-neutral-200 prose-code:px-1 prose-code:rounded">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Forçar quebras de linha
                        p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                        // Melhorar headings
                        h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-neutral-900">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-bold mb-2 text-neutral-900">{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-bold mb-2 text-neutral-900">{children}</h3>,
                        h4: ({children}) => <h4 className="text-sm font-bold mb-1 text-neutral-900">{children}</h4>,
                        // Melhorar listas
                        ul: ({children}) => <ul className="mb-3 pl-4 list-disc">{children}</ul>,
                        ol: ({children}) => <ol className="mb-3 pl-4 list-decimal">{children}</ol>,
                        li: ({children}) => <li className="mb-1 ml-2">{children}</li>,
                        // Melhorar strong/bold
                        strong: ({children}) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                        // Preservar quebras de linha
                        br: () => <br className="block" />
                      }}
                    >
                      {(() => {
                        const processed = preprocessMarkdown(message.content);
                        // Log temporário para debug
                        if (message.content.includes('1.') || message.content.includes('2.')) {
                          console.log('🔍 Texto original:', message.content.substring(0, 200));
                          console.log('🔍 Texto processado:', processed.substring(0, 200));
                        }
                        return processed;
                      })()}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${
                      message.sender === 'user'
                        ? 'text-neutral-300'
                        : 'text-neutral-500'
                    }`}
                  >
                    {formatDateTimeBR(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Renderizar loader separadamente se houver mensagem de loading */}
        {messages.some(msg => msg.isLoading) && (
          <ChatLoader 
            loadingText={messages.find(msg => msg.isLoading)?.loadingText || 'Processando...'} 
          />
        )}
        
        {/* Elemento invisível para scroll automático */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}