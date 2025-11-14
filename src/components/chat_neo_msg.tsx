import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
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
        <div className="mb-8">
          <div className="text-6xl mb-4">{agentConfig.icon}</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {agentConfig.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {agentConfig.description}
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-muted rounded-full">
            <p className="text-sm text-muted-foreground">
              🤖 Agente ativo: <strong className="text-foreground">{agentConfig.title}</strong>
            </p>
          </div>
        </div>

        {/* Suggestions - Renderizadas dinamicamente */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[600px] mx-auto">
            {agentConfig.suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`bg-muted rounded-lg p-4 text-left border border-border hover:border-${agentConfig.color}-300 transition-colors cursor-pointer`}
                onClick={() => setInputValue(suggestion.prompt)}
              >
                <h3 className="font-semibold text-foreground mb-2">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
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
              className={`absolute bg-${agentConfig.color}-500 text-white hover:bg-${agentConfig.color}-600 px-6 flex items-center space-x-2 transition-all duration-200`}
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