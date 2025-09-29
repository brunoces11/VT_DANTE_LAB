import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);

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
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
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
        <SidebarCollapse chats={chats} setChats={setChats} />
        
        {/* Área de chat à direita */}
        <ChatArea />
      </div>
    </div>
  );
}