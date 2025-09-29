import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

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

  return (
    <div className="p-4 border-t border-neutral-200 bg-white flex justify-center">
      <div className="w-full max-w-[950px]">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre Registro de Imóveis..."
            className="w-full bg-white border-neutral-200 focus:border-orange-400 focus:ring-orange-400 h-12 pr-16"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white hover:bg-orange-600 h-8 px-4 flex items-center space-x-1"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span className="text-xs font-medium">Enviar</span>
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Dante-IA como toda inteligência artificial pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
}