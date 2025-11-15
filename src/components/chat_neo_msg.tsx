import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Home, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAgentConfig, type AgentType } from '@/config/agentConfigs';

interface ChatNeoMsgProps {
  onFirstMessage: (message: string) => void;
  isLoading: boolean;
  agentType: AgentType; // ✅ NOVO: Tipo de agente
}

export default function ChatNeoMsg({ onFirstMessage, isLoading, agentType }: ChatNeoMsgProps) {
  // ✅ NOVO: Carregar configuração do agente
  const agentConfig = getAgentConfig(agentType);
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
    <div className="flex-1 flex flex-col items-center justify-center bg-background px-8">
      <div className="w-full max-w-[800px] text-center">
        {/* Welcome Title */}
        <div className="mb-12">
          <div className="mb-6 flex justify-center">
            {agentType === 'dante-ri' ? (
              <Home className="h-20 w-20 text-orange-500" />
            ) : (
              <ScrollText className="h-20 w-20 text-blue-500" />
            )}
          </div>
          <h1 className="font-bold text-foreground mb-6 text-[1.8rem] md:text-[2.2rem]">
            {agentConfig.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-[700px] mx-auto">
            {agentConfig.description}
          </p>
          <div className="mt-6 inline-block px-6 py-3 bg-muted rounded-full">
            <p className="text-base text-muted-foreground">
              🤖 Agente ativo: <strong className="text-foreground">{agentConfig.title}</strong>
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full">
          <style>{`
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
              placeholder={agentConfig.placeholder}
              className="w-full bg-background border-2 border-input focus:border-orange-400 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 resize-none text-base text-foreground leading-relaxed transition-all duration-200 shadow-inner placeholder:text-muted-foreground"
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
              className={`absolute text-white px-6 flex items-center space-x-2 transition-all duration-200 ${
                agentType === 'dante-ri' 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
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