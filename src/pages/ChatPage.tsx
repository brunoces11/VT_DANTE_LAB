import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCurrentTimestampUTC, formatDateTimeBR } from '@/utils/timezone';
import { fun_load_user_data, saveInBackground } from '../../services/supabase';
import { fun_call_langflow } from '../../services/langflow';
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
    
    // Carregar cache local para priorizar títulos atualizados
    const localCache = loadSafeCache();
    
    const serverChats = serverData.chat_sessions?.map((session: any) => {
      // Priorizar título do cache local se disponível (mais recente)
      const cachedSession = localCache?.sessions.find((s: any) => s.id === session.chat_session_id);
      const title = cachedSession?.title || session.chat_session_title;
      
      return {
        id: session.chat_session_id,
        title: title, // Usar título do cache se disponível
        lastMessage: session.messages?.length > 0 ? 
          session.messages[session.messages.length - 1].msg_output?.substring(0, 50) + '...' : 
          'Nova conversa',
        timestamp: getCurrentTimestampUTC(), // Usar timestamp atual já que não temos created_at
        isEmpty: !session.messages || session.messages.length === 0,
        isActive: false,
        message_count: session.messages?.length || 0
      };
    }) || [];

    console.log('📝 Chats processados (com cache local):', serverChats);
    
    // 🎯 NOVA LÓGICA: Priorizar restauração do estado persistido
    const cachedSessionId = localCache?.ui_state.currentSessionId;
    const cachedWelcomeMode = localCache?.ui_state.isWelcomeMode;
    
    console.log('🔍 Estado do cache:', { 
      cachedSessionId: cachedSessionId?.slice(0, 6), 
      cachedWelcomeMode, 
      isWelcomeForced,
      serverChatsCount: serverChats.length 
    });
    
    // 🚀 OTIMIZAÇÃO: Batch todas as atualizações de estado em uma única transição
    React.startTransition(() => {
      // Se está forçando welcome mode (veio do header ou clicou em "Novo Chat")
      if (isWelcomeForced) {
        console.log('🏠 Modo welcome forçado - mantendo tela de boas-vindas');
        setChats(serverChats);
        setIsWelcomeMode(true);
        setMessages([]);
        setCurrentSessionId(null);
      }
      // 🎯 PRIORIDADE MÁXIMA: Se há estado persistido no cache E a sessão existe no servidor
      else if (cachedSessionId && serverChats.find((chat: any) => chat.id === cachedSessionId)) {
        console.log('🔄 RESTAURANDO estado persistido do cache:', cachedSessionId.slice(0, 6));
        
        // Marcar o chat como ativo no sidebar
        const chatsWithActive = serverChats.map((chat: any) => ({
          ...chat,
          isActive: chat.id === cachedSessionId
        }));
        
        // 🎯 CARREGAR MENSAGENS IMEDIATAMENTE dos dados do servidor
        console.log('📨 Carregando mensagens da sessão restaurada DIRETAMENTE do servidor...');
        const serverSession = serverData.chat_sessions?.find((s: any) => s.chat_session_id === cachedSessionId);
        
        let convertedMessages: Message[] = [];
        if (serverSession?.messages && serverSession.messages.length > 0) {
          console.log(`✅ ${serverSession.messages.length} mensagens encontradas para restauração`);
          
          // Converter mensagens do servidor para formato Message
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
          
          console.log(`🎯 RESTAURANDO ${convertedMessages.length} mensagens IMEDIATAMENTE`);
          console.log('📋 Mensagens restauradas:', convertedMessages.map(m => `${m.sender}: ${m.content.substring(0, 30)}...`));
        } else {
          console.log('📭 Nenhuma mensagem encontrada para a sessão restaurada');
        }
        
        // Atualizar todos os estados de uma vez
        setChats(chatsWithActive);
        setCurrentSessionId(cachedSessionId);
        setIsWelcomeMode(false);
        setMessages(convertedMessages);
      }
      // Se cache indica welcome mode explicitamente
      else if (cachedWelcomeMode === true) {
        console.log('🏠 Restaurando modo welcome do cache (explícito)');
        setChats(serverChats);
        setIsWelcomeMode(true);
        setMessages([]);
        setCurrentSessionId(null);
      }
      // Se não há chats no servidor
      else if (serverChats.length === 0) {
        console.log('🏠 Nenhum chat no servidor - modo welcome');
        setChats(serverChats);
        setIsWelcomeMode(true);
        setMessages([]);
        setCurrentSessionId(null);
      }
      // 🎯 FALLBACK SEGURO: Se há chats mas nenhum estado válido no cache
      else if (serverChats.length > 0) {
        console.log('⚠️ Sem estado válido no cache, mas há chats - usando Welcome Mode por segurança');
        // 🚨 IMPORTANTE: Não carregar automaticamente o primeiro chat após refresh
        // Isso evita a "tela em branco" e força o usuário a selecionar explicitamente
        setChats(serverChats);
        setIsWelcomeMode(true);
        setMessages([]);
        setCurrentSessionId(null);
      } 
      // Estado padrão final
      else {
        console.log('🏠 Estado padrão - modo welcome');
        setChats(serverChats);
        setIsWelcomeMode(true);
        setMessages([]);
        setCurrentSessionId(null);
      }
    });
  };

  // ✅ v2.0: convertFromOldSystem removida - migração automática em cache-service.ts

  // 🎯 SISTEMA DE PERSISTÊNCIA ROBUSTO seguindo padrão Supabase
  const persistUIState = (sessionId: string | null, welcomeMode: boolean) => {
    try {
      const currentCache = loadSafeCache();
      if (currentCache && currentCache.user_id === user?.id) {
        currentCache.ui_state.currentSessionId = sessionId;
        currentCache.ui_state.isWelcomeMode = welcomeMode;
        saveSafeCache(currentCache);
        
        console.log('💾 Estado da UI persistido:', {
          sessionId: sessionId?.slice(0, 6) || 'null',
          welcomeMode,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('⚠️ Erro ao persistir estado da UI:', error);
    }
  };

  // Sistema de salvamento com cache seguro
  const saveToLocalStorage = (chatData: {
    chats: Chat[];
    currentSessionId: string | null;
    messages: Message[];
    isWelcomeMode: boolean;
  }) => {
    try {
      // 🎯 Persistir estado da UI no cache unificado v2.0
      persistUIState(chatData.currentSessionId, chatData.isWelcomeMode);

      // ✅ v2.0: Atualizar sessão com recent_messages para preview rápido
      if (chatData.currentSessionId && chatData.messages.length > 0) {
        // Extrair últimas 3 trocas de mensagens (6 mensagens = 3 pares user/bot)
        const recentMsgs = [];
        const startIdx = Math.max(0, chatData.messages.length - 6);

        for (let i = startIdx; i < chatData.messages.length; i += 2) {
          const userMsg = chatData.messages[i];
          const botMsg = chatData.messages[i + 1];
          if (userMsg && userMsg.sender === 'user') {
            recentMsgs.push({
              user: userMsg.content.substring(0, 100),
              bot: botMsg?.content?.substring(0, 200) || ''
            });
          }
        }

        updateSessionInCache(chatData.currentSessionId, {
          message_count: chatData.messages.length,
          last_updated: getCurrentTimestampUTC(),
          recent_messages: recentMsgs
        });
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar dados:', error);
    }
  };

  // ✅ v2.0: Função updateUserChatData REMOVIDA
  // Cache unificado SafeCache v2.0 substitui user_chat_data completamente
  // Migração automática: user_chat_data → SafeCache v2.0 (backup de 7 dias)

  // 🚀 AUTO-SAVE: Salvar automaticamente quando estados mudarem (apenas como cache)
  const [isInitialized, setIsInitialized] = useState(false);
  const [isWelcomeForced, setIsWelcomeForced] = useState(false);

  // 🎯 MONITORAR E PERSISTIR mudanças de estado críticas
  useEffect(() => {
    console.log('🔔 Estado mudou:', { 
      isWelcomeMode, 
      isWelcomeForced, 
      currentSessionId: currentSessionId?.slice(0, 6) || 'null',
      isInitialized 
    });
    
    // 🎯 Persistir estado imediatamente quando há mudanças críticas
    if (isInitialized && user?.id && !isWelcomeForced) {
      persistUIState(currentSessionId, isWelcomeMode);
    }
  }, [isWelcomeMode, currentSessionId, isInitialized, user?.id, isWelcomeForced]);
  
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
        
        // 🎯 PERSISTIR estado no cache
        persistUIState(sessionId, false);
        return;
      }
      
      // ✅ v2.0: Buscar mensagens do cache ou window.__serverData (transição)
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
          
          // 🎯 PERSISTIR estado no cache
          persistUIState(sessionId, false);
          
          console.log(`✅ ${convertedMessages.length} mensagens carregadas`);
          return;
        }
      }
      
      // Fallback: sem mensagens mas sessão válida
      console.log('📭 Nenhuma mensagem encontrada, mas sessão válida');
      setMessages([]);
      setCurrentSessionId(sessionId);
      setIsWelcomeMode(false);
      
      // 🎯 PERSISTIR estado no cache
      persistUIState(sessionId, false);
      
    } catch (error) {
      console.error('❌ Erro ao carregar mensagens da sessão:', error);
      setMessages([]);
      // 🎯 Em caso de erro, voltar para welcome mode
      setIsWelcomeMode(true);
      setCurrentSessionId(null);
    }
  };

  // Função para criar nova sessão de chat (modo welcome)
  const fun_create_chat_session = () => {
    console.log('🆕 Criando nova sessão de chat - modo welcome');
    setCurrentSessionId(null);
    setMessages([]);
    setIsWelcomeMode(true); // Ativar modo welcome
    setIsWelcomeForced(true); // Forçar modo welcome
    
    // 🎯 PERSISTIR estado welcome no cache
    persistUIState(null, true);
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
      
      // 🎯 PERSISTIR estado welcome no cache IMEDIATAMENTE
      persistUIState(null, true);
      
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
          const cachedSessionId = safeCache.ui_state.currentSessionId;
          const cachedWelcomeMode = safeCache.ui_state.isWelcomeMode;
          
          console.log('🔄 Restaurando estado do cache:', {
            sessionId: cachedSessionId?.slice(0, 6),
            welcomeMode: cachedWelcomeMode
          });
          
          // 🎯 Se há sessão no cache, verificar se ela existe nos chats carregados
          if (cachedSessionId && convertedChats.find(chat => chat.id === cachedSessionId)) {
            console.log('✅ Sessão do cache encontrada nos chats, restaurando...');
            setCurrentSessionId(cachedSessionId);
            setIsWelcomeMode(false);
            
            // Marcar como ativo no sidebar
            setChats(prev => prev.map(chat => ({
              ...chat,
              isActive: chat.id === cachedSessionId
            })));
            
            // 🎯 NOTA: As mensagens serão carregadas quando os dados do servidor chegarem
            // Não precisamos carregar aqui pois será feito em updateUIWithServerData
            console.log('📝 Sessão restaurada, mensagens serão carregadas com dados do servidor');
          } else {
            // Se não há sessão válida no cache, usar welcome mode
            console.log('⚠️ Sessão do cache não encontrada, usando welcome mode');
            setCurrentSessionId(null);
            setIsWelcomeMode(true);
          }
        } else {
          console.log('🏠 Mantendo modo welcome forçado, ignorando cache');
        }
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
          console.log('🎯 Atualizando UI com dados do servidor - incluindo mensagens');
          updateUIWithServerData(serverData.data);
        }
        
        // Salvar cache seguro atualizado
        const safeCacheData = convertToSafeCache(serverData.data);
        
        // 🎯 Se está forçando welcome mode, manter esse estado no cache
        if (isWelcomeForced) {
          safeCacheData.ui_state.currentSessionId = null;
          safeCacheData.ui_state.isWelcomeMode = true;
          console.log('🏠 Mantendo welcome mode forçado no cache');
        } else {
          // Usar estado do cache existente ou padrão baseado nos dados
          safeCacheData.ui_state.currentSessionId = safeCache?.ui_state.currentSessionId || null;
          safeCacheData.ui_state.isWelcomeMode = safeCache?.ui_state.isWelcomeMode ?? (serverData.data.chat_sessions?.length === 0);
        }
        
        saveSafeCache(safeCacheData);
        
      } else {
        console.warn('⚠️ Falha ao carregar dados do servidor:', serverData.error);
        
        // ✅ v2.0: Fallback removido - migração automática em loadSafeCache()
        // Sistema legado (user_chat_data) é migrado automaticamente na primeira carga
        if (!safeCache) {
          console.log('📭 Sem cache e falha no servidor, estado padrão');
          setChats([]);
          setMessages([]);
          setCurrentSessionId(null);
          setIsWelcomeMode(true);
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
      
      // 🎯 Resetar isWelcomeForced após carregamento inicial para permitir navegação normal
      if (isWelcomeForced) {
        setTimeout(() => {
          console.log('🔄 Resetando isWelcomeForced após carregamento inicial');
          setIsWelcomeForced(false);
        }, 1000); // Aguardar 1 segundo para garantir que a UI foi renderizada
      }
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
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada se usuário não estiver logado (será redirecionado)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
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