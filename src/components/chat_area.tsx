import React from 'react';
import { useRef, useEffect } from 'react';
import ChatMsgHeader from '@/components/chat_msg_header';
import ChatMsgList from '@/components/chat_msg_list';
import ChatMsgInput from '@/components/chat_msg_input';
import ChatNeoMsg from '@/components/chat_neo_msg';
import { getCurrentTimestampUTC } from '@/utils/timezone';
import { saveInBackground, fun_call_langflow } from '../../services/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Message } from '@/types/message';

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isWelcomeMode: boolean;
  onFirstMessage: (message: string) => void;
  currentSessionId: string | null;
}

// A persistência é gerenciada pelo sistema de cache seguro no ChatPage

export default function ChatArea({ messages, setMessages, isLoading, setIsLoading, isWelcomeMode, onFirstMessage, currentSessionId }: ChatAreaProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug log
  console.log('🎨 ChatArea render:', { isWelcomeMode, currentSessionId, messagesCount: messages.length });

  // Função para atualizar status de mensagem
  const updateMessageStatus = (messageId: number, status: 'sending' | 'sent' | 'failed') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  // Scroll automático para o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        user_id: user.id
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
    <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Header do Chat */}
      <ChatMsgHeader />
      
      {/* Renderização Condicional: Welcome Mode ou Chat Mode */}
      {isWelcomeMode ? (
        <ChatNeoMsg 
          onFirstMessage={onFirstMessage}
          isLoading={isLoading}
        />
      ) : (
        <>
          {/* Messages */}
          <ChatMsgList messages={messages} messagesEndRef={messagesEndRef} />

          {/* Input */}
          <ChatMsgInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}