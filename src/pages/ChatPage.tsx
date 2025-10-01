import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatHeader from '@/components/chat_header';
import SidebarCollapse from '@/components/sidebar_collapse';
import ChatArea from '@/components/chat_area';
import { useAuth } from '@/components/auth/AuthProvider';
import { getCurrentTimestampUTC, formatDateTimeBR } from '@/utils/timezone';
import { fun_save_chat_data } from '../../services/supabase';

// 🚀 FUNÇÃO PARA SALVAMENTO EM BACKGROUND (NON-BLOCKING)
const saveInBackground = (data: any) => {
  // Usar primeiros 6 chars do UUID da sessão
  const sessionId = data.chat_session_id.slice(0, 6);
  
  Promise.resolve().then(async () => {
    try {
      console.log(`💾 ${sessionId}: ${data.msg_input.slice(0, 20)}...`);
      const result = await fun_save_chat_data(data);
      
      if (result.success) {
        console.log(`✅ ${sessionId} salva`);
      } else {
        console.warn(`⚠️ ${sessionId} falha:`, result.error);
      }
    } catch (error) {
      console.error(`❌ ${sessionId} erro:`, error.message);
    }
  });
};

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
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isWelcomeMode, setIsWelcomeMode] = useState<boolean>(false);

  // 🚀 SISTEMA DE PERSISTÊNCIA AUTOMÁTICA NO LOCALSTORAGE
  const STORAGE_KEY = 'dante_chat_data';
  
  // Função para salvar estado completo no localStorage
  const saveToLocalStorage = (chatData: {
    chats: Chat[];
    currentSessionId: string | null;
    messages: Message[];
    isWelcomeMode: boolean;
  }) => {
    try {
      const dataToSave = {
        ...chatData,
        timestamp: Date.now(),
        userId: user?.id
      };
      
      // 🚀 SALVAR NO SISTEMA UNIFICADO
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      
      // 🚀 SALVAR TAMBÉM NO SISTEMA HISTÓRICO (COMPATIBILIDADE)
      if (chatData.currentSessionId && chatData.messages.length > 0) {
        updateUserChatData(chatData.currentSessionId, chatData.messages);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao salvar no localStorage:', error);
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
    } catch (error) {
      console.warn('⚠️ Erro ao atualizar user_chat_data:', error);
    }
  };

  // Função para carregar estado completo do localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return null;
      
      const parsedData = JSON.parse(savedData);
      
      // Verificar se os dados são do usuário atual
      if (parsedData.userId !== user?.id) {
        console.log('🔄 Dados de outro usuário, limpando localStorage');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      console.log('📂 Estado carregado do localStorage:', parsedData);
      return parsedData;
    } catch (error) {
      console.warn('⚠️ Erro ao carregar do localStorage:', error);
      return null;
    }
  };

  // 🚀 AUTO-SAVE: Salvar automaticamente quando estados mudarem (apenas como cache)
  const [isInitialized, setIsInitialized] = useState(false);
  const [isWelcomeForced, setIsWelcomeForced] = useState(false);
  
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
      
      // 🚀 PRIORIDADE 1: Buscar no sistema unificado (dante_chat_data)
      const danteData = loadFromLocalStorage();
      if (danteData && danteData.currentSessionId === sessionId && danteData.messages?.length > 0) {
        console.log('📂 Carregando mensagens do cache unificado');
        setMessages(danteData.messages);
        setCurrentSessionId(sessionId);
        setIsWelcomeMode(false);
        return;
      }
      
      // 🚀 PRIORIDADE 2: Buscar dados históricos (user_chat_data)
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
        setIsWelcomeMode(false); // Desativar modo welcome
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
      setIsWelcomeMode(false); // Desativar modo welcome
      
      // Auto-save já cuida da persistência
      
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
  };

  // Função para lidar com a primeira mensagem (transição welcome → conversa)
  const handleFirstMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    console.log('🚀 Processando primeira mensagem:', inputValue);

    // 1. Criar nova sessão (UUID válido)
    const newSessionId = crypto.randomUUID();
    
    // 2. Criar primeira mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: getCurrentTimestampUTC(),
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
      sender: 'bot',
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
    loadingSequence.forEach((step, index) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.isLoading ? { ...msg, loadingText: step.text } : msg
        ));
      }, currentDelay);
    });

    // Processar com Langflow real (sem simulação de tempo)
    (async () => {
      try {
        if (!user?.id) {
          throw new Error('Usuário não autenticado');
        }

        console.log('🚀 Iniciando comunicação com Langflow...');

        // Chamar apenas Langflow (sem salvamento automático)
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
          "session_id": newSessionId
        };
        
        console.log('📋 Payload para Langflow:', payload);

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
          
          // Auto-save já cuida da persistência
          
          return newMessages;
        });

        // 🚀 SALVAMENTO NON-BLOCKING (BACKGROUND)
        saveInBackground({
          chat_session_id: newSessionId,
          chat_session_title: inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue,
          msg_input: inputValue,
          msg_output: treatedResponse,
          user_id: user.id
        });

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
      }
    })();
  };

  // Função para carregar apenas o sidebar sem ativar sessão (para modo welcome)
  const fun_load_sidebar_only = () => {
    try {
      console.log('🔄 Carregando apenas dados do sidebar (modo welcome)...');
      
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
      
      // Converter sessões para formato do Chat SEM ATIVAR NENHUMA
      const loadedChats: Chat[] = parsedData.chat_sessions.map((session: any) => ({
        id: session.chat_session_id,
        title: session.chat_session_title,
        lastMessage: '',
        timestamp: '19/Jan/25 - 14:30', // Mantém hardcoded como solicitado
        isEmpty: false,
        isActive: false // TODAS INATIVAS para modo welcome
      }));
      
      console.log(`✅ ${loadedChats.length} sessões carregadas no sidebar (modo welcome)`);
      setChats(loadedChats);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
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
      
      // Carregar primeira sessão automaticamente APENAS se não for welcome forçado
      if (loadedChats.length > 0 && !isWelcomeForced) {
        fun_load_chat_session(loadedChats[0].id);
      } else {
        // Se não há sessões OU welcome foi forçado, ativar modo welcome
        setMessages([]);
        setCurrentSessionId(null);
        setIsWelcomeMode(true);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do sidebar:', error);
      setChats([]);
      // Ativar modo welcome em caso de erro
      setMessages([]);
      setCurrentSessionId(null);
      setIsWelcomeMode(true);
    }
  };

  // Redireciona para home se usuário não estiver logado + limpeza
  useEffect(() => {
    if (!loading && !user) {
      console.log('🧹 Limpando dados e redirecionando (logout)');
      localStorage.removeItem(STORAGE_KEY);
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // 🚀 CARREGAR DADOS: PRIORIDADE PARA HISTÓRICO, FALLBACK PARA LOCALSTORAGE
  useEffect(() => {
    if (user && !loading) {
      // Inicializando ChatPage
      
      // 🎯 PRIORIDADE MÁXIMA: Verificar se veio do header (SEMPRE WELCOME)
      const state = location.state as { startWelcome?: boolean } | null;
      if (state?.startWelcome) {
        console.log('🎯 FORÇANDO modo welcome via header');
        
        // Carregar sidebar mas SEM ativar nenhuma sessão
        const userChatData = localStorage.getItem('user_chat_data');
        if (userChatData) {
          fun_load_sidebar_only(); // Esta função NÃO carrega sessão automaticamente
        } else {
          setChats([]);
        }
        
        // FORÇAR welcome mode e BLOQUEAR carregamento automático
        setMessages([]);
        setCurrentSessionId(null);
        setIsWelcomeMode(true);
        setIsWelcomeForced(true); // Flag para bloquear interferências
        
        navigate(location.pathname, { replace: true });
        setTimeout(() => setIsInitialized(true), 1000);
        return;
      }
      
      // PRIORIDADE 1: Verificar se há dados históricos no user_chat_data
      const userChatData = localStorage.getItem('user_chat_data');
      
      if (userChatData) {
        console.log('📚 Dados históricos encontrados, carregando do user_chat_data');
        fun_load_sidebar(); // Carrega dados históricos
      } else {
        // PRIORIDADE 2: Tentar carregar do localStorage (cache temporário)
        const savedData = loadFromLocalStorage();
        
        if (savedData) {
          // Restaurando estado do cache
          setChats(savedData.chats || []);
          setCurrentSessionId(savedData.currentSessionId);
          setMessages(savedData.messages || []);
          setIsWelcomeMode(savedData.isWelcomeMode ?? true);
        } else {
          console.log('📭 Nenhum dado encontrado, inicializando estado padrão');
          setChats([]);
          setMessages([]);
          setCurrentSessionId(null);
          setIsWelcomeMode(true);
        }
      }
      
      // Marcar como inicializado após carregamento
      setTimeout(() => setIsInitialized(true), 1000);
    }
  }, [user, loading, location.state]);

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