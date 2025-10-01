import React from 'react';
import { useRef, useEffect } from 'react';
import ChatMsgHeader from '@/components/chat_msg_header';
import ChatMsgList from '@/components/chat_msg_list';
import ChatMsgInput from '@/components/chat_msg_input';
import ChatNeoMsg from '@/components/chat_neo_msg';
import { getCurrentTimestampUTC } from '@/utils/timezone';
import { fun_save_chat_data } from '../../services/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

// 🚀 FUNÇÃO PARA SALVAMENTO EM BACKGROUND (NON-BLOCKING)
const saveInBackground = (data: any) => {
  Promise.resolve().then(async () => {
    try {
      if (data.backup) {
        console.log('🧹 Cache limpo');
        const { clearSessionCache } = await import('../../services/supabase');
        clearSessionCache();
      }
      
      console.log(`💾 Salvando msg: ${data.msg_input.slice(0, 20)}...`);
      const result = await fun_save_chat_data(data);
      
      if (result.success) {
        console.log('✅ Msg salva');
      } else {
        console.warn('⚠️ Falha msg:', result.error);
        
        if (!data.retry) {
          console.log('🔄 Retry...');
          const { clearSessionCache } = await import('../../services/supabase');
          clearSessionCache();
          setTimeout(() => saveInBackground({...data, retry: true}), 1000);
        }
      }
    } catch (error) {
      console.error('❌ Erro msg:', error.message);
      
      if (!data.lastTry) {
        console.log('🆘 Última tentativa...');
        setTimeout(() => saveInBackground({...data, lastTry: true}), 3000);
      }
    }
  });
};

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isWelcomeMode: boolean;
  onFirstMessage: (message: string) => void;
  currentSessionId: string | null;
}

// 🚀 FUNÇÃO PARA PERSISTIR NO LOCALSTORAGE
const persistChatData = (sessionId: string, messages: Message[]) => {
  try {
    const STORAGE_KEY = 'dante_chat_data';
    const existingData = localStorage.getItem(STORAGE_KEY);
    
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      parsedData.messages = messages;
      parsedData.currentSessionId = sessionId;
      parsedData.timestamp = Date.now();
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      console.log('💾 Mensagens persistidas no localStorage (ChatArea)');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao persistir no localStorage (ChatArea):', error);
  }
};

export default function ChatArea({ messages, setMessages, isLoading, setIsLoading, isWelcomeMode, onFirstMessage, currentSessionId }: ChatAreaProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading || !currentSessionId || !user?.id) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      
      // Persistência automática via ChatPage
      
      return newMessages;
    });
    setIsLoading(true);
    
    // Scroll imediato após enviar mensagem do usuário
    setTimeout(scrollToBottom, 100);

    // Iniciar loading simples
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot',
      timestamp: getCurrentTimestampUTC(),
      isLoading: true,
      loadingText: 'O Dante está processando sua resposta...',
    };

    setMessages(prev => [...prev, loadingMessage]);
    setTimeout(scrollToBottom, 200);

    // Processar com Langflow real (sem simulação)
    try {
      console.log('🚀 Enviando mensagem para Langflow (chat existente)...');

      // Obter variáveis de ambiente
      const langflowUrl = import.meta.env.VITE_LANGFLOW_URL;
      const langflowFlowId = import.meta.env.VITE_LANGFLOW_FLOW_ID;

      if (!langflowUrl || !langflowFlowId) {
        throw new Error('Variáveis de ambiente do Langflow não configuradas');
      }

      // Criar payload para Langflow
      const payload = {
        "input_value": inputValue,
        "output_type": "chat",
        "input_type": "chat",
        "session_id": currentSessionId
      };

      // Construir URL completa
      const fullUrl = langflowUrl.endsWith('/') 
        ? `${langflowUrl}api/v1/run/${langflowFlowId}` 
        : `${langflowUrl}/api/v1/run/${langflowFlowId}`;

      console.log('📡 Fazendo requisição para Langflow:', fullUrl);

      // Fazer requisição para Langflow
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição Langflow: ${response.status} - ${response.statusText}`);
      }

      // Obter resposta do Langflow
      const responseData = await response.json();
      console.log('📥 Resposta bruta do Langflow:', responseData);

      // Tratar resposta do Langflow
      let treatedResponse = '';
      
      if (responseData.outputs && responseData.outputs[0] && responseData.outputs[0].outputs && responseData.outputs[0].outputs[0]) {
        const output = responseData.outputs[0].outputs[0];
        
        if (output.outputs && output.outputs.message && output.outputs.message.message) {
          treatedResponse = output.outputs.message.message;
        } else if (output.artifacts && output.artifacts.message) {
          treatedResponse = output.artifacts.message;
        } else if (output.results && output.results.message && output.results.message.text) {
          treatedResponse = output.results.message.text;
        } else if (output.messages && output.messages[0] && output.messages[0].message) {
          treatedResponse = output.messages[0].message;
        } else {
          treatedResponse = 'Resposta do Langflow recebida, mas estrutura não reconhecida.';
        }
      } else if (responseData.result) {
        treatedResponse = responseData.result;
      } else if (responseData.message) {
        treatedResponse = responseData.message;
      } else {
        treatedResponse = 'Resposta do Langflow recebida, mas formato não reconhecido.';
      }

      console.log('✅ Resposta tratada do Langflow:', treatedResponse);

      // Remover loading e adicionar resposta real do Langflow
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const newMessages = [...withoutLoading, {
          id: Date.now() + 2,
          content: treatedResponse,
          sender: 'bot',
          timestamp: getCurrentTimestampUTC(),
        }];
        
        // Persistência automática via ChatPage
        
        return newMessages;
      });

      // 🚀 SALVAMENTO NON-BLOCKING (BACKGROUND)
      const saveData = {
        chat_session_id: currentSessionId,
        chat_session_title: 'Conversa existente',
        msg_input: inputValue,
        msg_output: treatedResponse,
        user_id: user.id
      };
      
      saveInBackground(saveData);
      
      // Backup após 2s
      setTimeout(() => saveInBackground({...saveData, backup: true}), 2000);

    } catch (error) {
      console.error('❌ Erro no Langflow:', error);
      
      // Fallback: usar resposta de erro amigável
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: '## ⚠️ Erro Temporário\n\nDesculpe, ocorreu um erro ao processar sua mensagem. Nosso sistema está temporariamente indisponível.\n\n**Tente novamente em alguns instantes.**\n\nSe o problema persistir, entre em contato com o suporte.',
          sender: 'bot',
          timestamp: getCurrentTimestampUTC(),
        }];
      });
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 300);
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