import { useRef, useEffect } from 'react';
import ChatMsgList from '@/components/chat_msg_list';
import ChatInputMsg from '@/components/chat_input_msg';
import ChatNeoMsg from '@/components/chat_neo_msg';
import { getCurrentTimestampUTC } from '@/utils/timezone';
import { saveInBackground } from '../../services/supabase';
import { fun_call_langflow } from '../../services/langflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { Message } from '@/types/message';
import type { AgentType } from '@/config/agentConfigs';

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isWelcomeMode: boolean;
  onFirstMessage: (message: string) => void;
  currentSessionId: string | null;
  currentAgentType: AgentType; // ✅ NOVO: Tipo de agente ativo
}

// A persistência é gerenciada pelo sistema de cache seguro no ChatPage

export default function ChatArea({ messages, setMessages, isLoading, setIsLoading, isWelcomeMode, onFirstMessage, currentSessionId, currentAgentType }: ChatAreaProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const previousSessionIdRef = useRef<string | null>(null);

  // Debug log
  console.log('🎨 ChatArea render:', { isWelcomeMode, currentSessionId, messagesCount: messages.length });
  
  // 🎯 VERIFICAÇÃO DE SEGURANÇA: Nunca exibir tela em branco
  // Se não está em welcome mode mas não há sessão ativa nem mensagens, deve mostrar welcome
  const shouldShowWelcome = !isWelcomeMode && !currentSessionId && messages.length === 0;
  
  if (shouldShowWelcome) {
    console.log('⚠️ Detectada condição de tela em branco, exibindo Welcome Mode');
  }

  // Função para atualizar status de mensagem
  const updateMessageStatus = (messageId: number, status: 'sending' | 'sent' | 'failed') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  // 🎯 Scroll inteligente: rola até a última mensagem do usuário ao trocar de chat
  const scrollToLastUserMessage = () => {
    if (lastUserMessageRef.current) {
      // Scroll com offset de 30px antes da mensagem
      lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      console.log('📜 Scroll até última mensagem do usuário (com margin-top de 30px)');
    }
  };

  // Scroll automático para o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 🎯 DETECTAR MUDANÇA DE SESSÃO e fazer scroll inteligente
  useEffect(() => {
    if (currentSessionId && currentSessionId !== previousSessionIdRef.current && messages.length > 0) {
      // Mudou de sessão - rolar até última mensagem do usuário
      console.log('🔄 Sessão mudou, rolando até última mensagem do usuário');
      setTimeout(() => scrollToLastUserMessage(), 100);
      previousSessionIdRef.current = currentSessionId;
    } else if (messages.length > 0 && currentSessionId === previousSessionIdRef.current) {
      // Mesma sessão - scroll normal até o final (nova mensagem enviada)
      scrollToBottom();
    }
  }, [messages, currentSessionId]);

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading || !currentSessionId || !user?.id) return;

    // Adicionar mensagem do usuário com status inicial
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
      status: 'sending', // Status inicial
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      
      // Persistência automática via ChatPage
      
      return newMessages;
    });
    setIsLoading(true);
    
    // Scroll imediato após enviar mensagem do usuário
    scrollToBottom();

    // Iniciar loading simples
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot' as const,
      timestamp: getCurrentTimestampUTC(),
      isLoading: true,
      loadingText: 'O Dante está processando sua resposta...',
    };

    setMessages(prev => [...prev, loadingMessage]);
    // Usar requestAnimationFrame para scroll suave - padrão React
    requestAnimationFrame(scrollToBottom);

    // Processar com Langflow usando função centralizada
    try {
      console.log('🚀 Enviando mensagem para Langflow (chat existente)...');

      // Chamar função centralizada do Langflow
      const langflowResult = await fun_call_langflow({
        input_value: inputValue,
        session_id: currentSessionId,
        agent_type: currentAgentType // ✅ NOVO: Incluir agent_type
      });

      if (!langflowResult.success || !langflowResult.response) {
        throw new Error(langflowResult.error || 'Erro ao processar resposta do Langflow');
      }

      const treatedResponse = langflowResult.response;
      console.log('✅ Resposta tratada do Langflow');

      // Remover loading e adicionar resposta real do Langflow
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const newMessages = [...withoutLoading, {
          id: Date.now() + 2,
          content: treatedResponse,
          sender: 'bot' as const,
          timestamp: getCurrentTimestampUTC(),
        }];
        
        // Persistência automática via ChatPage
        
        return newMessages;
      });

      // Salvamento com retry robusto e status visual
      const saveData = {
        chat_session_id: currentSessionId,
        chat_session_title: 'Conversa existente',
        msg_input: inputValue,
        msg_output: treatedResponse,
        user_id: user.id,
        agent_type: currentAgentType // ✅ NOVO: Incluir agent_type
      };
      
      // Salvar com callback de status
      saveInBackground(saveData, updateMessageStatus, userMessage.id);

    } catch (error) {
      console.error('❌ Erro no Langflow:', error);
      
      // Fallback: usar resposta de erro amigável
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: '## ⚠️ Erro Temporário\n\nDesculpe, ocorreu um erro ao processar sua mensagem. Nosso sistema está temporariamente indisponível.\n\n**Tente novamente em alguns instantes.**\n\nSe o problema persistir, entre em contato com o suporte.',
          sender: 'bot' as const,
          timestamp: getCurrentTimestampUTC(),
        }];
      });
    } finally {
      setIsLoading(false);
      // Usar requestAnimationFrame para melhor performance
      requestAnimationFrame(scrollToBottom);
    }
  };


  return (
    <div className="flex-1 flex flex-col bg-background" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Header do Chat */}
      {/* <ChatMsgHeader /> */}
      
      {/* Renderização Condicional: Welcome Mode ou Chat Mode */}
      {isWelcomeMode || shouldShowWelcome ? (
        <ChatNeoMsg 
          onFirstMessage={onFirstMessage}
          isLoading={isLoading}
          agentType={currentAgentType}
        />
      ) : (
        <>
          {/* Messages */}
          <ChatMsgList 
            messages={messages} 
            messagesEndRef={messagesEndRef}
            lastUserMessageRef={lastUserMessageRef}
          />

          {/* Input */}
          <ChatInputMsg onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}