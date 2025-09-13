import React from 'react';
import { User, Scale, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
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
      <div className="w-full max-w-[800px] space-y-6">
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
                    <span className="text-sm">{message.loadingText || 'Processando...'}</span>
                  </div>
                ) : (
                  <>
                    {message.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-neutral-900 prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:text-sm prose-p:leading-relaxed prose-strong:text-neutral-900 prose-strong:font-semibold prose-ul:text-sm prose-ol:text-sm prose-li:text-sm prose-blockquote:text-sm prose-blockquote:border-orange-300 prose-blockquote:bg-orange-50 prose-blockquote:px-3 prose-blockquote:py-2 prose-blockquote:rounded prose-code:text-xs prose-code:bg-neutral-200 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
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
                        {(() => {
                          const date = message.timestamp;
                          const day = date.getDate().toString().padStart(2, '0');
                          const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                                         'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                          const month = months[date.getMonth()];
                          const year = date.getFullYear().toString().slice(-2);
                          const hours = date.getHours().toString().padStart(2, '0');
                          const minutes = date.getMinutes().toString().padStart(2, '0');
                          
                          return `${day}/${month}/${year} - ${hours}:${minutes}`;
                        })()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Elemento invisível para scroll automático */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}