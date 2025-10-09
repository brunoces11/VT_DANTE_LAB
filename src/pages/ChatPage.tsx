import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCurrentTimestampUTC, formatDateTimeBR } from '@/utils/timezone';
import { fun_load_user_data, saveInBackground, fun_call_langflow } from '../../services/supabase';
import { Message } from '@/types/message';
// Sistema de cache seguro
import { 
  saveSafeCache, 
  loadSafeCache, 
  convertToSafeCache, 
  convertToChatsFormat,
  addSessionToCache,
  updateSessionInCache,
  clearSafeCache 
} from '../../services/cache-service';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isEmpty: boolean;
  isActive: boolean;
}

export default function ChatPage() {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWelcomeMode, setIsWelcomeMode] = useState<boolean>(false);

  // Sistema de cache seguro como primário
  
  // Função para atualizar UI com dados frescos do servidor
  const updateUIWithServerData = (serverData: any) => {
    console.log('🔄 Atualizando UI com dados frescos do servidor');
    console.log('📊 Dados recebidos:', serverData);
    
    const serverChats = serverData.chat_sessions?.map((session: any) => ({
      id: session.chat_session_id,
      title: session.chat_session_title,
      lastMessage: session.messages?.length > 0 ? 
        session.messages[session.messages.length - 1].msg_output?.substring(0, 50) + '...' : 
        'Nova conversa',
      timestamp: getCurrentTimestampUTC(), // Usar timestamp atual já que não temos created_at
      isEmpty: !session.messages || session.messages.length === 0,
      isActive: false,
      message_count: session.messages?.length || 0
    })) || [];

    console.log('📝 Chats processados:', serverChats);
    setChats(serverChats);
    
    // Se está forçando welcome mode (veio do header ou clicou em "Novo Chat")
    if (isWelcomeForced) {
      console.log('🏠 Modo welcome forçado - mantendo tela de boas-vindas');
      setIsWelcomeMode(true);
      setMessages([]);
      setCurrentSessionId(null);
    } 
    // Se não está forçando welcome mode e há chats, pode carregar o primeiro
    else if (serverChats.length > 0) {
      console.log('🎯 Carregando primeira sessão disponível');
      const firstSession = serverChats[0];
      setCurrentSessionId(firstSession.id);
      setIsWelcomeMode(false);
      
      // Carregar mensagens da primeira sessão
      if (firstSession.message_count > 0) {
        fun_load_chat_session(firstSession.id);
      }
    } else {
      console.log('🏠 Nenhum chat disponível - modo welcome');
      setIsWelcomeMode(true);
    }
  };

  // Função para converter dados do sistema antigo para cache seguro
  const convertFromOldSystem = (oldData: any): any => {
    if (!oldData.chat_sessions) return null;
    
    return {
      user_id: user?.id || '',
      chat_sessions: oldData.chat_sessions.map((session: any) => ({
        chat_session_id: session.chat_session_id,
        chat_session_title: session.chat_session_title,
        messages: session.messages || [],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }))
    };
  };
  
  // Sistema de salvamento com cache seguro
  const saveToLocalStorage = (chatData: {
    chats: Chat[];
    currentSessionId: string | null;
    messages: Message[];
    isWelcomeMode: boolean;
  }) => {
    try {
      // Atualizar cache seguro com estado da UI
      const currentCache = loadSafeCache();
      if (currentCache && currentCache.user_id === user?.id) {
        currentCache.ui_state.currentSessionId = chatData.currentSessionId;
        currentCache.ui_state.isWelcomeMode = chatData.isWelcomeMode;
        
        // Atualizar contagem de mensagens se há sessão ativa
        if (chatData.currentSessionId && chatData.messages.length > 0) {
          updateSessionInCache(chatData.currentSessionId, {
            message_count: chatData.messages.length,
            last_updated: getCurrentTimestampUTC()
          });
        }
        
        saveSafeCache(currentCache);
      }
      
      // 🚀 MANTER SISTEMA HISTÓRICO PARA COMPATIBILIDADE (mensagens completas)
      if (chatData.currentSessionId && chatData.messages.length > 0) {
        updateUserChatData(chatData.currentSessionId, chatData.messages);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar dados:', error);
    }
  };

  // Função para atualizar user_chat_data (compatibilidade)
  const updateUserChatData = (sessionId: string, messages: Message[]) => {
    try {
      const existingData = localStorage.getItem('user_chat_data');
      let userData = existingData ? JSON.parse(existingData) : { chat_sessions: [] };
      
      // Encontrar ou criar sessão
      let session = userData.chat_sessions?.find((s: any) => s.chat_session_id === sessionId);
      
      if (!session) {
        session = {
          chat_session_id: sessionId,
          chat_session_title: messages[0]?.content?.substring(0, 50) || 'Nova conversa',
          messages: []
        };
        userData.chat_sessions = userData.chat_sessions || [];
        userData.chat_sessions.push(session);
      }
      
      // 🚀 PRESERVAR título existente (não sobrescrever se já foi renomeado)
      // Só atualiza título se for uma nova sessão ou se o título atual for genérico
      const isGenericTitle = session.chat_session_title === 'Nova conversa' || 
                            session.chat_session_title === 'Conversa existente' ||
                            !session.chat_session_title;
      
      if (isGenericTitle && messages[0]?.content) {
        session.chat_session_title = messages[0].content.substring(0, 50);
      }
      
      // Converter mensagens para formato histórico
      session.messages = [];
      for (let i = 0; i < messages.length; i += 2) {
        const userMsg = messages[i];
        const botMsg = messages[i + 1];
        
        if (userMsg && userMsg.sender === 'user') {
          session.messages.push({
            msg_input: userMsg.content,
            msg_output: botMsg?.content || ''
          });
        }
      }
      
      localStorage.setItem('user_chat_data', JSON.stringify(userData));
      console.log(`💾 user_chat_data atualizado (auto-save): ${sessionId.slice(0, 6)} - "${session.chat_session_title}"`);
    } catch (error) {
      console.warn('⚠️ Erro ao atualizar user_chat_data:', error);
    }
  };

  // Cache seguro + sistema antigo são suficientes durante transição

  // 🚀 AUTO-SAVE: Salvar automaticamente quando estados mudarem (apenas como cache)
  const [isInitialized, setIsInitialized] = useState(false);
  const [isWelcomeForced, setIsWelcomeForced] = useState(false);

  // Debug: Monitorar mudanças no isWelcomeMode
  useEffect(() => {
    console.log('🔔 isWelcomeMode mudou:', isWelcomeMode);
    console.log('🔔 isWelcomeForced:', isWelcomeForced);
    console.log('🔔 currentSessionId:', currentSessionId);
  }, [isWelcomeMode, isWelcomeForced, currentSessionId]);
  
  useEffect(() => {
    if (user?.id && isInitialized && (chats.length > 0 || messages.length > 0)) {
      // Só salva se já foi inicializado e há dados
      const timeoutId = setTimeout(() => {
        saveToLocalStorage({
          chats,
          currentSessionId,
          messages,
          isWelcomeMode
        });
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [chats, currentSessionId, messages, isWelcomeMode, user?.id, isInitialized]);

  // Função para carregar mensagens de uma sessão específica
  const fun_load_chat_session = (sessionId: string) => {
    try {
      console.log(`🔄 Carregando mensagens da sessão: ${sessionId}`);
      
      // Procurar mensagens nos dados do servidor (já carregados)
      const session = chats.find(chat => chat.id === sessionId);
      
      if (!session) {
        console.log('📭 Sessão não encontrada');
        setMessages([]);
        setCurrentSessionId(sessionId);
        setIsWelcomeMode(false);
        return;
      }
      
      // As mensagens já foram carregadas pela edge function
      // Vamos buscar do serverData que foi salvo
      const serverData = (window as any).__serverData;
      
      if (serverData?.chat_sessions) {
        const serverSession = serverData.chat_sessions.find((s: any) => s.chat_session_id === sessionId);
        
        if (serverSession?.messages && serverSession.messages.length > 0) {
          console.log(`✅ ${serverSession.messages.length} mensagens encontradas no servidor`);
          
          // Converter mensagens do servidor para formato Message
          const convertedMessages: Message[] = [];
          let messageId = 1;
          
          serverSession.messages.forEach((msg: any) => {
            // Mensagem do usuário
            if (msg.msg_input) {
              convertedMessages.push({
                id: messageId++,
                content: msg.msg_input,
                sender: 'user',
                timestamp: getCurrentTimestampUTC(),
                status: 'sent'
              });
            }
            
            // Resposta do bot
            if (msg.msg_output) {
              convertedMessages.push({
                id: messageId++,
                content: msg.msg_output,
                sender: 'bot',
                timestamp: getCurrentTimestampUTC()
              });
            }
          });
          
          setMessages(convertedMessages);
          setCurrentSessionId(sessionId);
          setIsWelcomeMode(false);
          
          console.log(`✅ ${convertedMessages.length} mensagens carregadas`);
          return;
        }
      }
      
      // Fallback: sem mensagens
      console.log('📭 Nenhuma mensagem encontrada');
      setMessages([]);
      setCurrentSessionId(sessionId);
      setIsWelcomeMode(false);
      
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens da sessão:', error);
      setMessages([]);
    }
  };

  // Função para criar nova sessão de chat (modo welcome)
  const fun_create_chat_session = () => {
    console.log('🆕 Criando nova sessão de chat - modo welcome');
    setCurrentSessionId(null);
    setMessages([]);
    setIsWelcomeMode(true); // Ativar modo welcome
    setIsWelcomeForced(true); // Forçar modo welcome
  };

  // Função para lidar com a primeira mensagem (transição welcome → conversa)
  const handleFirstMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    console.log('🚀 Processando primeira mensagem:', inputValue);

    // 1. Criar nova sessão (UUID válido)
    const newSessionId = crypto.randomUUID();
    
    // Criar primeira mensagem do usuário com status inicial
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
      status: 'sending', // Status inicial
    };
    
    // 3. Atualizar estados
    setCurrentSessionId(newSessionId);
    setMessages([userMessage]);
    setIsWelcomeMode(false); // Sair do modo welcome
    setIsLoading(true);
    
    // 4. Adicionar nova conversa ao sidebar
    const newChat: Chat = {
      id: newSessionId,
      title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
      lastMessage: '',
      timestamp: formatDateTimeBR(getCurrentTimestampUTC()),
      isEmpty: false,
      isActive: true,
    };
    
    setChats(prev => [
      newChat,
      ...prev.map(chat => ({ ...chat, isActive: false }))
    ]);

    // 5. Processar resposta da IA (usar lógica similar ao ChatArea)
    // Iniciar sequência de loading
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot' as const,
      timestamp: getCurrentTimestampUTC(),
      isLoading: true,
      loadingText: 'Consultando Base Legal vigente...',
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Sequência de loading (+100% tempo - mais lenta)
    const loadingSequence = [
      { text: 'Consultando Base Legal vigente...', delay: 3000 }, // 1500 * 2.0
      { text: 'Acessando Leis Federais...', delay: 2000 }, // 1000 * 2.0
      { text: 'Acessando Leis Estaduais...', delay: 1400 }, // 700 * 2.0
      { text: 'Acessando Documentos normativos:', delay: 1600 }, // 800 * 2.0
      { text: 'Provimentos, Codigo de Normas...', delay: 1000 }, // 500 * 2.0
      { text: 'Consolidando fundamentos jurídicos...', delay: 1200 }, // 600 * 2.0
      { text: 'O Dante está processando sua resposta, por favor aguarde...', delay: 0 }
    ];

    let currentDelay = 0;
    loadingSequence.forEach((step) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.isLoading ? { ...msg, loadingText: step.text } : msg
        ));
      }, currentDelay);
    });

    // Processar com Langflow usando função centralizada
    (async () => {
      try {
        if (!user?.id) {
          throw new Error('Usuário não autenticado');
        }

        console.log('🚀 Iniciando comunicação com Langflow...');

        // Chamar função centralizada do Langflow
        const langflowResult = await fun_call_langflow({
          input_value: inputValue,
          session_id: newSessionId,
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
          
          // Auto-save já cuida da persistência
          
          return newMessages;
        });

        // Atualizar cache seguro e estado da UI
        addSessionToCache({
          id: newSessionId,
          title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
          message_count: 2, // user + bot
          last_updated: getCurrentTimestampUTC()
        });
        
        // Atualizar estado da UI no cache
        const currentCache = loadSafeCache();
        if (currentCache && currentCache.user_id === user.id) {
          currentCache.ui_state.currentSessionId = newSessionId;
          currentCache.ui_state.isWelcomeMode = false;
          saveSafeCache(currentCache);
        }

        // Salvamento com retry robusto e status visual
        const updateMessageStatus = (messageId: number, status: 'sending' | 'sent' | 'failed') => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
          ));
        };

        // 🚀 SALVAMENTO NON-BLOCKING (BACKGROUND) COM STATUS
        saveInBackground({
          chat_session_id: newSessionId,
          chat_session_title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
          msg_input: inputValue,
          msg_output: treatedResponse,
          user_id: user.id
        }, updateMessageStatus, userMessage.id);

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
      }
    })();
  };





  // Redireciona para home se usuário não estiver logado + limpeza
  useEffect(() => {
    let mounted = true;

    if (!loading && !user && mounted) {
      console.log('🧹 Limpando dados e redirecionando (logout)');
      // Limpar cache seguro
      clearSafeCache();
      navigate('/', { replace: true });
    }

    return () => {
      mounted = false;
    };
  }, [user, loading, navigate]);

  // Redirecionar apenas se loading terminou e não há usuário
  useEffect(() => {
    let mounted = true;

    if (!loading && !user && mounted) {
      console.log('🚪 Sem usuário após loading, redirecionando...');
      navigate('/', { replace: true });
    }

    return () => {
      mounted = false;
    };
  }, [user, loading, navigate]);

  // Função de carregamento com cache seguro como primário
  const loadChatData = async (mounted: { current: boolean }) => {
    if (!user?.id || !mounted.current) return;

    console.log('🔄 Iniciando carregamento com cache seguro...');

    // 🎯 Verificar se veio do header (iniciar em welcome mas carregar dados)
    const state = location.state as { startWelcome?: boolean } | null;
    const fromHeader = state?.startWelcome;
    
    if (fromHeader) {
      console.log('🎯 Acesso via header - FORÇANDO modo welcome');
      console.log('🎯 Estado ANTES:', { isWelcomeMode, isWelcomeForced, currentSessionId });
      
      // Limpar o state para não repetir na próxima navegação
      navigate(location.pathname, { replace: true, state: {} });
      
      // Forçar modo welcome ANTES de carregar dados
      setIsWelcomeForced(true);
      setIsWelcomeMode(true);
      setMessages([]);
      setCurrentSessionId(null);
      
      console.log('🎯 Modo welcome forçado! Continuando para carregar chats no sidebar...');
    }

    // 1. Tentar cache seguro primeiro (UX rápida) - mas não sobrescrever welcome mode
    const safeCache = loadSafeCache();
    if (safeCache && safeCache.user_id === user.id) {
      console.log('⚡ Carregando do cache seguro');
      const convertedChats = convertToChatsFormat(safeCache.sessions).map(chat => ({
        id: chat.chat_session_id,
        title: chat.chat_session_title,
        lastMessage: '',
        timestamp: chat.last_updated ? formatDateTimeBR(chat.last_updated) : getCurrentTimestampUTC(),
        isEmpty: false,
        isActive: false,
        message_count: chat.message_count || 0
      }));
      
      if (mounted.current) {
        setChats(convertedChats);
        
        // Se não está forçando welcome, usar estado do cache
        if (!isWelcomeForced) {
          setCurrentSessionId(safeCache.ui_state.currentSessionId);
          setIsWelcomeMode(safeCache.ui_state.isWelcomeMode);
        }
        // Se está forçando welcome, manter os valores já setados
      }
    }

    // 2. Carregar dados atuais do servidor (usando session do AuthProvider)
    try {
      console.log('🌐 Carregando dados do servidor...');
      
      // Usar token da session do AuthProvider (já disponível, sem deadlock!)
      const token = session?.access_token;
      
      console.log('🔐 Token do AuthProvider:', !!token);
      
      if (!token) {
        console.warn('⚠️ Token não disponível no AuthProvider');
        throw new Error('Token não disponível - aguarde autenticação');
      }
      
      console.log('📡 Chamando fun_load_user_data com token do AuthProvider');
      const serverData = await fun_load_user_data(token);
      
      console.log('📊 Resposta do servidor:', serverData);
      console.log('📊 Success:', serverData?.success);
      console.log('📊 Data:', serverData?.data);
      console.log('📊 Error:', serverData?.error);
      
      if (serverData.success && serverData.data) {
        console.log('✅ Dados do servidor carregados:', serverData.data);
        console.log('📝 Sessões encontradas:', serverData.data.chat_sessions?.length || 0);
        
        // Salvar dados do servidor globalmente para acesso posterior
        (window as any).__serverData = serverData.data;
        
        // Atualizar UI com dados frescos (apenas se mounted)
        if (mounted.current) {
          updateUIWithServerData(serverData.data);
        }
        
        // Salvar cache seguro atualizado
        const safeCacheData = convertToSafeCache(serverData.data);
        safeCacheData.ui_state.currentSessionId = safeCache?.ui_state.currentSessionId || null;
        safeCacheData.ui_state.isWelcomeMode = safeCache?.ui_state.isWelcomeMode ?? (serverData.data.chat_sessions?.length === 0);
        
        saveSafeCache(safeCacheData);
        
      } else {
        console.warn('⚠️ Falha ao carregar dados do servidor:', serverData.error);
        
        // 3. Manter fallback para sistema antigo (temporário)
        if (!safeCache) {
          console.log('🔄 Fallback para sistema antigo');
          const oldCache = localStorage.getItem('user_chat_data');
          if (oldCache) {
            try {
              const parsedOldData = JSON.parse(oldCache);
              const convertedServerData = convertFromOldSystem(parsedOldData);
              
              if (convertedServerData) {
                updateUIWithServerData(convertedServerData);
                
                // Migrar dados antigos para cache seguro
                const migratedCache = convertToSafeCache(convertedServerData);
                migratedCache.ui_state.isWelcomeMode = parsedOldData.chat_sessions?.length === 0;
                saveSafeCache(migratedCache);
                
                console.log('✅ Dados migrados do sistema antigo para cache seguro');
              } else {
                // Estado padrão se conversão falhar
                setChats([]);
                setMessages([]);
                setCurrentSessionId(null);
                setIsWelcomeMode(true);
              }
            } catch (error) {
              console.error('❌ Erro ao converter dados antigos:', error);
              setChats([]);
              setMessages([]);
              setCurrentSessionId(null);
              setIsWelcomeMode(true);
            }
          } else {
            // Estado padrão se não há dados
            console.log('📭 Nenhum dado encontrado, estado padrão');
            setChats([]);
            setMessages([]);
            setCurrentSessionId(null);
            setIsWelcomeMode(true);
          }
        }
      }
    } catch (error) {
      console.error('❌ ERRO CAPTURADO ao carregar dados do servidor:', error);
      console.error('❌ Tipo do erro:', error instanceof Error ? error.message : typeof error);
      
      // Estado padrão em caso de erro
      if (!safeCache) {
        console.log('📭 Sem cache e sem dados do servidor, estado padrão');
        setChats([]);
        setMessages([]);
        setCurrentSessionId(null);
        setIsWelcomeMode(true);
      }
    } finally {
      // Marcar como inicializado sempre, mesmo com erro
      console.log('✅ Carregamento concluído, marcando como inicializado');
      setIsInitialized(true);
    }
  };

  // 🚀 CARREGAR DADOS: Nova implementação com cache seguro (apenas uma vez)
  useEffect(() => {
    const mounted = { current: true };

    if (user && session && !loading && !isInitialized) {
      console.log('✅ User e session disponíveis, carregando dados...');
      loadChatData(mounted);
    } else if (!isInitialized) {
      console.log('⏳ Aguardando:', { user: !!user, session: !!session, loading });
    }

    return () => {
      mounted.current = false;
    };
  }, [user, session, loading, isInitialized]);

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
          onNewChat={fun_create_chat_session}
          currentSessionId={currentSessionId}
        />
        
        {/* Área de chat à direita */}
        <ChatArea 
          messages={messages}
          setMessages={setMessages}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          isWelcomeMode={isWelcomeMode}
          onFirstMessage={handleFirstMessage}
          currentSessionId={currentSessionId}
        />
      </div>
    </div>
  );
}