import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

interface ChatInputMsgProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInputMsg({ onSendMessage, isLoading }: ChatInputMsgProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset to minimum height first
      textarea.style.height = '56px';
      
      // Force reflow to get accurate scrollHeight
      textarea.offsetHeight;
      
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 220; // 220px max height
      const minHeight = 56; // Standard height
      
      // Only grow if content actually needs more space
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
    
    onSendMessage(inputValue);
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
    <div className="p-4 border-t border-border bg-background flex justify-center">
      <div className="w-full max-w-[950px]">
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
            className="w-full bg-background dark:bg-neutral-900 text-foreground border-2 border-input focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 pr-20 resize-none text-sm leading-relaxed transition-all duration-200 shadow-inner placeholder:text-muted-foreground"
            style={{
              height: '56px',
              paddingTop: '15px',
              paddingBottom: '15px',
              paddingRight: '92px', // Espaço para botão com margin 10px
              maxHeight: '220px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f9fafb'
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="absolute bg-orange-500 text-white hover:bg-orange-600 px-4 flex items-center space-x-1 transition-all duration-200"
            style={{
              right: '10px',
              top: '10px',
              bottom: '10px',
              height: '36px'
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="text-xs font-medium">Enviar</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dante-IA como toda inteligência artificial pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
}