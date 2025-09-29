import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCurrentTimestampUTC } from '@/utils/timezone';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isLoading?: boolean;
  loadingText?: string;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para carregar mensagens de uma sessão específica
  const fun_load_chat_session = (sessionId: string) => {
    try {
      console.log(`🔄 Carregando mensagens da sessão: ${sessionId}`);
      
      // Buscar dados do localStorage
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (!userChatData) {
        console.log('📭 Nenhum dado encontrado no localStorage');
        setMessages([]);
        return;
      }
      
      const parsedData = JSON.parse(userChatData);
      
      // Encontrar a sessão específica
      const session = parsedData.chat_sessions?.find((s: any) => s.chat_session_id === sessionId);
      
      if (!session || !session.messages) {
        console.log('📭 Sessão não encontrada ou sem mensagens');
        setMessages([]);
        setCurrentSessionId(sessionId);
        return;
      }
      
      // Converter mensagens do localStorage para formato Message
      const convertedMessages: Message[] = [];
      let messageId = 1;
      
      session.messages.forEach((msg: any) => {
        // Adicionar pergunta do usuário (msg_input)
        if (msg.msg_input) {
          convertedMessages.push({
            id: messageId++,
            content: msg.msg_input,
            sender: 'user',
            timestamp: getCurrentTimestampUTC(),
          });
        }
        
        // Adicionar resposta do LLM (msg_output)
        if (msg.msg_output) {
          convertedMessages.push({
            id: messageId++,
            content: msg.msg_output,
            sender: 'bot',
            timestamp: getCurrentTimestampUTC(),
          });
        }
      });
      
      console.log(`✅ ${convertedMessages.length} mensagens carregadas da sessão`);
      setMessages(convertedMessages);
      setCurrentSessionId(sessionId);
      
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens da sessão:', error);
      setMessages([]);
    }
  };

  // Função para carregar dados do sidebar a partir do localStorage
  const fun_load_sidebar = () => {
    try {
      console.log('🔄 Carregando dados do sidebar...');
      
      // Buscar dados do localStorage
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (!userChatData) {
        console.log('📭 Nenhum dado encontrado no localStorage, sidebar vazio');
        setChats([]);
        return;
      }
      
      const parsedData = JSON.parse(userChatData);
      
      // Validar estrutura dos dados
      if (!parsedData.chat_sessions || !Array.isArray(parsedData.chat_sessions)) {
        console.log('📭 Estrutura inválida ou sem sessões, sidebar vazio');
        setChats([]);
        return;
      }
      
      // Converter sessões para formato do Chat
      const loadedChats: Chat[] = parsedData.chat_sessions.map((session: any, index: number) => ({
        id: session.chat_session_id,
        title: session.chat_session_title,
        lastMessage: '',
        timestamp: '19/Jan/25 - 14:30', // Mantém hardcoded como solicitado
        isEmpty: false,
        isActive: index === 0 // Primeira sessão ativa por padrão
      }));
      
      console.log(`✅ ${loadedChats.length} sessões carregadas no sidebar`);
      setChats(loadedChats);
      
      // Carregar primeira sessão automaticamente se existir
      if (loadedChats.length > 0) {
        fun_load_chat_session(loadedChats[0].id);
      } else {
        // Se não há sessões, mostrar mensagem de boas-vindas
        setMessages([{
          id: 1,
          content: "# Olá! 👋\n\nComo posso ajudá-lo com questões de **Registro de Imóveis** hoje?\n\nEstou aqui para esclarecer dúvidas sobre:\n- Procedimentos registrais\n- Qualificação de títulos\n- Legislação vigente\n- Normas do CNJ",
          sender: 'bot',
          timestamp: getCurrentTimestampUTC(),
        }]);
        setCurrentSessionId(null);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
      // Mostrar mensagem de boas-vindas em caso de erro
      setMessages([{
        id: 1,
        content: "# Olá! 👋\n\nComo posso ajudá-lo com questões de **Registro de Imóveis** hoje?\n\nEstou aqui para esclarecer dúvidas sobre:\n- Procedimentos registrais\n- Qualificação de títulos\n- Legislação vigente\n- Normas do CNJ",
        sender: 'bot',
        timestamp: getCurrentTimestampUTC(),
      }]);
      setCurrentSessionId(null);
    }
  };

  // Redireciona para home se usuário não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Carregar dados do sidebar quando componente monta
  useEffect(() => {
    if (user && !loading) {
      fun_load_sidebar();
    }
  }, [user, loading]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada se usuário não estiver logado (será redirecionado)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      {/* Header fixo no topo */}
      <ChatHeader />
      
      {/* Layout principal com flexbox */}
      <div className="flex h-full" style={{ paddingTop: '60px' }}>
        {/* Sidebar fixa à esquerda */}
        <SidebarCollapse 
          chats={chats} 
          setChats={setChats} 
          onChatClick={fun_load_chat_session}
          currentSessionId={currentSessionId}
        />
        
        {/* Área de chat à direita */}
        <ChatArea 
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
}